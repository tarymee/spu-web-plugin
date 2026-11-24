# AI 服务

> `注意：使用前请确保租户已经开通了 AI 服务，且在【产品配置中心-系统设置-AI配置】打开 AI 开关和填写 AI 账号。`

## AI.fakeCheck() 翻拍检测

对传入的图片进行翻拍检测。

- 类型：

```js
function fakeCheck (imgUrl: string): Promise<{
  flag: boolean // 是否翻拍图片
}>
```

- 示例：

```js
import { AI, downloadService } from '@smart100/spu-web-plugin'

const imgUrl = await downloadService.getUrl({
  type: 'img',
  source: '590184d6-f156-4792-85f6-90e408222333.png',
  datetime: '1790670071186',
  storagetype: 'storage'
})
try {
  const result = await AI.fakeCheck(imgUrl)
  console.log(result)
} catch (err) {
  console.error(err)
}
```

## AI.blurCheck() 模糊检测

对传入的图片进行模糊检测，AI 识别结果返回该图片的`模糊度`和`模糊描述`。

然后将图片的`模糊度`与`【产品配置中心-系统设置-AI配置-照片模糊检测阈值】`进行对比，`模糊度`超过`照片模糊检测阈值`则算模糊。

注意：如果没有定义`照片模糊检测阈值`，则不返回 `flag` 字段。

- 类型：

```js
function blurCheck (imgUrl: string): Promise<{
  blur: string // 模糊度 类型为数字字符串
  desc: string // 模糊描述
  flag?: boolean // 是否模糊 与【产品配置中心-系统设置-AI配置-照片模糊检测阈值】的对比结果
}>
```

- 示例：

```js
import { AI, downloadService } from '@smart100/spu-web-plugin'

const imgUrl = await downloadService.getUrl({
  type: 'img',
  source: '590184d6-f156-4792-85f6-90e408222333.png',
  datetime: '1790670071186',
  storagetype: 'storage'
})
try {
  const result = await AI.blurCheck(imgUrl)
  console.log(result)
} catch (err) {
  console.error(err)
}
```
