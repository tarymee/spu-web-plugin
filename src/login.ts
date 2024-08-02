import { cloneDeep } from 'lodash-es'
import jwtDecode from 'jwt-decode'
import { lsProxy, axios } from './index'
import cloudServ from './cloudServ'
// import { functionCheck } from './utils'


// window.aPaaS = {
//   getWebInitParams (callback: any) {
//     callback && callback({
//       envname: 'xxx'
//     })
//   }
// }


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

  async getEnvname (): Promise<string> {
    let envname = ''

    // web 查 context 的 envname
    let context: any = lsProxy.getItem('context')
    context && (context = JSON.parse(context))
    const contextEnvname = context?.envname || ''

    // 链接有些spu可能会传 envname
    const queryEnvname = this.getQueryEnvname()

    if (contextEnvname) {
      envname = contextEnvname
    } else if (queryEnvname) {
      envname = queryEnvname
    } else if (window?.aPaaS?.getWebInitParams && window?.Native?.setNavigationBarReturnButton) {
      // 手机端 查 envname
      // 只有手机端有 setNavigationBarReturnButton 方法
      envname = await new Promise((resolve, reject) => {
        window.aPaaS.getWebInitParams((params: any) => {
          resolve(params?.envname || '')
        })
      })
    }

    return envname
  }

  setQueryEnvname (value: string) {
    this.setData('envname', value)
  }

  getQueryEnvname () {
    return this.getData('envname') || ''
  }

  removeQueryEnvname () {
    this.removeData('envname')
  }

  getToken () {
    return this.getData('token')
    // return lsProxy.getItem('token')
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

  updateToken () {
    const token = this.getToken()
    const refreshtoken = this.getRefreshToken()
    return axios.get('/api/auth/refreshtoken', {
      params: {
        refreshtoken: this.checkTokenLogin(token) ? token : refreshtoken
      },
      isShowLoadding: false,
      isShowErrorMessage: false,
      isSendToken: false,
      headers: {
        token: this.checkTokenLogin(token) ? token : refreshtoken
      }
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
    // const time = 60000
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

  // // 产品运营中心token
  // {
  //   "LoginUser": {
  //     "appId": "100",
  //     "tenantCode": "1656652",
  //     "productCode": "100000000000000000",
  //     "productVersionCode": null,
  //     "clientTypeCode": null,
  //     "userCode": "6",
  //     "accountCode": "6",
  //     "username": "庄焕滨",
  //     "tokenId": "bd69b4a4-5376-47cd-91c3-f1e1576440e5",
  //     "appCodes": null,
  //     "appCode": null,
  //     "platRoleCodes": ["1637696814759153664"],
  //     "metamodeltype": 2,
  //     "orgCode": "1751852081616130048",
  //     "centerRole": true
  //   },
  //   "TwoFactorAuthCode": "6f56da978dffe31a3b03a56c446f9467",
  //   "exp": 1751694745
  // }

  // // 租户token
  // {
  //   "exp": 1720161305,
  //   "LoginUser": {
  //     "accountInfoCode": "1803686723986010112",
  //     "accountCode": "1803686724107644928",
  //     "tenantCode": "3000911",
  //     "productCode": "100000000000000000",
  //     "productVersionCode": "30000000000000911",
  //     "clientTypeCode": 1,
  //     "tokenId": "8614059e-69a5-4e1e-a948-f2ef680d0dd5",
  //     "orgCode": "1803686397149065216",
  //     "userInfoId": "1806591894588108800",
  //     "userInfoName": "woOUQJEAAAn4r5-7jffaxad6yotbEZ5A",
  //     "positionCode": "1803686397304254473",
  //     "positionName": "系统管理员-勿删",
  //     "memberCode": "1806591894659411968",
  //     "refPositionCode": "1300728614534385664",
  //     "categoryCode": "",
  //     "orgStructTypeId": "1",
  //     "userName": null,
  //     "userName1": "woOUQJEAAAn4r5-7jffaxad6yotbEZ5A",
  //     "userName2": null,
  //     "userName3": null,
  //     "tenantName": "智慧100-企微版-V9.1.1开发租户",
  //     "appCode": "sales",
  //     "appCodes": [
  //       "promotion",
  //       "distribution",
  //       "sales"
  //     ],
  //     "subPdCodes": [
  //       "sfa",
  //       "dms",
  //       "pmm",
  //       "tpm",
  //       "ai"
  //     ],
  //     "codepath": "1.1803686395634921472.1803686397149065216.",
  //     "isleaforg": "true",
  //     "metamodeltype": 1,
  //     "isSmsLogin": false
  //   }
  // }
  // 查询token所属登录角色
  // tenant: 普通租户登录 默认
  // center: 产品运营中心登录 单点登录时只带 token 没带 refreshtoken 和 tokenexpires
  getTokenRole (token?: string) {
    let loginRole: 'center' | 'tenant' = 'tenant' // center | tenant
    if (token) {
      const jwtInfo = this.jwtDecode(token)
      if (jwtInfo?.LoginUser?.centerRole || jwtInfo?.LoginUser?.appId === '100') {
        // 产品运营中心登录
        loginRole = 'center'
      }
    }
    return loginRole
  }

  getRole () {
    return this.getTokenRole(this.getToken())
  }

  // 检测当前用户是否登录状态
  checkLogin () {
    let haslogged = false
    const token = this.getToken()
    if (token) {
      if (this.getTokenRole(token) === 'center') {
        haslogged = this.checkTokenLogin(token)
      } else {
        const refreshtoken = this.getRefreshToken()
        const tokenexpires = this.getTokenExpires()
        const now = Date.now()
        if (token && refreshtoken && tokenexpires && Number(tokenexpires) > now) {
          haslogged = this.checkTokenLogin(token)
        }
      }
    }
    return haslogged
  }

  // 检测token是否过期
  checkTokenLogin (token?: string) {
    let haslogged = false
    if (token) {
      const now = Date.now()
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
  // 有可能是中心角色请求失败 兼容不报错
  async getAndSetUserInfo () {
    try {
      const accountinfo = await axios.post('/api/teapi/rolepermission/account/getaccountinfo', {
        positionid: this.getUser('positioncode') || '',
        deviceinfo: '',
        sysversion: '',
        clientversion: ''
      }).then((res: any) => {
        if (res.code === 200 && res.data) {
          return res.data
        } else {
          return null
        }
      })
      if (accountinfo) {
        this.setUser(accountinfo)
      }
    } catch (e) {
      console.error(e)
      console.warn('获取用户信息失败，当前您登录的帐号可能为非标准租户帐号。')
    }
  }

  formatTenant (tenant: ITenantInfo) {
    if (!tenant) {
      return null
    }
    const cloundTagMap = ['storage', 'storage-1d', 'storage-1y', 'storage-3m']
    const result: NormalizedCloudServ = {}
    for (const keyItem of cloundTagMap) {
      const cloudServ = tenant.cloudserv[keyItem as StorageEnum]
      if (cloudServ) {
        result[keyItem as StorageEnum] = {
          cloudserv_storage_provider: cloudServ.provider,
          cloudserv_storage_storagebucket: cloudServ.storagebucket,
          cloudserv_storage_storageendpoint: cloudServ.storageendpoint,
          cloudserv_storage_storageurl: cloudServ.storageurl,
          cloudserv_storage_accesskeyid: cloudServ.accesskeyid,
          cloudserv_storage_region: cloudServ.region
        }
      }
    }
    if (Object.keys(result).length === 0) {
      return null
    }
    return result
  }

  async getAndSetTenant (tenantcode?: string) {
    try {
      const tenantsRes: null | ITenantInfo[] = await axios.get('/api/auth/tenantlist', {}).then((res: any) => {
        return res?.data?.tenants
      })

      let tenant: ITenantInfo | null = null
      if (tenantsRes?.length) {
        if (!tenantcode) {
          tenant = tenantsRes[0]
        } else {
          tenant = tenantsRes.find((item) => item.code === tenantcode) || null
        }
      }

      if (!tenant) {
        lsProxy.removeItem('tenant')
        cloudServ.remove()
      } else {
        lsProxy.setItem('tenant', JSON.stringify(tenant))
        const normalizedTenant = this.formatTenant(tenant)
        if (normalizedTenant) {
          cloudServ.set(normalizedTenant)
        }
      }
    } catch (e) {
      console.error(e)
      console.warn('获取租户信息失败，当前您登录的帐号可能为非标准租户帐号。')
    }
  }

  // 单点登录
  async singleLogin (query: IAny) {
    query = cloneDeep(query)

    let flag = false // 是否登录成功
    const token = query.token
    const refreshtoken = query.refreshtoken
    const tokenexpires = query.tokenexpires
    const envname = query.envname
    const context = query.context

    if (this.checkTokenLogin(token)) {
      let isneedlogin = true // 是否需要走单点登录流程
      const loginRole = this.getTokenRole(token)

      if (loginRole === 'center') {
        // 如果本地已经登录 且 query 登录参数与本地一致 说明是刚登录没多久【token也没刷新过】 视为已经登录 不需再走单点登录流程
        // 之所以不强制校验 refreshtoken tokenexpires 是因为安装卸载配置页面有可能放在产品运营中心 没有这两字段
        if (this.checkLogin() && token === this.getToken()) {
          isneedlogin = false
          flag = true
        }
      } else {
        // 如果本地已经登录 且 query 登录参数与本地一致 说明是刚登录没多久【token也没刷新过】 视为已经登录 不需再走单点登录流程
        if (this.checkLogin() && token === this.getToken() && refreshtoken === this.getRefreshToken() && tokenexpires === this.getTokenExpires()) {
          isneedlogin = false
          flag = true
        }
      }

      if (isneedlogin) {
        this.setToken(token)
        this.setUserByToken(token) // 解析token为用户信息存入

        refreshtoken ? this.setRefreshToken(refreshtoken) : this.removeRefreshToken()
        tokenexpires ? this.setTokenExpires(tokenexpires) : this.removeTokenExpires()
        envname ? this.setQueryEnvname(envname) : this.removeQueryEnvname()

        // context 上下文字段 产品运营中心安装 卸载 配置 和 产品配置中心业务配置 页面需要用到
        // web 端有传 app没传 需要做兼容
        context && lsProxy.setItem('context', decodeURIComponent(context))

        // 这里兼容报错
        await this.getAndSetTenant()
        await this.getAndSetUserInfo()

        flag = true
      }
    } else {
      flag = false
      console.error('没传 token 或所传 token 已过期，无法单点登录。')
    }

    // 单点登录后 无论是否成功 都需要删除 query 中相关参数
    token && delete query.token
    refreshtoken && delete query.refreshtoken
    tokenexpires && delete query.tokenexpires
    envname && delete query.envname
    context && delete query.context

    // debugger

    return {
      flag,
      query
    }
  }
}

const login = new Login()

export default login
