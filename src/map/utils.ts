function transformLat (x: number, y: number) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

function transformLon (x: number, y: number) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0
  return ret
}

function outOfChina (lng: number, lat: number) {
  return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271)
}

function delta (lng: number, lat: number) {
  const a = 6378245.0 // 地球长半轴
  const ee = 0.00669342162296594323 // 扁率
  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLon(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * Math.PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI)
  return {
    lat: dLat,
    lng: dLng
  }
}

function wgs84ToGcj02 (lng: number, lat: number) {
  if (outOfChina(lng, lat)) {
    return {
      lng: lng,
      lat: lat
    }
  }
  const d = delta(lng, lat)
  return {
    lng: lng + d.lng,
    lat: lat + d.lat
  }
}



/**
 * 坐标常量说明：
 * COORDINATES_WGS84 = 1, WGS84坐标
 * COORDINATES_WGS84_MC = 2, WGS84的平面墨卡托坐标
 * COORDINATES_GCJ02 = 3，GCJ02坐标
 * COORDINATES_GCJ02_MC = 4, GCJ02的平面墨卡托坐标
 * COORDINATES_BD09 = 5, 百度bd09经纬度坐标
 * COORDINATES_BD09_MC = 6，百度bd09墨卡托坐标
 * COORDINATES_MAPBAR = 7，mapbar地图坐标
 * COORDINATES_51 = 8，51地图坐标
 */
const BMapTransformBD09ToGCJ02Points = (points: any[]) => {
  return new Promise((resolve, reject) => {
    new window.BMap.Convertor().translate(points, 5, 3, (data: any) => {
      if (!data.status) {
        resolve(data.points)
      } else {
        console.error(data)
        // reject(data.status)
        resolve(points)
      }
    })
  })
}

const BMapTransformGCJ02ToBD09Points = (points: any[]) => {
  return new Promise((resolve, reject) => {
    const convertor = new window.BMap.Convertor()
    convertor.translate(points, 3, 5, (data: any) => {
      if (!data.status) {
        resolve(data.points)
      } else {
        console.error(data)
        // reject(data.status)
        resolve(points)
      }
    })
  })
}

export {
  wgs84ToGcj02,
  BMapTransformBD09ToGCJ02Points,
  BMapTransformGCJ02ToBD09Points
}
