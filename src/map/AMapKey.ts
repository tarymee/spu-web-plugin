import { mapService } from './MapService'

// 高德地图 web端key 和 安全密钥
const AMapKey = {
  // 测试开发环境
  dev: {
    key: '38fa4702d240e1e6ee5cc8ca059b254f',
    securityJsCode: '96f2af5670b7a41a56dcd2e8b63c1e06'
  },
  // 生产环境
  production: {
    key: '1993ac213d2f4675ac1bffb1b03ef1f0',
    securityJsCode: '816fe46b7b7bce145940b93c1e4818fa'
  }
}

const getAMapKey = () => {
  if (mapService.isLbssettingEnable && mapService.type === 'amap') {
    return {
      key: mapService.key,
      securityJsCode: mapService.secretkey
    }
  } else {
    return {
      key: AMapKey.production.key,
      securityJsCode: AMapKey.production.securityJsCode
    }
  }
}

export { AMapKey, getAMapKey }
