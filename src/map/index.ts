import { urlquery } from '../urlquery'
import { cloneDeep } from 'lodash-es'
import { mapApi } from './MapApi'
import { getAMapKey } from './AMapKey'
import { axios } from '../axios'
import { wgs84ToGcj02, BMapTransformBD09ToGCJ02Points } from './utils'

type Location = {
  longitude: string
  latitude: string
  address?: string
  // [propName: string]: any;
} | null

const cachetime = 30000 // 缓存时间30秒
let datetime: number | null = null
let lastLocation: Location = null
let runing = false
let locationPromise: Promise<Location>

// app端默认坐标为 gcj02
const getLocationByNative = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    let isload = false
    setTimeout(() => {
      if (!isload) {
        console.error('getLocationByNative fail: timeout 30000')
        resolve(null)
      }
    }, 30000)
    window.Native.getLocation((result: any, error: any, status: any) => {
      // console.log('getLocation result', result)
      // console.log('getLocation error', error)
      // console.log('getLocation status', status)
      isload = true
      if (result && result?.longitude && result?.latitude) {
        resolve({
          longitude: result.longitude.toString(),
          latitude: result.latitude.toString(),
          address: result.address || ''
        })
      } else {
        console.error('getLocationByNative fail')
        resolve(null)
      }
    })
  })
}

// 浏览器定位: 需要开启https
const getLocationByNavigator = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      const time = setTimeout(() => {
        console.error('getLocationByNavigator fail: timeout 5000')
        resolve(null)
      }, 5000)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log(position)
          // debugger
          clearTimeout(time)
          if (position.coords) {
            // 浏览器定位默认返回 WGS84 坐标 需要转化为 GCJ02 坐标
            const Gcj02 = wgs84ToGcj02(position.coords.longitude, position.coords.latitude)
            // console.log(Gcj02)
            // debugger
            resolve({
              latitude: Gcj02.lat.toString(),
              longitude: Gcj02.lng.toString()
            })
          } else {
            console.error('getLocationByNavigator fail')
            resolve(null)
          }
        },
        () => {
          clearTimeout(time)
          console.error('getLocationByNavigator fail')
          resolve(null)
        }
      )
    } else {
      console.error('getLocationByNavigator fail: navigator.geolocation not support')
      resolve(null)
    }
  })
}

// ipaas ip 定位
const getIPLocationByIpaas = async (
  ip?: string
): Promise<Location> => {
  return new Promise((resolve, reject) => {
    const AMapKey = getAMapKey()

    axios.post(
      'https://silkroad.wxchina.com/api/openapi/publishEvent?topic=xw-listener&subtopic=xw-listener&apicaseid=6684389338001815271',
      {
        key: AMapKey.key, // 好像不传也没问题 因为key是在ipaas那边设置的
        ip: ip || ''
      }
    )
      .then((res: any) => {
        // console.log(res)
        // debugger

        // res.data.rectangle = '113.1017375,22.93212254;113.6770499,23.3809537'
        if (res.data.rectangle) {
          const rectangle = res.data.rectangle
          const rects = rectangle.split(';').map((rect: any) => {
            const [longitude, latitude] = rect.split(',')
            return {
              longitude: Number(longitude),
              latitude: Number(latitude)
            }
          })

          resolve({
            longitude: ((rects[0].longitude + rects[1].longitude) / 2).toString(),
            latitude: ((rects[0].latitude + rects[1].latitude) / 2).toString()
          })
        } else {
          console.error('getIPLocationByIpaas fail')
          resolve(null)
        }
      }).catch((err: any) => {
        console.error(err)
        console.error('getIPLocationByIpaas fail')
        resolve(null)
      })
  })
}

// ipaas 逆地址解析
const getAddressByIpaas = async (position: Location): Promise<string> => {
  // 如果不设置安全秘钥的话 js-api的逆地址查询不成功 返回 INVALID_USER_SCODE 改成用ipaas服务查询
  return new Promise(async (resolve, reject) => {
    if (position) {
      try {
        const AMapKey = getAMapKey()
        const result = await axios.post('https://silkroad.wxchina.com/api/openapi/publishEvent?topic=xw-listener&subtopic=xw-listener&apicaseid=6684389338001809906', {
          longitude: position.longitude,
          latitude: position.latitude,
          key: AMapKey.key
          // extensions: 'all'
        })
        // console.log(result)

        if (result?.data?.formatted_address) {
          resolve(result?.data?.formatted_address)
        } else {
          console.error('getAddressByAmap fail')
          resolve('')
        }
      } catch (error) {
        console.error(error)
        console.error('getAddressByAmap fail')
        resolve('')
      }
    }
  })
}

// 高德定位
const getLocationByAmap = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    const geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000
    })

    geolocation.getCurrentPosition((status: string, result: any) => {
      // console.log(status, result)
      // debugger
      if (status === 'complete') {
        const { lng, lat } = result.position
        // console.log('getLocationByAmap success')
        resolve({
          longitude: lng.toString(),
          latitude: lat.toString()
        })
      } else {
        console.error('getLocationByAmap fail')
        resolve(null)
      }
    })
  })
}

// 高德城市定位
const getCityLocationByAmap = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    const geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000
    })
    geolocation.getCityInfo((status: string, result: any) => {
      // console.log(result)
      // debugger
      if (status === 'complete') {
        const lng = result.position[0].toString()
        const lat = result.position[1].toString()
        // console.log('getCityLocationByAmap success')
        resolve({
          longitude: lng.toString(),
          latitude: lat.toString()
        })
      } else {
        console.error('getCityLocationByAmap fail')
        resolve(null)
      }
    })
  })
}

// 高德逆地址解析
const getAddressByAmap = async (position: Location): Promise<string> => {
  // return new Promise((resolve, reject) => {
  //   if (position) {
  //     new window.AMap.Geocoder({
  //       city: '',
  //       radius: 500
  //     }).getAddress([position.longitude, position.latitude], (status: string, result: any) => {
  //       if (status === 'complete' && result.info === 'OK' && result.regeocode) {
  //         resolve(result?.regeocode?.formattedAddress || '')
  //       } else {
  //         console.error('getAddressByAmap fail')
  //         resolve('')
  //       }
  //     })
  //   }
  // })
  // 如果不设置安全秘钥的话 js-api的逆地址查询不成功 返回 INVALID_USER_SCODE 改成用ipaas服务查询
  const address = await getAddressByIpaas(position)
  return address
}

// 腾讯ip定位：通过终端设备IP地址获取其当前所在地理位置，精确到市级，常用于显示当地城市天气预报、初始化用户城市等非精确定位场景。
const getIPLocationByTMap = async (ip?: string): Promise<Location> => {
  return new Promise((resolve, reject) => {
    const ipLocation = new window.TMap.service.IPLocation()
    const params = ip ? { ip } : {}
    ipLocation
      .locate(params)
      .then((res: any) => {
        const { result } = res
        resolve({
          longitude: result.location.lng.toString(),
          latitude: result.location.lat.toString()
        })
      })
      .catch((err: any) => {
        console.error(err)
        console.error(`getIPLocationByTMap fail: ${JSON.stringify(err)}`)
        resolve(null)
      })
  })
}

// 腾讯逆地址解析
const getAddressByTMap = async (position: Location): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (position) {
      const location = new window.TMap.LatLng(position.latitude, position.longitude)
      // console.log(position)
      // console.log(location)
      // debugger
      new window.TMap.service.Geocoder()
        .getAddress({
          location,
          getPoi: false
        })
        .then((res: any) => {
          // console.log(res)
          // debugger
          resolve(res?.result?.formatted_addresses?.recommend || res?.result?.address)
        })
        .catch((err: any) => {
          console.error(err)
          console.error(`getAddressByTMap fail: ${JSON.stringify(err)}`)
          resolve('')
        })
    }
  })
}

// 百度浏览器定位
const getLocationByBMap = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    new window.BMap.Geolocation().getCurrentPosition(
      async (result: any) => {
        // console.log(result)
        // debugger
        if (!result) {
          console.error('getLocationByBMap fail')
          resolve(null)
          return
        }
        // 初始化已经指定 window.BMap.coordType = 'BMAP_COORD_GCJ02' 定位返回的定位信息，外层[latitude,longitude]依然是BD09，然后point里面的是GCJ02
        // {
        //   "accuracy": 150,
        //   "altitude": null,
        //   "altitudeAccuracy": null,
        //   "heading": null,
        //   "latitude": 39.915018933989,
        //   "longitude": 116.40383261074,
        //   "speed": null,
        //   "timestamp": null,
        //   "point": {
        //     "lng": 116.39745977716758,
        //     "lat": 39.908676092571405
        //   },
        //   "address": {
        //     "country": "",
        //     "city": "北京市",
        //     "city_code": 0,
        //     "district": "东城区",
        //     "province": "北京市",
        //     "street": "东华门大街",
        //     "street_number": "66号"
        //   }
        // }

        // 不用转换
        // const point: any = await BMapTransformBD09ToGCJ02Points([{
        //   lng: result.longitude,
        //   lat: result.latitude
        // }])
        // console.log(point)
        // debugger

        const lng = result.point.lng.toString()
        const lat = result.point.lat.toString()
        resolve({
          longitude: lng,
          latitude: lat
        })
      },
      {
        enableHighAccuracy: true
      }
    )
  })
}

// 百度城市定位
const getCityLocationByBMap = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    new window.BMap.LocalCity().get(async (res: any) => {
      // console.log(res)
      // debugger
      const lng = res.center.lng.toString()
      const lat = res.center.lat.toString()
      if (lng && lat) {
        // 城市ip定位返回的是 BD09 地址 需要转换
        const point: any = await BMapTransformBD09ToGCJ02Points([
          {
            lng,
            lat
          }
        ])
        // console.log(point)
        // debugger
        resolve({
          longitude: point[0].lng,
          latitude: point[0].lat
        })
      } else {
        console.error('getCityLocationByBMap fail')
        resolve(null)
      }
    })
  })
}

// 百度逆地址解析
const getAddressByBmap = async (position: Location): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    // resolve('')
    if (!position) {
      console.error('getAddressByBmap fail')
      resolve('')
      return
    }
    // // 把 GCJ02 转化为百度 BD09 地址
    // const points: any = await transformGCJ02ToBD09Points([{
    //   lng: position.longitude,
    //   lat: position.latitude
    // }])
    // const point = points[0]

    // 指定了 window.BMap.coordType = 'BMAP_COORD_GCJ02' 不需要转换
    const point = new window.BMap.Point(position.longitude, position.latitude)
    // console.log(point)
    // debugger
    new window.BMap.Geocoder().getLocation(point, (result: any) => {
      console.log(result)
      resolve(result.address || '')
    })
  })
}

// 定位流程: 缓存 > 判断环境（APP，小程序，企微）基于环境获取定位 > 地图商高精度定位 > 地图商城市ip定位
const getLocationPromise = async (): Promise<Location> => {
  let location: Location = null

  // 在 SPU 容器里使用 Native-API 的定位
  if (window?.Native?.getLocation) {
    location = await getLocationByNative()
  }

  if (!location) {
    location = await getLocationByNavigator()
  }

  if (!location) {
    if (mapApi.type === 'amap') {
      location = await getLocationByAmap()
      // ip城市定位结果不精确 但总比定不到位好
      if (!location) {
        location = await getCityLocationByAmap()
      }
    } else if (mapApi.type === 'tencent') {
      location = await getIPLocationByTMap()
    } else if (mapApi.type === 'baidu') {
      location = await getLocationByBMap()
      // ip城市定位结果不精确 但总比定不到位好
      if (!location) {
        location = await getCityLocationByBMap()
      }
    }
  }

  if (!location) {
    location = await getIPLocationByIpaas()
  }

  // 开发模式下为了方便测试提供虚拟定位
  if (!location && urlquery.isvirtuallocation) {
    location = {
      longitude: '116.397454',
      latitude: '39.908671'
    }
  }

  if (location && !location.address) {
    location.address = (await getAddress(location)) || '经纬度获取成功，但地址获取失败。'
  }

  return location
}

// WGS84 GCJ-02 BD-09 坐标系
// https://www.jianshu.com/p/559029832a67
async function getLocation() {
  await mapApi.init()
  // debugger
  // 缓存30秒
  if (datetime && Date.now() - datetime <= cachetime && lastLocation && !runing) {
    return cloneDeep(lastLocation)
  }
  // 兼容同时间发起多个
  if (runing && locationPromise) {
    return locationPromise
  }
  // console.log('runing')
  runing = true
  locationPromise = getLocationPromise()
  const locationRes = await locationPromise
  runing = false
  if (locationRes) {
    datetime = Date.now()
    lastLocation = locationRes
  }
  return locationRes
}

// 逆地址解析
const getAddress = async (position: Location): Promise<string> => {
  await mapApi.init()

  let address = ''

  // 先统一用ipaas解析 因为需要储存一致的地址格式（各地图商逆地址查询的地址格式不统一）
  // 如果不行再按照各地图商解析
  address = await getAddressByIpaas(position)

  if (!address) {
    if (mapApi.type === 'amap') {
      address = await getAddressByAmap(position)
    } else if (mapApi.type === 'tencent') {
      address = await getAddressByTMap(position)
    } else if (mapApi.type === 'baidu') {
      address = await getAddressByBmap(position)
    }
  }
  return address
}

// const getDistance = async (p1: [number, number], p2: [number, number]) => {
//   await mapApi.init()
//   return window.AMap.GeometryUtil.distance(p1, p2)
// }

// 两个经纬度距离计算
const getDistance = async (latlng1: [number, number], latlng2: [number, number]) => {
  // console.log(latlng1)
  // console.log(latlng2)
  const lng1 = Number(latlng1[0])
  const lat1 = Number(latlng1[1])
  const lng2 = Number(latlng2[0])
  const lat2 = Number(latlng2[1])
  const radLat1 = (lat1 * Math.PI) / 180.0
  const radLat2 = (lat2 * Math.PI) / 180.0
  const a = radLat1 - radLat2
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  let s =
    2 *
    Math.asin(
      Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))
    )
  s = s * 6378.137 // EARTH_RADIUS
  s = Math.round(s * 10000) / 10000
  return s * 1000
}

export { getLocation, getAddress, getDistance }
