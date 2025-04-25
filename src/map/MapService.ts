import { importJS, delay } from '../utils'
import { tenantSetting } from '../tenantSetting'
import { AMapKey } from './AMapKey'
import AMapLoader from '@amap/amap-jsapi-loader'

type MapType = 'amap' | 'tencent' | 'baidu'

type MapSupportType = 'android' | 'harmony' | 'ios' | 'web' | 'server'

interface ILbsSetting {
  type: MapType
  key: Record<MapSupportType, string>
  secretkey: Record<MapSupportType, string>
}

interface ILbsSettingData {
  enable: string
  setting: ILbsSetting
}

class MapService {
  private isInit = false
  private initPromise: any = null

  get lbssetting(): ILbsSettingData | undefined {
    // return tenantSetting.get('lbssetting')
    const lbssetting: any = {
      enable: '1',
      setting: {
        type: '',
        key: {
          web: '',
          android: '',
          ios: '',
          harmony: ''
        },
        secretkey: {
          web: '',
          android: '',
          ios: '',
          harmony: ''
        }
      }
    }
    // // 高德地图公司key
    // lbssetting.setting.type = 'amap'
    // lbssetting.setting.key.web = '1993ac213d2f4675ac1bffb1b03ef1f0'
    // lbssetting.setting.secretkey.web = '816fe46b7b7bce145940b93c1e4818fa'
    // 高德地图个人key
    lbssetting.setting.type = 'amap'
    lbssetting.setting.key.web = 'e4d25fe4661a34198c4e6f79abe9afac'
    lbssetting.setting.secretkey.web = 'a6b674affd9a3278c68602cf7ba02fcb'
    // // 腾讯地图
    // lbssetting.setting.type = 'tencent'
    // lbssetting.setting.key.web = 'NHBBZ-K5LCQ-LF35M-2CTDP-E4OO7-AIBFT'
    // lbssetting.setting.secretkey.web = 'zowvV5I2pSxqgGb2Sgr1x62HGXbqdxT0'
    // // 百度地图
    // lbssetting.setting.type = 'baidu'
    // lbssetting.setting.key.web = '7r3bsPeQqJ74vsxf3EOXg7C1AM4lOWA1'
    // lbssetting.setting.secretkey.web = ''
    return lbssetting
  }

  get isLbssettingEnable() {
    return this.lbssetting?.enable === '1'
  }

  private get setting(): ILbsSetting | undefined {
    return this.lbssetting?.setting
  }

  get key() {
    if (this.isLbssettingEnable) {
      return this.setting?.key?.web || ''
    } else {
      return AMapKey.production.key
    }
  }

  get secretkey() {
    if (this.isLbssettingEnable) {
      return this.setting?.secretkey?.web || ''
    } else {
      return AMapKey.production.securityJsCode
    }
  }

  get type(): MapType {
    if (this.isLbssettingEnable) {
      return this.setting?.type || 'amap'
    } else {
      return 'amap'
    }
  }

  AMap: any = null
  TMap: any = null
  BMap: any = null

  async init() {
    if (this.isInit) return

    // 兼容同时间发起多个
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this._init()
    await this.initPromise
  }

  private async _init() {
    const type = this.type
    const key = this.key
    const secretkey = this.secretkey
    if (type === 'tencent') {
      if (!key || !secretkey) {
        console.error('请填写腾讯地图 Web App Key 和 Web Secret Key')
        return
      }
      console.log('当前使用腾讯地图')
      console.log(`Web App Key: ${key}`)
      console.log(`Web Secret Key: ${secretkey}`)
      await this.initTecent()
    } else if (type === 'amap') {
      if (!key || !secretkey) {
        console.error('请填写高德地图 Web App Key 和 Web Secret Key')
        return
      }
      console.log('当前使用高德地图')
      console.log(`Web App Key: ${key}`)
      console.log(`Web Secret Key: ${secretkey}`)
      await this.initAmap()
    } else if (type === 'baidu') {
      if (!key) {
        console.error('请填写百度地图 Web App Key')
        return
      }
      console.log('当前使用百度地图')
      console.log(`Web App Key: ${key}`)
      console.log(`Web Secret Key: ${secretkey}`)
      await this.initBaidu()
    }
    this.isInit = true
  }

  // 腾讯地图 key 配置错误
  // 1 如果是地图 会在地图上明确文字提示 鉴权失败，请传入正确的key
  // 2 如果是调用 api 会返回 catch 和详细的错误信息
  // getIPLocationByTMap fail: {"status":311,"message":"key格式错误","request_id":"ccedb04fd95e4f3f9cd45cfbad729d10","id":"cbm919vjdj0"}
  // getIPLocationByTMap fail: {"status":190,"message":"无效的key","request_id":"b6ca9d0749eb4c91a47db9412b1253ca","id":"cbm919wxo40"}
  private async initTecent() {
    await importJS(
      `https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${this.key}`,
      // `https://map.qq.com/api/gljs?v=1.exp&key=${this.key}`,
      'TMap'
    )
    this.TMap = window.TMap
    await delay(300)
  }

  // 高德地图 key 配置错误
  // 1 如果是 key 格式不对 那么没返回 promise 连 window.AMap 都拿不到 地图和都不能用
  // 1 如果是 key 格式对 但 key 不对 有返回 window.AMap 但 api 定位调用失败 地图可以渲染空白地图
  private async initAmap() {
    return new Promise(async (resolve, reject) => {
      // 高德地图api初始化失败 没有返回reject 因此用超时机制检测
      const time = setTimeout(() => {
        console.error('initAmap fail: 请检查高德地图 Web App Key 和 Web Secret Key 是否正确配置')
        resolve(null)
      }, 3000)

      if (this.secretkey) {
        window._AMapSecurityConfig = {
          securityJsCode: this.secretkey
        }
      }

      const plugin = ['AMap.Geolocation', 'AMap.Geocoder']
      // debugger

      const AMap = await AMapLoader.load({
        key: this.key,
        version: '2.0',
        plugins: plugin,
        AMapUI: {
          version: '1.1',
          plugins: []
        }
      })
      // debugger
      clearTimeout(time)

      window.AMap = AMap
      this.AMap = window.AMap
      // console.log(window)
      // console.log(window.AMap)
      // console.log(window.AMapUI)
      // console.log(window.AMapLoader)
      // console.log(window.AMap === aaaa)
      resolve(window.AMap)
    })
  }

  // 百度地图 key 配置错误
  // alert以下信息: 您提供的密钥不是有效的百度LBS开放平台密钥，或此密钥未对本应用的百度地图JavaScriptAPI授权。您可以访问如下网址了解如何获取有效的密钥：http://lbsyun.baidu.com/apiconsole/key#。
  private async initBaidu() {
    return new Promise((resolve, reject) => {
      window.BMAP_INITIAL_CALLBACK = (e: any) => {
        // console.log(e)
        // debugger
        this.BMap = window.BMap
        // debugger
        // 启用google标准坐标体系
        // coordsType 指定输入输出的坐标类型，BMAP_COORD_GCJ02为gcj02坐标，BMAP_COORD_BD09为bd0ll坐标，默认为BMAP_COORD_BD09。
        window.BMap.coordType = 'BMAP_COORD_GCJ02'
        resolve(null)
      }
      const script = document.createElement('script')
      // 使用最新 3.0 api https://lbsyun.baidu.com/index.php?title=jspopular3.0
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=${this.key}&callback=BMAP_INITIAL_CALLBACK`
      // script.src = `https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=${this.key}&callback=BMAP_INITIAL_CALLBACK`
      script.onerror = (err) => {
        reject(err)
      }
      document.body.appendChild(script)
    })
  }
}

const mapService = new MapService()

export { mapService }
