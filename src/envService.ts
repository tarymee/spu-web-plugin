import { get, cloneDeep } from 'lodash-es'
import { lsProxy } from './storageProxy'
import { axios } from './axios'
import { decrypt } from './crypt'
import { toggleHttpOrHttps } from './utils'
import { getData, setData, removeData } from './storageCache'

async function getEnvname(): Promise<string> {
  let envname = ''

  // web 查 context 的 envname
  let context: any = lsProxy.getItem('context')
  context && (context = JSON.parse(context))
  const contextEnvname = context?.envname || ''

  // 链接有些spu可能会传 envname
  const queryEnvname = getQueryEnvname()

  if (contextEnvname) {
    envname = contextEnvname
  } else if (queryEnvname) {
    envname = queryEnvname
  } else if (window?.aPaaS?.getWebInitParams && window?.Native?.setNavigationBarReturnButton) {
    // 手机端 查 envname
    // 只有手机端有 setNavigationBarReturnButton 和 getWebInitParams 方法
    envname = await new Promise((resolve, reject) => {
      window.aPaaS.getWebInitParams((params: any) => {
        resolve(params?.envname || '')
      })
    })
  }

  return envname
}

function setQueryEnvname(value: string) {
  setData('envname', value)
}

function getQueryEnvname() {
  return getData('envname') || ''
}

function removeQueryEnvname() {
  removeData('envname')
}

async function requestEnvdata(envName: string): Promise<IAny | null> {
  // envName = '产品运营中心验证'
  let result = null
  if (envName) {
    const hostsRoot =
      document.location.protocol === 'https:'
        ? 'https://mconfig.xuantongkeji.com'
        : 'http://mconfig.xuantongkeji.com:8015'
    try {
      const res = await axios.get(`${hostsRoot}/multiplatconfig/env/${envName}`, {
        isShowLoading: false,
        isSendToken: false
      })
      // console.log(res)
      // debugger
      result = get(res, 'data.0')

      // 如果是非ip地址 则切换为与主页面一样的 location.protocol 前缀
      result?.business && (result.business = toggleHttpOrHttps(result.business))
      result?.smartcenter && (result.smartcenter = toggleHttpOrHttps(result.smartcenter))
      // debugger
    } catch (err) {
      console.error(err)
    }
  }
  return result
}

function saveEnvdata(envdata: IAny) {
  lsProxy.setItem('envdata', JSON.stringify(envdata))
}

function removeEnvdata() {
  lsProxy.removeItem('envdata')
}

async function getEnvdata(): Promise<IAny | null> {
  const envdataStr = lsProxy.getItem('envdata')

  if (envdataStr) {
    return JSON.parse(envdataStr)
  } else {
    const envname = await getEnvname()
    if (envname) {
      const envdata = await requestEnvdata(envname)
      return envdata
    } else {
      return null
    }
  }
}

function setTecode(tecode: string) {
  setData('tecode', tecode)
}

function removeTecode() {
  removeData('tecode')
}

function getTecode() {
  return getData('tecode')
}

export {
  getEnvname,
  setQueryEnvname,
  getQueryEnvname,
  removeQueryEnvname,
  requestEnvdata,
  saveEnvdata,
  removeEnvdata,
  getEnvdata,
  setTecode,
  removeTecode,
  getTecode
}
