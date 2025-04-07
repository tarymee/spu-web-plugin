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

  get isLbssettingEnable() {
    return tenantSetting.get('lbssetting')?.enable === '1'
  }

  private get setting(): ILbsSetting | undefined {
    return tenantSetting.get('lbssetting')?.setting
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
  MapCore: any = null

  // get AMap() {
  //   if (!this.isInit || this.type !== 'amap') {
  //     return null
  //   }
  //   return window.AMap
  // }

  // get TMap() {
  //   if (!this.isInit || this.type !== 'tencent') {
  //     return null
  //   }
  //   return window.TMap
  // }

  // get BMap() {
  //   if (!this.isInit || this.type !== 'baidu') {
  //     return null
  //   }
  //   return window.BMap
  // }

  // get MapCore() {
  //   if (!this.isInit) {
  //     return null
  //   }
  //   return window.BMap
  // }

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
      await this.initTecent()
    } else if (type === 'amap') {
      if (!key || !secretkey) {
        console.error('请填写高德地图 Web App Key 和 Web Secret Key')
        return
      }
      await this.initAmap()
    } else if (type === 'baidu') {
      if (!key) {
        console.error('请填写百度地图 Web App Key')
        return
      }
      await this.initBaidu()
    }
    this.isInit = true
  }

  // reset() {
  //   this.isInit = false
  // }

  private async initTecent() {
    await importJS(
      `https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${this.key}`,
      // `https://map.qq.com/api/gljs?v=1.exp&key=${this.key}`,
      'TMap'
    )
    this.TMap = window.TMap
    this.MapCore = window.TMap
    await delay(300)
  }

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
      this.MapCore = window.AMap
      // console.log(window)
      // console.log(window.AMap)
      // console.log(window.AMapUI)
      // console.log(window.AMapLoader)
      // console.log(window.AMap === aaaa)
      resolve(window.AMap)
    })
  }

  private async initBaidu() {
    return new Promise((resolve, reject) => {
      window.BMAP_INITIAL_CALLBACK = (e: any) => {
        // console.log(e)
        // debugger
        this.BMap = window.BMap
        this.MapCore = window.BMap
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
