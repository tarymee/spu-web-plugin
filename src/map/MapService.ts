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
  isInit = false

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

  get AMap() {
    if (!this.isInit || this.type !== 'amap') {
      return null
    }
    return window.AMap
  }

  get TMap() {
    if (!this.isInit || this.type !== 'tencent') {
      return null
    }
    return window.TMap
  }

  get BMap() {
    if (!this.isInit || this.type !== 'baidu') {
      return null
    }
    return window.BMap
  }

  async init() {
    if (this.isInit) return

    this.isInit = true

    const type = this.type

    // if (process.env.NODE_ENV === 'development') {
    //     type = 'baidu'
    // }
    if (type === 'tencent') {
      await this.initTecent()
    } else if (type === 'amap') {
      await this.initAmap()
    } else if (type === 'baidu') {
      await this.initBaidu()
    }
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
    await delay(300)
  }

  private async initAmap() {
    // if (this.secretkey) {
    //   window._AMapSecurityConfig = {
    //     securityJsCode: this.secretkey
    //   }
    // }

    const plugin = ['AMap.Geolocation']
    // plugin.push('AMap.Geocoder') // 不开放地址查询 改用ipaas

    const AMap = await AMapLoader.load({
      key: this.key,
      version: '2.0',
      plugins: plugin,
      AMapUI: {
        version: '1.1',
        plugins: []
      }
    })
    window.AMap = AMap
    // console.log(window)
    // console.log(window.AMap)
    // console.log(window.AMapUI)
    // console.log(window.AMapLoader)
    // console.log(window.AMap === aaaa)
  }

  private async initBaidu() {
    // await importJS(
    //     `https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=${this.key}`,
    //     'BMap'
    // )
    // await delay(300)
    // function initialize() {
    //     const mp = new BMap.Map('map')
    //     mp.centerAndZoom(new BMap.Point(121.491, 31.233), 11)
    // }
    return new Promise((resolve, reject) => {
      window.__baiduMapInitial = function () {
        // 启用google标准坐标体系
        // coordsType 指定输入输出的坐标类型，BMAP_COORD_GCJ02为gcj02坐标，BMAP_COORD_BD09为bd0ll坐标，默认为BMAP_COORD_BD09。
        window.BMap.coordType = 'BMAP_COORD_GCJ02'
        resolve(null)
      }
      const script = document.createElement('script')
      // 使用最新 3.0 api https://lbsyun.baidu.com/index.php?title=jspopular3.0
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=${this.key}&callback=__baiduMapInitial`
      // script.src = `https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=${this.key}&callback=__baiduMapInitial`
      script.onerror = (err) => {
        reject(err)
      }
      document.body.appendChild(script)
    })
  }
}

const mapService = new MapService()

export { mapService }
