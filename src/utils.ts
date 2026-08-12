import { getUser } from './login'
import { urlquery } from './urlquery'
import { get } from 'lodash-es'
import { apaasAxios } from './axios'

function isMobile() {
  const ua = navigator.userAgent.toLowerCase()
  // 匹配安卓、iPhone、iPad、iPod、黑莓、微软手机等
  const mobileReg = /(android|iphone|ipod|ipad|windows phone|blackberry|mobile)/
  return mobileReg.test(ua)
}

function isIOS() {
  const ua = navigator.userAgent.toLowerCase()
  return /(iphone|ipad|ipod|ios)/i.test(ua)
}

function isAndroid() {
  const ua = navigator.userAgent.toLowerCase()
  return /android/.test(ua) || /adr/.test(ua)
}

function isHarmony() {
  const ua = navigator.userAgent.toLowerCase()

  // 1. 纯血鸿蒙 NEXT：OpenHarmony
  const isPureHarmonyPhone = /openharmony/.test(ua)

  // 2. 兼容安卓老鸿蒙：含HarmonyOS + 手机标识
  const isOldHarmony = /harmonyos/.test(ua)
  const isA = isAndroid() && isMobile()

  return isPureHarmonyPhone || (isOldHarmony && isA)
}

function isInApp(): boolean {
  return !!(window?.aPaaS?.getPhoto || window?.top?.aPaaS?.getPhoto)
}

function isInAppSpuWebview(): boolean {
  return !!(isMobile() && window?.aPaaS?.getPhoto && window.aPaaS?.getToken)
}

// 是否在 interactivewebview 中
// interactivewebview 不像 spuWebview 有 window.aPaaS.getPhoto 方法
// 但有 window.aPaaS.getToken 方法（为了门户引擎切换到后台后同步 token 做的）
function isInInteractive(): boolean {
  return isMobile() && window.aPaaS?.getToken && !window.aPaaS?.getPhoto
}

function isInAppSpuOrInteractive(): boolean {
  return isInAppSpuWebview() || isInInteractive()
}

// 生成唯一id
function getUniqueid() {
  const random = Math.ceil(Math.random() * 100000)
  // TODO：生成的id不能以0开头，在数据库存储转换长整型会被消除，导致唯一编码错误存储
  // TODO: 不能与服务端返回的idarray在未来产生重叠，用9开头（应该够用许多年了？）
  return `9${Date.now()}${random}`
}

function functionCheck(functioncode?: string): boolean {
  if (!functioncode) return false
  const functioncodes = getUser('functioncodes') || []
  // console.log(functioncodes)
  // debugger
  const check = functioncodes.includes(functioncode)
  return !!check
}

function setTitle(pagetitle?: string) {
  pagetitle = pagetitle || ''

  // 设置本身
  document.title = pagetitle

  // 父级spu容器 且 是web或者h5引擎
  if (window.top !== window) {
    const topWin: any = window.top
    topWin.document.title = pagetitle

    // 如果是在h5引擎内 且 h5引擎也作为spu被放置在app内
    topWin?.Native?.setNavigationBarTitle && topWin.Native.setNavigationBarTitle(pagetitle)
  }

  // 父级spu容器 且 是APP
  window?.Native?.setNavigationBarTitle && window.Native.setNavigationBarTitle(pagetitle)
}

function isdebugger(): boolean {
  return urlquery.isdebugger
}

function isvirtuallocation(): boolean {
  return urlquery.isvirtuallocation
}

function urlIsIp(url: string) {
  const hostname = url.split('://')[1].split(':')[0].split('/')[0]
  const arr = hostname.split('.')
  if (arr.length !== 4) return false
  let flag = true
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!Number.isInteger(Number(arr[i]))) {
      flag = false
      break
    }
  }
  return flag
}

// 如果是非ip地址 则切换为与主页面一样的 location.protocol 前缀
function toggleHttpOrHttps(url: string) {
  let res = url
  if (!urlIsIp(res)) {
    if (!res.startsWith(location.protocol)) {
      const arr = res.split('//')
      arr[0] = location.protocol
      res = arr.join('//')
    }
  }
  return res
}

const urlMap = new Map<string, Promise<any>>()
function importJS(url: string, attrName = ''): Promise<any> {
  let p = urlMap.get(url)
  if (p) {
    return p.then(() => {
      return Promise.resolve(attrName ? get(window, attrName) : undefined)
    })
  }
  const script: any = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', url)
  document.getElementsByTagName('head')[0].appendChild(script)

  p = new Promise((resolve, reject) => {
    script.onload = script.onreadystatechange = function () {
      const f = script.readyState
      if (f && f !== 'loaded' && f !== 'complete') return
      script.onload = script.onreadystatechange = null
      resolve(undefined)
    }
    script.onerror = () => reject(new Error('加载失败'))
  })
  urlMap.set(url, p)
  // console.log('importJS:', url, attrName)
  return p.then(() => {
    return Promise.resolve(attrName ? get(window, attrName) : undefined)
  })
}

const delay = (timeout = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, timeout)
  })
}

const getServerTime = () => {
  return new Promise((resolve, reject) => {
    if (window?.Native?.getServerTime) {
      window.Native.getServerTime((res: any) => {
        if (res) {
          resolve(res.toString())
        } else {
          resolve(Date.now().toString())
        }
      })
    } else {
      apaasAxios
        .get(
          '/api/teapi/offline/servertime',
          {},
          {
            isShowLoading: false
          }
        )
        .then((res: any) => {
          if (res.data) {
            resolve(res.data.toString())
          } else {
            resolve(Date.now().toString())
          }
        })
        .catch((err: any) => {
          resolve(Date.now().toString())
        })
    }
  })
}

// 精准判断是否能访问业务服务器（结合 navigator.onLine + 接口请求）
const isOnline = async (pingUrl = './') => {
  // 判断如果是非移动端的情况下，应该都是true
  if (!isMobile()) {
    return true
  }

  return navigator.onLine
  // // 先判断基础状态，离线则直接返回 false
  // console.log('navigator.onLine', navigator.onLine)
  // if (!navigator.onLine) {
  //   return false
  // }

  // try {
  //   // 发送轻量 GET 请求
  //   const response = await fetch(pingUrl, {
  //     method: 'GET',
  //     credentials: 'omit', // 不携带cookies
  //     mode: 'cors', // 允许跨域请求，需后端配置 CORS 头部
  //     cache: 'no-store' // 禁用缓存，保证实时性
  //     // cache: 'default'
  //     // signal: AbortSignal.timeout(3000) // 超时取消
  //   })
  //   console.log('fetch.onLine', response.ok)
  //   // console.log(response)
  //   // debugger
  //   // 只要响应成功（状态码 200-299），则认为在线
  //   return response.ok
  // } catch (error) {
  //   // 网络错误/超时，认为离线
  //   return false
  // }
}
// setInterval(async () => {
//   // const a = await isOnline('https://www.baidu.com/')
//   const a = await isOnline()
//   console.log(a)
// }, 2000)

export {
  isMobile,
  isIOS,
  isAndroid,
  isHarmony,
  isInApp,
  isInAppSpuWebview,
  isInInteractive,
  isInAppSpuOrInteractive,
  getUniqueid,
  functionCheck,
  setTitle,
  isdebugger,
  isvirtuallocation,
  toggleHttpOrHttps,
  importJS,
  delay,
  getServerTime,
  isOnline
}
