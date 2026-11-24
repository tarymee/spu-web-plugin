import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { get, cloneDeep } from 'lodash-es'
import { litAxiosLoadding } from './LitAxiosLoadding'
import { getToken, updateToken, getLoginState } from '../auth/login'
import { getTecode } from '../auth/envService'
import { globalOptions } from '../index'
import spuManager from '../spu/manager'
import { urlquery } from '../urlquery'
import { decrypt } from '../crypt'

interface Response {
  code: number | string
  data: any
  msg: string
  message: string
}

type axiosType = 'spu' | 'apaas' | 'normal'

// _encrydata
const normalizeEncryData = (response: any) => {
  if (response.data && response.data._encrydata && typeof response.data._encrydata === 'string') {
    const res = decrypt(response.data._encrydata)
    try {
      const resJson = JSON.parse(res)
      response.data = {
        ...resJson
      }
    } catch (e) {
      response.data = res
    }
  }
  if (response.body && response.body._encrydata && typeof response.body._encrydata === 'string') {
    const res = decrypt(response.body._encrydata)
    try {
      const resJson = JSON.parse(res)
      response.body = {
        ...resJson
      }
    } catch (e) {
      response.body = res
    }
  }

  return response
}

// 检查接口错误返回信息是否登录
const checkErrorResponseIsLogin = (type: axiosType = 'spu', err: any) => {
  if (type === 'spu') {
    if (err.message === '未授权' && get(err, 'response.data.code') === 401) {
      return false
    } else {
      return true
    }
  } else if (type === 'apaas') {
    if (
      err.message.indexOf('token is invalid(decode).') !== -1 ||
      err.message.indexOf('token is invalid(null).') !== -1 ||
      err.message === 'token无效，请重新登录' ||
      err.message === 'jwt token无效'
    ) {
      return false
    } else {
      return true
    }
  }
}

const createAxiosInstance = (type: axiosType = 'spu', config: any = {}) => {
  const axiosInstance: AxiosInstance = axios.create(
    Object.assign(config, {
      baseURL:
        type === 'spu'
          ? `${globalOptions.axiosbaseurl}/api/${globalOptions.modulekey}/${globalOptions.moduleversion}`
          : `${globalOptions.axiosbaseurl}`
    })
  )

  axiosInstance.interceptors.request.use(
    async (config: any) => {
      const isShowLoading = get(config, 'isShowLoading', true)
      isShowLoading && litAxiosLoadding.open()

      if (type === 'spu' && config.modulekey) {
        const moduleData: any = await spuManager.getModuleData(config.modulekey)
        if (moduleData.data) {
          config.baseURL = `${globalOptions.axiosbaseurl}/api/${config.modulekey}/${moduleData.data.moduleversion}`
        } else {
          console.error(moduleData.errorMsg)
          config.baseURL = `${globalOptions.axiosbaseurl}/api/${config.modulekey}/v?.?`
        }
      }

      // if (config.url === 'http://120.46.182.226/api/smartcenter/biz/getTenantWebAndApiDefined') {
      //   console.log(config)
      //   debugger
      // }

      const isSendToken = get(config, 'isSendToken', true)
      if (isSendToken) {
        // 请求接口前校验是否过期 如果过期先刷新token
        const loginState = getLoginState()
        if (
          config.url !== '/api/auth/refreshtoken' &&
          !loginState.islogin &&
          loginState.type === 2 &&
          loginState.role !== 'center'
        ) {
          try {
            await updateToken()
          } catch (err) {
            console.error(err)
          }
        }

        const token = getToken()
        if (config?.headers && token) {
          config.headers.token = token
        }
      }

      // 平台的业务接口开了开发者模式后，header带上debug方便查看接口的ide日志
      if (type !== 'spu' && urlquery.isdebugger && config.url.indexOf('api/teapi/dy-biz/') > -1) {
        if (config?.headers) {
          config.headers.debug = 'true'
        }
      }

      if (type !== 'spu') {
        const isSendTecode = get(config, 'isSendTecode', false)
        if (isSendTecode) {
          const tecode = getTecode()
          if (config?.headers && tecode) {
            config.headers.tecode = tecode
          }
        }
      }

      return config
    },
    (error) => {
      // console.error(error)
      // debugger
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    async (res: AxiosResponse) => {
      const isShowLoading = get(res, 'config.isShowLoading', true)
      isShowLoading && litAxiosLoadding.close()

      // if (res.config.url === '/api/auth/refreshtoken') {
      //   console.log(res)
      //   debugger
      // }

      normalizeEncryData(res)

      if (type !== 'normal') {
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
            return Promise.reject(realRes) as any
          }
        } else if (type === 'apaas') {
          realRes = {
            code: res.status || 200,
            data: res.data?.resp_data || res.data,
            msg: res.data?.error_code || '',
            message: res.data?.error_code || ''
          }
          return realRes
        }
      } else {
        return res
      }
    },
    (err: any) => {
      const isShowLoading = get(err, 'config.isShowLoading', true)
      isShowLoading && litAxiosLoadding.close()

      // err: AxiosError
      // console.log(err)
      // debugger
      if (type !== 'normal') {
        let msg = ''
        if (type === 'spu') {
          msg = get(err, 'response.data.msg', '')
        } else if (type === 'apaas') {
          msg = get(err, 'response.data.error_code', '')
        } else {
        }
        if (msg) {
          err.message = msg
        } else {
          err.message = err.response?.statusText || err.message || '网络异常，请稍后重试。'
        }
        err.msg = err.message

        // 对接口报错进行处理
        if (!checkErrorResponseIsLogin(type, err)) {
          // 跳登录页面
        } else {
          // 弹出错误提示
          // const isShowErrorMessage = get(err, 'config.isShowErrorMessage', true)
          // isShowErrorMessage && Message.error(err.msg)
        }
      }

      return Promise.reject(err)
    }
  )

  return axiosInstance
}

// spuAxios: 针对spu接口的返回形式，调用接口加前缀 `/api/${config.modulekey}/${moduleData.data.moduleversion}` 状态码一直返回200，调用成功/错误基于返回的 data.code【200是成功】判断，返回数据放 data.data，错误信息放 data.msg，对返回数据进行包装，保证一致性
// apaasAxios: 针对平台接口的返回形式，返回数据放 data.resp_data，错误信息放 data.error_code，对返回数据进行包装，保证一致性
// normalAxios: 普通接口调用，除了必要的拦截器前置后置处理外，接口返回什么就是什么，不做包装
let spuAxios: any = null
let apaasAxios: any = null
let normalAxios: any = null

function installAxios() {
  spuAxios = globalOptions.isspu ? createAxiosInstance('spu') : null
  apaasAxios = createAxiosInstance('apaas')
  normalAxios = createAxiosInstance('normal')
}

export {
  installAxios,
  spuAxios,
  apaasAxios,
  normalAxios,
  normalizeEncryData as decryptAxiosResponseData
}
