const isIOS = () => {
  const ua = navigator.userAgent
  return /(iPhone|iPad|iPod|IOS)/i.test(ua)
}

// 是否企微软件内 包括电脑端和APP端
const isInWxwork = () => {
  return navigator.userAgent.indexOf('wxwork') >= 0
}

// 是否在电脑端企微软件内
const isInPcWxwork = () => {
  return isInWxwork() && navigator.userAgent.indexOf('Mobile') === -1
}

// 是否在企微APP内
const isInAppWxwork = () => {
  return isInWxwork() && navigator.userAgent.indexOf('Mobile') >= 0
}

// 生成唯一id
const getUniqueid = () => {
  const random = Math.ceil(Math.random() * 100000)
  // TODO：生成的id不能以0开头，在数据库存储转换长整型会被消除，导致唯一编码错误存储
  // TODO: 不能与服务端返回的idarray在未来产生重叠，用9开头（应该够用许多年了？）
  return `9${Date.now()}${random}`
}


export {
  isIOS,
  isInWxwork,
  isInPcWxwork,
  isInAppWxwork,
  getUniqueid
}
