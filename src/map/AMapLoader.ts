import AMapLoader from '@amap/amap-jsapi-loader'
import { mapApi } from './MapApi'
import { AMapKey } from './AMapKey'

let isinit = false
const getKeyData = () => {
  if (mapApi.isLbssettingEnable && mapApi.type === 'amap') {
    return {
      key: mapApi.key
    }
  } else {
    return {
      key: AMapKey.production.key,
      securityJsCode: AMapKey.production.securityjscode
    }
  }
}

const load = (options?: {
  plugins?: Array<string>
  AMapUI?: {
    plugins?: Array<string>
  }
}) => {
  const keyData = getKeyData()
  if (!isinit) {
    isinit = true
    if (keyData.securityJsCode) {
      // 关掉高德地图代理地址验证
      // window._AMapSecurityConfig = {
      //   securityJsCode: keyData.securityJsCode
      // }
    }
  }

  return AMapLoader.load({
    key: keyData.key,
    version: '2.0',
    plugins: options?.plugins || ['AMap.Geolocation', 'AMap.Geocoder'],
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
