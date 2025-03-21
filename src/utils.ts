import { getUser } from './login'
import { urlquery } from './urlquery'

function isIOS() {
  const ua = navigator.userAgent
  return /(iPhone|iPad|iPod|IOS)/i.test(ua)
}

function isMobile() {
  const ua = navigator.userAgent
  return ua.includes('Mobile')
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

function isInApp(): boolean {
  if (window?.aPaaS?.getPhoto || window?.top?.aPaaS?.getPhoto) {
    return true
  } else {
    return false
  }
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

export {
  isIOS,
  isMobile,
  getUniqueid,
  functionCheck,
  setTitle,
  isInApp,
  isdebugger,
  isvirtuallocation,
  toggleHttpOrHttps
}
