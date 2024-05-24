## AMapLoader.load()
高德地图 `JS API` 是高德开放平台免费提供的 Web 地图渲染引擎，以 WebGL 为主要绘图手段，本着“更轻、更快、更易用”的服务原则，广泛采用了各种前沿技术，交互体验、视觉体验大幅提升，同时提供了众多新增能力和特性。

+ https://lbs.amap.com/api/javascript-api/summary
+ https://lbs.amap.com/demo/list/js-api

插件对其进行了封装，不需要申请填写高德key(插件已处理)，使之能结合 Vue3 使用。

+ 类型：

```js
function load (options?: {
  plugins?: Array<string>
  AMapUI?: {
    plugins?: Array<string>
  }
}): Promise<any>
```

+ 示例：

```vue
<template>
  <div class="amap" id="mapid"></div>
</template>
<script setup>
import { AMapLoader } from '@smart100/spu-web-plugin'
let map = null
let AMap = null
const ininMap = async () => {
  AMap = await AMapLoader.load(
    // {
    //   plugins: ['AMap.Geolocation', 'AMap.Geocoder']
    //   AMapUI: {
    //     plugins: []
    //   }
    // }
  )
  map = new AMap.Map('mapid', {
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
  AMap && (AMap = null)
})
</script>
<style scoped>
.amap {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
```
