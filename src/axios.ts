import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { get } from 'lodash-es'
import { loadding } from './components/loadding'
import login from './login'
import core from './core'
import { urlquery } from './urlquery'

interface Response {
  code: number | string
  data: any
  msg: string
  message: string
}

const createAxiosInstance = (type: 'spu' | 'normal' = 'spu', options: any) => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: type === 'spu' ? `/api/${options.modulekey}/${options.moduleversion}` : ''
    // baseURL: '',
    // timeout: 36000000
    // withCredentials: true, // 不能开启 影响ali oss
    // headers: {
    //   // 'Content-Type': 'application/json;charset=UTF-8',
    //   // 'app_id': '100'
    // }
  })

  axiosInstance.interceptors.request.use(
    async (config: any) => {
      // const isShowLoading = typeof config?.isShowLoading !== 'undefined' ? config.isShowLoading : true
      // console.error(444444)
      // console.log(config)

      const isShowLoading = get(config, 'isShowLoading', true)
      isShowLoading && loadding.open()

      const isSendToken = get(config, 'isSendToken', true)
      if (isSendToken) {
        // 请求接口前校验是否过期 如果过期先刷新token
        if (config.url !== '/api/auth/refreshtoken') {
          if (!login.checkLogin() && login.getRole() !== 'center') {
            try {
              await login.updateToken()
            } catch (err) {
              console.error(err)
            }
          }
        }

        const token = login.getToken()
        if (config?.headers && token) {
          config.headers.token = token
        }
      }

      if (type === 'spu' && config.modulekey) {
        const moduleData: any = await core.getModuleData(config.modulekey)
        if (moduleData.data) {
          config.baseURL = `/api/${config.modulekey}/${moduleData.data.moduleversion}`
        } else {
          console.error(moduleData.errorMsg)
          config.baseURL = `/api/${config.modulekey}/v?.?`
        }
      }

      // 平台的业务接口开了开发者模式后，header带上debug方便查看接口的ide日志
      if (type !== 'spu' && urlquery.isdebugger && config.url.indexOf('api/teapi/dy-biz/') > -1) {
        if (config?.headers) {
          config.headers.debug = 'true'
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
      // debugger
      const isShowLoading = get(res, 'config.isShowLoading', true)
      isShowLoading && loadding.close()

      let realRes: Response = {
        code: 404,
        data: '',
        msg: '',
        message: ''
      }

      if (type === 'spu') {
        if (res.data.code === 200) {
          // return res.data
          realRes = {
            code: res.data.code,
            data: res.data.data,
            msg: res.data.msg,
            message: res.data.msg
          }
          return realRes
        } else {
          realRes = {
            code: res.data.code,
            data: res.data.data,
            msg: res.data.msg || '网络异常，请稍后重试。',
            message: res.data.msg || '网络异常，请稍后重试。'
          }

          // const isShowErrorMessage = get(res, 'config.isShowErrorMessage', true)
          // isShowErrorMessage && Message.error(realRes.msg)

          return Promise.reject(realRes) as any
        }
      } else if (type === 'normal') {
        realRes = {
          code: res.status || 200,
          data: res.data?.resp_data || res.data,
          msg: res.data?.error_code || '',
          message: res.data?.error_code || ''
        }
        return realRes
      }
    },
    (err: any) => {
      // err: AxiosError
      // console.log(err)
      // debugger
      const isShowLoading = get(err, 'config.isShowLoading', true)
      isShowLoading && loadding.close()

      // console.log(err)
      // debugger

      let msg = ''
      if (type === 'spu') {
        msg = get(err, 'response.data.msg', '')
      } else {
        msg = get(err, 'response.data.error_code', '')
      }

      if (msg) {
        err.message = msg
      } else {
        err.message = err.response?.statusText || err.message || '网络异常，请稍后重试。'
      }
      err.msg = err.message

      // const isShowErrorMessage = get(err, 'config.isShowErrorMessage', true)
      // isShowErrorMessage && Message.error(msg)

      const isNoLogin = () => {
        if (type === 'spu') {
          if (err.message === '未授权' && get(err, 'response.data.code') === 401) {
            return true
          } else {
            return false
          }
        } else if (type === 'normal') {
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

let spuAxios: any = null
let normalAxios: any = null

function installAxios(options: any) {
  spuAxios = createAxiosInstance('spu', options)
  normalAxios = createAxiosInstance('normal', options)
}

export { installAxios, spuAxios, normalAxios as axios }
