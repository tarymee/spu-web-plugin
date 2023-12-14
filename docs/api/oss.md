## uploadService.upload() 上传服务
+ 类型：

```js
// 存储方式
// storage: 永久储存
// storage-1d: 存一天
// storage-3m: 存三月
// storage-1y: 存一年
type StorageType = 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y'

interface IUpload {
  type?: 'att' | 'img', // 要上传的文件类型
  file: File, // 所要上传的文件
  source?: string, // 文件名 如果不传则由插件默认生成
  datetime?: string | number, // 文件时间戳 如果不传则由插件默认生成
  storagetype?: StorageType, // 存储方式
  onprogress?: (p: number, _checkpoint?: any) => void // 上传进度回调
}

function upload ({
  type = 'img',
  file,
  source = '',
  datetime = '',
  storagetype = 'storage',
  onprogress,
}: IUpload): Promise<any>
```

上传文件。

+ 示例：

```js
import { uploadService } from '@smart100/spu-web-plugin'

const imgOss = await uploadService.upload({
  type: 'img',
  file: File, // input 所选择的图片文件
  source: 'xxxx-xxxx-xxxx-xxxx.png',
  datetime: '1700495139977',
  storagetype: 'storage',
})
console.log(imgOss)
```



## downloadService.getUrl() 下载服务
+ 类型：

```js
type StorageType = 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y'

type Cope = { width?: number, height?: number } | string | boolean

interface IDownload {
  type?: 'att' | 'img', // 文件类型
  source: string, // 文件名
  datetime: string | number, // 文件时间戳
  storagetype?: StorageType, // 存储方式
  cope?: Cope // 如果要下载的文件是图片 可定义图片压缩方式
}

function getUrl ({
  type = 'img',
  source = '',
  datetime = '',
  storagetype = 'storage',
  cope = ''
}: IDownload): Promise<any>
```

获取文件URL。

+ 示例：

```js
import { downloadService } from '@smart100/spu-web-plugin'

const imgUrl = await downloadService.getUrl({
  type: 'img',
  source: 'xxxx-xxxx-xxxx-xxxx.png',
  datetime: '1700495139977',
  storagetype: 'storage',
  cope: {
    width: 200,
    height: 200
  }
})
console.log(imgUrl)
```
