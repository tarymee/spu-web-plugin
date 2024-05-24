## expandexp()

执行该方法，即可弹出一个 `导出弹窗`，对接数据导出服务。

+ 类型：

```js
interface IOptions {
  exportapi: 'string', // 导出接口
  sheetname: 'string', // 导出文件名 不需加后缀
  pagecode: 'string', // 该 SPU 导出页面所对应的 pagecode
  mergedata?: Object // 与用户选择配置合并参数传参
}

function expandexp (options: IOptions): void
```

+ 示例：

```js
import { expandexp } from '@smart100/spu-web-plugin'

const modulekey = 'customervisit'
const moduleversion = 'v1.1'

expandexp({
  exportapi: `/api/${modulekey}/${moduleversion}/formimpexp/export`,
  sheetname: '终端进离-统计',
  pagecode: 'customervisit:store-inandout',
  mergedata: {
    microClass: 'StoreInAndOutProvider',
    kx_customer: {
      aiStatus: '',
      saleAreaPath: '',
      signInTime: null,
      signOutTime: '2024-05-22 23:59:59',
      inPositioningDeviationMark: '',
      outPositioningDeviationMark: '',
      kaSystemName: '',
      customerName: '',
      channelType: '',
      storeType: '',
      storeLevel: '',
      submitter: '',
      date: []
    }
  }
})
```
