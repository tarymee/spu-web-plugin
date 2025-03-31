import AMapLoader from '@amap/amap-jsapi-loader'
import { AMapKey } from './AMapKey'
import { getAMapKey } from './AMapKey'

let isinit = false

const load = (options?: {
  plugins?: Array<string>
  AMapUI?: {
    plugins?: Array<string>
  }
}) => {
  const AMapKey = getAMapKey()
  if (!isinit) {
    isinit = true
    if (AMapKey.securityJsCode) {
      // 本来想改成取消安全秘钥 但考虑到其他spu有可能用了需要安全秘钥的功能 因此不取消
      // 如果不设置安全秘钥的话 js-api的逆地址查询不成功 返回 INVALID_USER_SCODE 改成用ipaas服务查询
      window._AMapSecurityConfig = {
        securityJsCode: AMapKey.securityJsCode
      }
    }
  }

  // 不开放地址查询 改用ipaas
  const plugin = ['AMap.Geolocation']
  // plugin.push('AMap.Geocoder') // 不开放地址查询 改用ipaas

  return AMapLoader.load({
    key: AMapKey.key,
    version: '2.0',
    plugins: options?.plugins || plugin,
    AMapUI: {
      version: '1.1',
      plugins: options?.AMapUI?.plugins || []
    }
  })
}

export default {
  AMapKey,
  load
}
