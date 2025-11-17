import axios from 'axios'
import { AxiosInstance, AxiosResponse } from 'axios'
import { get } from 'lodash-es'
import * as service from './index'
import { decrypt } from './crypt'
import login from './login'

interface Response {
  code: number | string
  data: any
  msg: string
  message: string
}

// _encrydata
export const normalizeEncryData = (response: any) => {
  if (response.data && response.data._encrydata && typeof response.data._encrydata === 'string') {
    let res = decrypt(response.data._encrydata)
    try {
      let resJson = JSON.parse(res)
      response.data = {
        ...resJson
      }
    } catch (e) {
      response.data = res
    }
  }
  if (response.body && response.body._encrydata && typeof response.body._encrydata === 'string') {
    let res = decrypt(response.body._encrydata)
    try {
      let resJson = JSON.parse(res)
      response.body = {
        ...resJson
      }
    } catch (e) {
      response.body = res
    }
  }

  return response
}

const createAxiosInstance = () => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: ''
  })

  axiosInstance.interceptors.request.use(
    async (config: any) => {
      const isSendToken = get(config, 'isSendToken', true)
      if (isSendToken) {
        // 请求接口前校验是否过期 如果过期先刷新token
        if (config.url !== '/api/auth/refreshtoken' && !login.checkLogin()) {
          try {
            await login.updateToken()
          } catch (err) {
            console.error(err)
          }
        }

        const token = service.globalOptions.getToken()
        if (config?.headers && token) {
          config.headers.token = token
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
      let realRes: Response = {
        code: 404,
        data: '',
        msg: '',
        message: ''
      }
      normalizeEncryData(res)

      realRes = {
        code: res.status || 200,
        data: res.data?.resp_data || res.data,
        msg: res.data?.error_code || '',
        message: res.data?.error_code || ''
      }
      return realRes as any
    },
    (err: any) => {
      // err: AxiosError
      // console.log(err)
      // debugger

      let msg = err?.response?.data?.error_code || ''

      if (msg) {
        err.message = msg
      } else {
        err.message = err.response?.statusText || err.message || '网络异常，请稍后重试。'
      }
      err.msg = err.message

      const isNoLogin = () => {
        if (
          err.message.indexOf('token is invalid(decode).') !== -1 ||
          err.message.indexOf('token is invalid(null).') !== -1 ||
          err.message === 'token无效，请重新登录' ||
          err.message === 'jwt token无效'
        ) {
          return true
        } else {
          return false
        }
      }

      const noLoginFn = () => {
        if (isNoLogin()) {
        }
      }

      return Promise.reject(err)
    }
  )

  return axiosInstance
}

let normalAxios: any = createAxiosInstance()

export { normalAxios as axios, normalizeEncryData as decryptAxiosResponseData }
