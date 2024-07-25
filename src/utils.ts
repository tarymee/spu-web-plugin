import { getUser } from './index'

const isIOS = () => {
  const ua = navigator.userAgent
  return /(iPhone|iPad|iPod|IOS)/i.test(ua)
}

// 生成唯一id
const getUniqueid = () => {
  const random = Math.ceil(Math.random() * 100000)
  // TODO：生成的id不能以0开头，在数据库存储转换长整型会被消除，导致唯一编码错误存储
  // TODO: 不能与服务端返回的idarray在未来产生重叠，用9开头（应该够用许多年了？）
  return `9${Date.now()}${random}`
}


const functionCheck = (functioncode?: string): boolean => {
  if (!functioncode) return false
  const functioncodes = getUser('functioncodes') || []
  // console.log(functioncodes)
  // debugger
  const check = functioncodes.includes(functioncode)
  return !!check
}

const setTitle = (pagetitle?: string) => {
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


// const inWhichSPU = () => {
// }

export {
  isIOS,
  getUniqueid,
  functionCheck,
  setTitle
}
