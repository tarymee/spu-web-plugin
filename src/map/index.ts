import { urlquery } from '../urlquery'
import { cloneDeep } from 'lodash-es'
import { mapService } from './MapService'
import { getAMapKey } from './AMapKey'
import { axios } from '../axios'
import { delay } from '../utils'
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
  console.log('getLocationByNative start...')
  return new Promise((resolve, reject) => {
    let isload = false
    setTimeout(() => {
      if (!isload) {
        console.error('getLocationByNative fail: timeout 30000')
        resolve(null)
      }
    }, 30000)
    window.Native.getLocation((res: any, error: any, status: any) => {
      // console.log('window.Native.getLocation res', res)
      // console.log('window.Native.getLocation error', error)
      // console.log('window.Native.getLocation status', status)
      isload = true
      if (res && res?.longitude && res?.latitude) {
        const result = {
          longitude: res.longitude.toString(),
          latitude: res.latitude.toString(),
          address: res.address || ''
        }
        console.log(`getLocationByNative success: ${JSON.stringify(result)}`)
        resolve(result)
      } else {
        console.error('getLocationByNative fail')
        resolve(null)
      }
    })
  })
}

// 浏览器定位: 需要开启https
const getLocationByNavigator = async (): Promise<Location> => {
  console.log('getLocationByNavigator start...')
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
            const result = {
              latitude: Gcj02.lat.toString(),
              longitude: Gcj02.lng.toString()
            }
            console.log(`getLocationByNavigator success: ${JSON.stringify(result)}`)
            resolve(result)
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
const getIPLocationByIpaas = async (ip?: string): Promise<Location> => {
  console.log('getIPLocationByIpaas start...')
  return new Promise((resolve, reject) => {
    const AMapKey = getAMapKey()

    axios
      .post(
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

          const result = {
            longitude: ((rects[0].longitude + rects[1].longitude) / 2).toString(),
            latitude: ((rects[0].latitude + rects[1].latitude) / 2).toString()
          }
          console.log(`getIPLocationByIpaas success: ${JSON.stringify(result)}`)
          resolve(result)
        } else {
          console.error('getIPLocationByIpaas fail')
          resolve(null)
        }
      })
      .catch((err: any) => {
        console.error(err)
        console.error('getIPLocationByIpaas fail')
        resolve(null)
      })
  })
}

// ipaas 逆地址解析
const getAddressByIpaas = async (position: Location): Promise<string> => {
  console.log('getAddressByIpaas start...')
  // 如果不设置安全秘钥的话 js-api的逆地址查询不成功 返回 INVALID_USER_SCODE 改成用ipaas服务查询
  return new Promise(async (resolve, reject) => {
    if (position) {
      try {
        const AMapKey = getAMapKey()
        const result = await axios.post(
          'https://silkroad.wxchina.com/api/openapi/publishEvent?topic=xw-listener&subtopic=xw-listener&apicaseid=6684389338001809906',
          {
            longitude: position.longitude,
            latitude: position.latitude,
            key: AMapKey.key
            // extensions: 'all'
          }
        )
        // console.log(result)
        const address = result?.data?.formatted_address
        if (address) {
          console.log(`getAddressByIpaas success: ${address}`)
          resolve(address)
        } else {
          console.error('getAddressByIpaas fail')
          resolve('')
        }
      } catch (error) {
        console.error(error)
        console.error('getAddressByIpaas fail')
        resolve('')
      }
    }
  })
}

// 高德定位
const getLocationByAMap = async (): Promise<Location> => {
  console.log('getLocationByAMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.AMap) {
      console.error('getLocationByAMap fail: AMap is undefinded')
      resolve(null)
      return
    }
    new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000
    }).getCurrentPosition((status: string, res: any) => {
      // console.log(status, result)
      // debugger
      if (status === 'complete') {
        const { lng, lat } = res.position
        const result = {
          longitude: lng.toString(),
          latitude: lat.toString()
        }
        console.log(`getLocationByAMap success: ${JSON.stringify(result)}`)
        resolve(result)
      } else {
        console.error('getLocationByAMap fail')
        resolve(null)
      }
    })
  })
}

// 高德城市定位
const getCityLocationByAMap = async (): Promise<Location> => {
  console.log('getCityLocationByAMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.AMap) {
      console.error('getCityLocationByAMap fail: AMap is undefinded')
      resolve(null)
      return
    }
    new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000
    }).getCityInfo((status: string, res: any) => {
      // console.log(res)
      // debugger
      if (status === 'complete') {
        const lng = res.position[0].toString()
        const lat = res.position[1].toString()
        const result = {
          longitude: lng.toString(),
          latitude: lat.toString()
        }
        console.log(`getCityLocationByAMap success: ${JSON.stringify(result)}`)
        resolve(result)
      } else {
        console.error('getCityLocationByAMap fail')
        resolve(null)
      }
    })
  })
}

// 高德逆地址解析
const getAddressByAMap = async (position: Location): Promise<string> => {
  console.log('getAddressByAMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.AMap) {
      console.error('getAddressByAMap fail: AMap is undefinded')
      resolve('')
      return
    }
    if (position) {
      new window.AMap.Geocoder({
        city: '',
        radius: 500
      }).getAddress([position.longitude, position.latitude], (status: string, result: any) => {
        // console.log(status)
        // console.log(result)
        // debugger
        if (status === 'complete' && result.info === 'OK' && result?.regeocode?.formattedAddress) {
          const address = result.regeocode.formattedAddress || ''
          console.log(`getAddressByAMap success: ${address}`)
          resolve(address)
        } else {
          console.error(`getAddressByAMap fail: status = ${status}, result = ${result}`)
          resolve('')
        }
      })
    }
  })
}

// 腾讯ip定位：通过终端设备IP地址获取其当前所在地理位置，精确到市级，常用于显示当地城市天气预报、初始化用户城市等非精确定位场景。
const getIPLocationByTMap = async (ip?: string): Promise<Location> => {
  console.log('getIPLocationByTMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.TMap) {
      console.error('getIPLocationByTMap fail: TMap is undefinded')
      resolve(null)
      return
    }

    const params = ip ? { ip } : {}
    new window.TMap.service.IPLocation()
      .locate({ ...params, servicesk: mapService.secretkey })
      .then((res: any) => {
        const result = {
          longitude: res.result.location.lng.toString(),
          latitude: res.result.location.lat.toString()
        }
        console.log(`getIPLocationByTMap success: ${JSON.stringify(result)}`)
        resolve(result)
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
  console.log('getAddressByTMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.TMap) {
      console.error('getAddressByTMap fail: TMap is undefinded')
      resolve('')
      return
    }

    if (position) {
      // debugger
      new window.TMap.service.Geocoder()
        .getAddress({
          location: new window.TMap.LatLng(position.latitude, position.longitude),
          getPoi: false,
          servicesk: mapService.secretkey
        })
        .then((res: any) => {
          // console.log(res)
          // debugger
          const address = res?.result?.formatted_addresses?.recommend || res?.result?.address
          console.log(`getAddressByTMap success: ${address}`)
          resolve(address)
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
  console.log('getLocationByBMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.BMap) {
      console.error('getLocationByBMap fail: BMap is undefinded')
      resolve(null)
      return
    }
    new window.BMap.Geolocation().getCurrentPosition(
      async (res: any) => {
        // console.log(res)
        // debugger
        if (!res) {
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
        //   lng: res.longitude,
        //   lat: res.latitude
        // }])
        // console.log(point)
        // debugger

        const lng = res.point.lng.toString()
        const lat = res.point.lat.toString()
        const result = {
          longitude: lng,
          latitude: lat
        }
        console.log(`getLocationByBMap success: ${JSON.stringify(result)}`)
        resolve(result)
      },
      {
        enableHighAccuracy: true
      }
    )
  })
}

// 百度城市定位
const getCityLocationByBMap = async (): Promise<Location> => {
  console.log('getCityLocationByBMap start...')
  return new Promise((resolve, reject) => {
    if (!window?.BMap) {
      console.error('getCityLocationByBMap fail: BMap is undefinded')
      resolve(null)
      return
    }
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
        const result = {
          longitude: point[0].lng,
          latitude: point[0].lat
        }
        console.log(`getCityLocationByBMap success: ${JSON.stringify(result)}`)
        resolve(result)
      } else {
        console.error('getCityLocationByBMap fail')
        resolve(null)
      }
    })
  })
}

// 百度逆地址解析
const getAddressByBmap = async (position: Location): Promise<string> => {
  console.log('getAddressByBmap start...')
  return new Promise(async (resolve, reject) => {
    if (!window?.BMap) {
      console.error('getAddressByBmap fail: BMap is undefinded')
      resolve('')
      return
    }

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
      // console.log(result)
      const address = result?.address
      if (address) {
        console.log(`getAddressByBmap success: ${address}`)
        resolve(address)
      } else {
        console.error('getAddressByBmap fail')
        // console.error(result)
        resolve('')
      }
    })
  })
}

const getLocationPromise = async (isuseiplocarion = false): Promise<Location> => {
  let location: Location = null

  // 在 SPU 容器里使用 Native-API 的定位
  if (window?.Native?.getLocation) {
    location = await getLocationByNative()
  }

  if (!location) {
    if (mapService.type === 'amap') {
      location = await getLocationByAMap()
      if (!location && isuseiplocarion) {
        location = await getCityLocationByAMap()
      }
      // 改成不使用ipaas了
      // if (!location && isuseiplocarion) {
      //   location = await getIPLocationByIpaas()
      // }
    } else if (mapService.type === 'tencent' && isuseiplocarion) {
      location = await getIPLocationByTMap()
    } else if (mapService.type === 'baidu') {
      location = await getLocationByBMap()
      if (!location && isuseiplocarion) {
        location = await getCityLocationByBMap()
      }
    }
  }

  if (!location) {
    location = await getLocationByNavigator()
  }
  // location = null

  // 开发模式下为了方便测试提供虚拟定位
  if (!location && urlquery.isvirtuallocation) {
    location = {
      longitude: '116.397454',
      latitude: '39.908671'
    }
  }

  // if (location) {
  //   for (let i = 0, len = 5000; i < len; i++) {
  //     // location.latitude = (Number(location.latitude) + 0.02).toString()
  //     location.longitude = (Number(location.longitude) + 0.002).toString()
  //     await getAddress(location)
  //     .then((res: any) => {
  //       console.log(res)
  //     }).catch((err: any) => {
  //       console.error(err)
  //     })
  //     await delay(300)
  //   }
  // }

  if (location && !location.address) {
    location.address = (await getAddress(location)) || '经纬度获取成功，但地址获取失败。'
  }

  return location
}

// WGS84 GCJ-02 BD-09 坐标系
// https://www.jianshu.com/p/559029832a67
// 不能精确定位的情况下是否启用ip城市定位，ip定位用于不需要精确定位的场景
async function getLocation(isuseiplocarion = false) {
  await mapService.init()
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
  locationPromise = getLocationPromise(isuseiplocarion)
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
  await mapService.init()

  let address = ''

  if (!address) {
    if (mapService.type === 'amap') {
      address = await getAddressByAMap(position)
      // if (!address) {
      //   // 如果不设置安全秘钥的话 js-api的逆地址查询不成功 返回 INVALID_USER_SCODE 改成用ipaas服务查询
      //   address = await getAddressByIpaas(position)
      // }
    } else if (mapService.type === 'tencent') {
      address = await getAddressByTMap(position)
    } else if (mapService.type === 'baidu') {
      address = await getAddressByBmap(position)
    }
  }
  return address
}

// const getDistance = async (p1: [number, number], p2: [number, number]) => {
//   await mapService.init()
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
