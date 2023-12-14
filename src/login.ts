import { cloneDeep } from 'lodash-es'
import jwtDecode from 'jwt-decode'
import { apaasAxios } from './axios'
import tenantInfo from './tenantInfo'
import { lsProxy } from './storageProxy'
// import { functionCheck } from './utils'

type JwtResult = {
  LoginUser: IAny
  exp: number
} | null

class Login {
  private cache: IAny = {}

  private getData (key: string) {
    if (this.cache[key]) {
      return this.cache[key]
    } else {
      const data = lsProxy.getItem(key)
      this.cache[key] = data
      return data
    }
  }

  private setData (key: string, value: any) {
    this.cache[key] = value
    lsProxy.setItem(key, value)
  }

  private removeData (key: string) {
    delete this.cache[key]
    lsProxy.removeItem(key)
  }

  getEnvname () {
    return this.getData('envname')
  }

  setEnvname (value: string) {
    this.setData('envname', value)
  }

  removeEnvname () {
    this.removeData('envname')
  }

  getToken () {
    return this.getData('token')
  }

  setToken (value: string) {
    this.setData('token', value)
  }

  removeToken () {
    this.removeData('token')
  }

  getTokenExpires () {
    return this.getData('tokenexpires')
  }

  setTokenExpires (value: string) {
    this.setData('tokenexpires', value)
  }

  removeTokenExpires () {
    this.removeData('tokenexpires')
  }

  getRefreshToken () {
    return this.getData('refreshtoken')
  }

  setRefreshToken (value: string) {
    this.setData('refreshtoken', value)
  }

  removeRefreshToken () {
    this.removeData('refreshtoken')
  }

  private updateToken () {
    return apaasAxios.get('/api/auth/refreshtoken', {
      params: {
        refreshtoken: this.getRefreshToken()
      },
      isShowLoadding: false,
      isShowErrorMessage: false
    }).then((res: any) => {
      // console.log(res)
      const data = res?.data
      if (data) {
        this.setToken(data.token)
        this.setRefreshToken(data.refreshtoken)
        this.setTokenExpires(data.tokenexpires)
      }
    })
  }

  private refreshtokenTimer: number | null = null

  startRefreshtoken () {
    // 如果有登录 则过期前15秒更新token
    // 如果没登录 每隔1分钟走token更新逻辑(如果刚开始没登录 后面才登录【不需要再在登陆后写刷新token逻辑】)
    this.stopRefreshtoken()
    const time = this.checkLogin() ? (Number(this.getTokenExpires()) - Date.now() - 1000 * 15) : (1000 * 60)
    // const time = 5000
    if (time > 0) {
      this.refreshtokenTimer = window.setTimeout(async () => {
        if (this.checkLogin()) {
          await this.updateToken()
        }
        this.startRefreshtoken()
      }, time)
    }
  }

  private stopRefreshtoken () {
    clearTimeout(this.refreshtokenTimer as number)
    this.refreshtokenTimer = null
  }

  getUser (key?: string): any {
    const user = this.getData('user')
    const userObj = user ? JSON.parse(user) : null
    if (!key) {
      return userObj
    } else {
      return userObj ? (userObj[key] || '') : ''
    }
  }

  setUser (value: string | IAny) {
    let res
    if (typeof value === 'string') {
      res = JSON.parse(value)
    } else {
      res = cloneDeep(value)
    }

    for (const x in res) {
      res[x.toLowerCase()] = res[x]
    }

    this.setData('user', JSON.stringify(res))
  }

  setUserByToken (token: string) {
    const jwtInfo = this.jwtDecode(token)
    if (jwtInfo && jwtInfo.LoginUser) {
      this.setUser(jwtInfo.LoginUser)
    } else {
      this.removeUser()
    }
  }

  removeUser () {
    this.removeData('user')
  }

  private jwtDecode (token?: string) {
    if (!token) {
      console.error('token为空 jwt解析token出错')
      return null
    }
    try {
      return jwtDecode<JwtResult>(token)
    } catch (e) {
      console.error('jwt解析token出错', token, e)
      return null
    }
  }

  // 检测用户是否登录状态
  checkLogin () {
    let haslogged = false
    const token = this.getToken()
    const refreshtoken = this.getRefreshToken()
    const tokenexpires = this.getTokenExpires()
    const now = Date.now()
    if (token && refreshtoken && tokenexpires && Number(tokenexpires) > now) {
      // 优化成用 jwt 解析token 获取过期时间 不需要请求接口
      const jwtInfo = this.jwtDecode(token)
      if (jwtInfo?.exp) {
        haslogged = Number(jwtInfo.exp + '000') > now
      } else {
        haslogged = false
      }
    }
    return haslogged
  }

  // 接口请求回来的 userInfo 有 functioncodes 以便做权限校验
  async getAndSetUserInfo () {
    return apaasAxios.post('/api/teapi/rolepermission/account/getaccountinfo', {
      positionid: this.getUser('positioncode'),
      deviceinfo: 'h5',
      sysversion: 'h5',
      clientversion: 'h5'
    }).then((res: any) => {
      // console.log(res)
      // debugger
      if (res.code === 200 && res.data) {
        this.setUser(res.data)
      }
    })
  }

  // 单点登录
  async singleLogin (query: IAny) {
    // 自动登录
    query = cloneDeep(query)
    const token = query.token
    // 之所以不强制校验 refreshtoken tokenexpires 是因为安装卸载配置页面有可能放在产品运营中心 没有这两字段
    if (token) {
      this.setToken(token)
      this.setUserByToken(token) // 解析token为用户信息存入

      const refreshtoken = query.refreshtoken
      const tokenexpires = query.tokenexpires
      if (refreshtoken) {
        this.setRefreshToken(refreshtoken)
      }
      if (tokenexpires) {
        this.setTokenExpires(tokenexpires)
      }
      // debugger

      // context 上下文字段 产品运营中心安装 卸载 配置 和 产品配置中心业务配置 页面需要用到
      let context = query.context
      if (context) {
        context = decodeURIComponent(context)
        lsProxy.setItem('context', context)
        delete query.context
      }

      await tenantInfo.getAndSave()
      await this.getAndSetUserInfo()

      // const ischeck = functionCheck('1429379220684842752')
      // console.log(ischeck)
    } else {
      console.error('query 中没有 token，无法单点登录。')
    }
    // 单点登录后 无论是否成功 都需要删除 query 中相关参数
    delete query.token
    delete query.refreshtoken
    delete query.tokenexpires
    // debugger
    return {
      query
    }
  }
}

export default new Login()
