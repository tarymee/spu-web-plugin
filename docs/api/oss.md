## getServToken()

获取对象存储云服务 accesskeyid/accesskeysecret/securitytoken/expiration 等信息。

- 类型：

```js
const getServToken: () => Promise<{
  accesskeyid: string
  accesskeysecret: string
  securitytoken: string
  expiration: string
}>
```

- 示例：

```js
import { getServToken } from '@smart100/spu-web-plugin'

const servToken = await getServToken()
console.log(servToken)
```

## getCloudServ()

获取对象存储云服务配置信息。

- 类型：

```js
type StorageType = 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y'

const getCloudServ: (type?: StorageType) => any
```

- 示例：

```js
import { getCloudServ } from '@smart100/spu-web-plugin'

const cloudServ = getCloudServ()
console.log(cloudServ)
```

## uploadService.upload()

上传文件。

- 类型：

```js
interface IUpload {
  type?: 'att' | 'img', // 要上传的文件类型
  file: File, // 所要上传的文件
  source?: string, // 文件名 如果不传则由插件默认生成
  datetime?: string | number, // 文件时间戳 如果不传则由插件默认生成
  storagetype?: 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y', // 存储方式
  onprogress?: (p: number, _checkpoint?: any) => void // 上传进度回调
}

function upload ({
  type = 'img',
  file,
  source = '',
  datetime = '',
  storagetype = 'storage',
  onprogress,
}: IUpload): Promise<{
  file: File,
  filename: string, // File.name
  type: string, // File.type
  source: string,
  datetime: string,
}>
```

- 示例：

```js
import { uploadService } from '@smart100/spu-web-plugin'

const imgOss = await uploadService.upload({
  type: 'img',
  file: File, // input 所选择的图片文件
  source: 'xxxx-xxxx-xxxx-xxxx.png',
  datetime: '1700495139977',
  storagetype: 'storage'
})
console.log(imgOss)
```

## uploadService.copy()

复制文件，返回复制的新文件的信息。

- 类型：

```js
interface ICopyOption {
  copykey: string, // 要上传的文件key
  storagetype?: 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y', // 存储方式
}

function copy ({
  copykey = '',
  storagetype = 'storage',
}: ICopyOption): Promise<{
  key: string,
  source: string,
  datetime: string, // 时间戳
  date: string, // '20240425'
  type: 'img' | 'att',
  storage: 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y',
}>
```

- 示例：

```js
import { uploadService } from '@smart100/spu-web-plugin'

const newFileData = await uploadService.copy({
  copykey: 'ca1/img/20250408/1688936/ca1b200a-8c99-47a6-9dd3-10a978da0132.jpg',
  storagetype: 'storage'
})
console.log(newFileData)
```

## downloadService.getUrl()

获取文件 URL。

- 类型：

```js
type Cope = { width?: number, height?: number } | string | boolean

interface IDownload {
  type?: 'att' | 'img', // 文件类型
  source: string, // 文件名
  datetime: string | number, // 文件时间戳
  storagetype?: 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y', // 存储方式
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

- 示例：

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
