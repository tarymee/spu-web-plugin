import AMapLoader from '@amap/amap-jsapi-loader'
import { mapApi } from './MapApi'
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
