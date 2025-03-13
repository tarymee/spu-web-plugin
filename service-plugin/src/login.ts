import jwtDecode from 'jwt-decode'
import { axios } from './axios'
import { globalOptions } from './index'

type JwtResult = {
  LoginUser: IAny
  exp: number
} | null

class Login {
  updateToken() {
    const token = globalOptions.getToken()
    const refreshtoken = globalOptions.getRefreshToken()
    const sendToken = this.checkLoginByToken(token) ? token : refreshtoken
    return axios
      .get('/api/auth/refreshtoken', {
        params: {
          refreshtoken: sendToken
        },
        isShowLoadding: false,
        isSendToken: false,
        headers: {
          token: sendToken
        }
      })
      .then((res: any) => {
        // console.log(res)
        const data = res?.data
        if (data) {
          globalOptions.setToken(data.token)
          globalOptions.setRefreshToken(data.refreshtoken)
          globalOptions.setTokenExpires(data.tokenexpires)
        }
      })
  }

  private jwtDecode(token?: string) {
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

  // 检测当前用户是否登录状态
  checkLogin() {
    let haslogged = false
    const token = globalOptions.getToken()
    if (token) {
      const refreshtoken = globalOptions.getRefreshToken()
      const tokenexpires = globalOptions.getTokenExpires()
      const now = Date.now()
      if (token && refreshtoken && tokenexpires && Number(tokenexpires) > now) {
        haslogged = this.checkLoginByToken(token)
      }
    }
    return haslogged
  }

  // 检测token是否过期
  checkLoginByToken(token?: string) {
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
}

const login = new Login()

export default login
