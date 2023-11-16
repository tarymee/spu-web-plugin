import AMapLoader from '@amap/amap-jsapi-loader'

// 高德地图 web端key 和 安全密钥
const amapKey = {
  // 测试开发环境
  dev: {
    key: '38fa4702d240e1e6ee5cc8ca059b254f',
    securityjscode: '96f2af5670b7a41a56dcd2e8b63c1e06'
  },
  // 生产环境
  production: {
    key: '1993ac213d2f4675ac1bffb1b03ef1f0',
    securityjscode: '816fe46b7b7bce145940b93c1e4818fa'
  }
}
// const amapkey = process.env.NODE_ENV !== 'production' ? amapKey.dev.key : amapKey.production.key
// const amapsecurityjscode = process.env.NODE_ENV !== 'production' ? amapKey.dev.securityjscode : amapKey.production.securityjscode

const amapkey = amapKey.production.key
const amapsecurityjscode = amapKey.production.securityjscode

const load = (options?: {
  plugins?: Array<string>
  AMapUI?: {
    plugins?: Array<string>
  }
}) => {
  if (!window._AMapSecurityConfig) {
    window._AMapSecurityConfig = {
      securityJsCode: amapsecurityjscode
    }
  }
  return AMapLoader.load({
    key: amapkey,
    version: '2.0',
    plugins: options?.plugins || [],
    AMapUI: {
      version: '1.1',
      plugins: options?.AMapUI?.plugins || []
    }
  })
}

export default {
  load
}
