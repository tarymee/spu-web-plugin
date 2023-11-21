## getLocation() 获取定位
+ 类型：

```js
function getLocation (): Promise<{
  longitude: string
  latitude: string
  address: string
} | null>
```

获取当前定位信息。

示例：
```js
import { getLocation } from '@smart100/spu-web-plugin'

const location = await getLocation()
console.log(location)
```


## getDistance() 计算距离
+ 类型：

```js
function getDistance (p1: [number, number], p2: [number, number]): Promise<number>
```

计算两个经纬度距离。

示例：
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
