import AMapLoader from './AMapLoader'
import { cloneDeep } from 'lodash-es'
import urlquery from './urlquery'

type Location = {
  longitude: string;
  latitude: string;
  address: string;
  [propName: string]: any;
} | null

let AMap: any = null
let geocoder: any = null
let geolocation: any = null
let datetime: number | null = null
let lastLocation: Location = null
let runing = false
let locationPromise: Promise<Location>

const init = async () => {
  if (!AMap) {
    AMap = await AMapLoader.load({
      plugins: ['AMap.Geolocation', 'AMap.Geocoder']
    })
    geocoder = new AMap.Geocoder({
      city: '',
      radius: 500
    })
    geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 3000
    })
  }
}

const getAmapLocation = async (): Promise<Location> => {
  await init()
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        const { lng, lat } = result.position
        // console.log('getAmapLocation success')
        resolve({
          longitude: lng.toString(),
          latitude: lat.toString(),
          address: ''
        })
      } else {
        // reject(new Error('getAmapLocation fail'))
        console.error('getAmapLocation fail')
        resolve(null)
      }
    })
  })
}

const getSpuLocation = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    let isload = false
    setTimeout(() => {
      if (!isload) {
        console.error('getSpuLocation timeout 10000')
        resolve(null)
      }
    }, 10000)
    window.Native.getLocation((result: any, error: any, status: any) => {
      isload = true
      // console.log('getLocation result', result)
      // console.log('getLocation error', error)
      // console.log('getLocation status', status)
      if (result && result?.longitude && result?.latitude) {
        resolve({
          longitude: result.longitude.toString(),
          latitude: result.latitude.toString(),
          address: result.address || ''
        })
      } else {
        console.error('getSpuLocation fail')
        resolve(null)
      }
    })
  })
}

const getAmapCityLocation = async (): Promise<Location> => {
  await init()
  return new Promise((resolve, reject) => {
    geolocation.getCityInfo((status: string, result: any) => {
      if (status === 'complete') {
        const lng = result.position[0].toString()
        const lat = result.position[1].toString()
        // console.log('getAmapCityLocation success')
        // resolve([lng, lat])
        resolve({
          longitude: lng.toString(),
          latitude: lat.toString(),
          address: ''
        })
      } else {
        // reject(new Error('getAmapCityLocation fail'))
        console.error('getAmapCityLocation fail')
        resolve(null)
      }
    })
  })
}

const getAddress = async (position: Location): Promise<string> => {
  await init()
  return new Promise((resolve, reject) => {
    if (position) {
      geocoder.getAddress([position.longitude, position.latitude], (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          resolve(result.regeocode.formattedAddress)
        } else {
          // reject(new Error('getAddress fail'))
          console.error('getAddress fail')
          resolve('')
        }
      })
    }
  })
}

// 定位流程: 缓存 > 判断环境（APP，小程序，企微）基于环境获取定位 > 高德地图高精度定位 > 百度地图定位 > 高德城市定位
const getLocationPromise = async (): Promise<Location> => {
  let location: Location = null

  // 在 SPU 容器里使用 Native-API 的定位
  if (window?.Native?.getLocation) {
    location = await getSpuLocation()
  }

  // 高德定位
  if (!location) {
    location = await getAmapLocation()
  }

  // 城市定位结果不精确 仅在开发模式下使用
  // if (!location && process.env.NODE_ENV !== 'production') {
  if (!location && urlquery.isvirtuallocation) {
    location = await getAmapCityLocation()
  }

  // 测试虚拟定位
  if (!location && urlquery.isvirtuallocation) {
    location = {
      longitude: '113.34331353081598',
      latitude: '23.105349663628473',
      address: ''
    }
  }

  if (location && !location.address) {
    location.address = await getAddress(location) || '经纬度获取成功，但地址获取失败。'
  }

  return location
}


const getLocation = async () => {
  // debugger
  // 缓存30秒
  if (datetime && Date.now() - datetime <= 30000 && lastLocation && !runing) {
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

const getDistance = async (p1: [number, number], p2: [number, number]) => {
  await init()
  return AMap.GeometryUtil.distance(p1, p2)
}


// // 两个经纬度距离计算
// function getDistance (latlng1, latlng2) {
//   console.log(latlng1)
//   console.log(latlng2)
//   const lng1 = Number(latlng1[0])
//   const lat1 = Number(latlng1[1])
//   const lng2 = Number(latlng2[0])
//   const lat2 = Number(latlng2[1])
//   const radLat1 = (lat1 * Math.PI) / 180.0
//   const radLat2 = (lat2 * Math.PI) / 180.0
//   const a = radLat1 - radLat2
//   const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
//   let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
//   s = s * 6378.137 // EARTH_RADIUS
//   s = Math.round(s * 10000) / 10000
//   return s * 1000
// }

export {
  getLocation,
  getDistance
}
