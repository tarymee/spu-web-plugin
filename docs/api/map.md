## mapService (统一地图服务)

V9.1.5 版本新增了地图商切换功能，可根据各个租户需求自定义使用高德/腾讯/百度地图商，具体配置路径：`IDE-工具-租户环境配置-自定义地图设置`，用户需去对应的地图商开放平台申请各端的 key 填入，即可使用。如果不启用自定义地图，则默认使用高德地图（key 由公司默认提供）。

`注意：mapService 服务是较为全面的地图商应用方案。由于各个地图商 API 各有差异，需要编写繁琐的兼容代码，因此一般只用于开发较为通用的功能和应用较广的控件，比如定位服务、地址选择控件等。普通的地图功能开发，还是建议用原来的高德地图 JS-API 即可。`

地图服务实例，根据用户自定义地图设置，初始化对应的高德/腾讯/百度地图商的 `JS-API`。

- 高德地图开放平台: https://lbs.amap.com/
- 腾讯地图开放平台: https://lbs.qq.com/
- 百度地图开放平台: https://lbsyun.baidu.com/

- 类型：

```js
interface IMapService {
  type: 'amap' | 'tencent' | 'baidu' // 地图商类型
  AMap: AMap // 高德地图 JS-API 类 也可通过 window.AMap 获取
  TMap: TMap // 腾讯地图 JS-API 类 也可通过 window.TMap 获取
  BMap: BMap // 百度地图 JS-API 类 也可通过 window.BMap 获取
  init: () => Promise<void> // 初始化函数
}
```

- 示例：根据用户设置展示对应的地图商地图，并初始化定位到北京天安门。

```vue
<template>
  <div class="map" id="mapid"></div>
</template>

<script setup>
import { mapService } from '@smart100/spu-web-plugin'

let map = null
let type = ''

const initMap = async (mapId = '') => {
  if (map) return
  await mapService.init()
  type = mapService.type
  if (type === 'amap') {
    map = new window.AMap.Map(mapId)
  } else if (type === 'tencent') {
    map = new window.TMap.Map(mapId)
  } else if (type === 'baidu') {
    map = new window.BMap.Map(mapId)
    map.enableScrollWheelZoom(true)
  }
}

const destroyMap = () => {
  if (map) {
    if (type === 'amap') {
      map.destroy()
      map = null
    } else if (type === 'tencent') {
      map.destroy()
      map = null
    } else if (type === 'baidu') {
      map = null
    }
  }
}

const setCenterAndZoom = (longitude, latitude, zoom = 12) => {
  if (type === 'amap') {
    map.setZoomAndCenter(zoom, [longitude, latitude])
  } else if (type === 'tencent') {
    map.setCenter(new window.TMap.LatLng(latitude, longitude))
    map.setZoom(zoom)
  } else if (type === 'baidu') {
    map.centerAndZoom(new window.BMap.Point(longitude, latitude), zoom)
  }
}

onMounted(async () => {
  await initMap('mapid')
  const tiananmen = {
    longitude: '116.397453',
    latitude: '39.908671'
  }
  setCenterAndZoom(tiananmen.longitude, tiananmen.latitude, 12)
})

onBeforeUnmount(() => {
  destroyMap()
})
</script>
<style scoped>
.map {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
```

## AMapLoader 高德地图 JS API

高德地图 `JS API` 是高德开放平台免费提供的 Web 地图渲染引擎，以 WebGL 为主要绘图手段，本着“更轻、更快、更易用”的服务原则，广泛采用了各种前沿技术，交互体验、视觉体验大幅提升，同时提供了众多新增能力和特性。

- https://lbs.amap.com/api/javascript-api-v2/summary

插件对其进行了封装，不需要申请填写高德 key(插件已处理)，使之能结合 Vue3 使用。

- 类型：

```js
function load (options?: {
  plugins?: Array<string>
  AMapUI?: {
    plugins?: Array<string>
  }
}): Promise<any>
```

- 示例：

```vue
<template>
  <div class="map" id="mapid"></div>
</template>

<script setup>
import { AMapLoader } from '@smart100/spu-web-plugin'

let map = null

const ininMap = async () => {
  await AMapLoader.load()
  map = new window.AMap.Map('mapid', {
    center: [105.602725, 37.076636]
  })
  map.on('complete', function () {
    console.log('地图加载完成！')
  })
}

onMounted(() => {
  ininMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.destroy()
    map = null
  }
})
</script>
<style scoped>
.map {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
```

## getLocation() 获取定位

获取当前定位信息。

- 类型：

```js
function getLocation (): Promise<{
  longitude: string
  latitude: string
  address: string
} | null>
```

- 示例：

```js
import { getLocation } from '@smart100/spu-web-plugin'

const location = await getLocation()
console.log(location)
```

## getDistance() 计算距离

计算两个经纬度距离。

- 类型：

```js
function getDistance (p1: [number, number], p2: [number, number]): Promise<number>
```

- 示例：

```js
import { getDistance } from '@smart100/spu-web-plugin'

const addressA = {
  longitude: '113.285637',
  latitude: '23.125178'
}

const addressB = {
  longitude: '113.295637',
  latitude: '23.165178'
}

const distance = await getDistance([addressA.longitude, addressA.latitude], [addressB.longitude, addressB.latitude])
console.log(Math.ceil(distance))
```
