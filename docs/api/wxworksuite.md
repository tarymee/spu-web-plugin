# wxworkSuite 企微第三方应用相关服务

## JSSDK
企业微信JS-SDK是企业微信面向网页开发者提供的基于企业微信内的网页开发工具包。

通过使用企业微信JS-SDK，网页开发者可借助企业微信高效地使用拍照、选图、语音、位置等手机系统的能力，同时可以直接使用企业微信分享、扫一扫等企业微信特有的能力，为企业微信用户提供更优质的网页体验。

> 所有的JS接口只能在企业微信应用的可信域名下调用(包括子域名)，且可信域名必须有ICP备案且在管理端验证域名归属。验证域名归属的方法在企业微信的管理后台“我的应用”里，进入应用，设置应用可信域名。

查阅 API 学习：https://developer.work.weixin.qq.com/document/path/90546

我们对企业微信第三方应用开发的 JS-SDK 进行了封装，自动处理了前置使用条件：引入js文件 - 权限验证（签名） - 成功回调等流程，开发只需关注业务功能。

使用时，先通过 config 接口注入需要使用的 JS 接口列表，即可在 Promise 的回调中使用 JS-SDK 的 API。

+ 示例：

```js
import { wxworkSuite } from '@smart100/spu-web-plugin'

// 扫码
wxworkSuite.JSSDK.init(['scanQRCode']).then(({ topWindow }) => {
  // 注意: 必须使用返回的 topWindow 来调用 wx 下的方法 不可直接使用 window.wx 调用
  // 原因: 企业微信 JSSDK 必须保证在 top window 上注册和调用才有效
  // 插件已自动处理了 top window 上的注册 并返回了 topWindow 供用户调用
  topWindow.wx.scanQRCode({
    desc: 'scanQRCode desc',
    needResult: 0, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
    scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
    success: function (res: any) {
      console.log(res)
    },
    error: function (res: any) {
      console.error(res)
    }
  })
})


// 打开个人信息页接口
wxworkSuite.JSSDK.init(['openUserProfile']).then(({ topWindow }) => {
  topWindow.wx.invoke('openUserProfile', {
    type: 1, // 1表示该userid是企业成员，2表示该userid是外部联系人
    userid: 'woOUQJEAAATELkAo5cgbkznEdBjmtgcA' // 可以是企业成员，也可以是外部联系人
  }, function (res) {
    console.error('openUserProfile')
    console.log(res)
  })
})

// 其他更多能力 请参考 官方api 文档 https://developer.work.weixin.qq.com/document/path/90546
```

## isWxworkSuiteTenant()
判断当前登录账号的租户是否企微第三方应用租户（只有通过企微扫码或授权登录才算企微第三方应用租户）。

+ 类型：

```js
function isWxworkSuiteTenant(): Boolean
```

+ 示例：

```js
import { wxworkSuite } from '@smart100/spu-web-plugin'
const isWxworkSuiteTenant = wxworkSuite.isWxworkSuiteTenant()
console.log(isWxworkSuiteTenant)
```

## isWxwork()
判断当前页面是否在企微软件内，包括电脑端和APP端。

+ 类型：

```js
function isWxwork(): Boolean
```

+ 示例：

```js
import { wxworkSuite } from '@smart100/spu-web-plugin'
const isWxwork = wxworkSuite.isWxwork()
console.log(isWxwork)
```

## isWxworkPc()
判断当前页面是否在电脑端企微软件内。

+ 类型：

```js
function isWxworkPc(): Boolean
```

+ 示例：

```js
import { wxworkSuite } from '@smart100/spu-web-plugin'
const isWxworkPc = wxworkSuite.isWxworkPc()
console.log(isWxworkPc)
```

## isWxworkApp()
判断当前页面是否在APP端企微软件内。

+ 类型：

```js
function isWxworkApp(): Boolean
```

+ 示例：

```js
import { wxworkSuite } from '@smart100/spu-web-plugin'
const isWxworkApp = wxworkSuite.isWxworkApp()
console.log(isWxworkApp)
```



## wxworksuite-opendata 组件
企微基础通讯录组件。

企业通讯录是企业的重要敏感数据，第三方将不再直接获取到授权企业的通讯录数据（接口将不再返回人名与部门名）。`wxworksuite-opendata` 组件对企微官方 `open-data` 组件进行了封装，使之便于使用，开发只需关注业务功能。

查阅 API 学习：https://developer.work.weixin.qq.com/document/path/91958

`注意：企微基础通讯录组件仅在企微租户，且通过企微扫码或企微授权登录，且在企微授权的正式域名下（本地开发域名/ip下不生效）才可正常展示人员名称与部门名称。`


参考 H5 端 组件文档。

## wxworksuite-organizationpick-mobile 组件
企微手机端组织选择组件。

参考 H5 端 组件文档。

## wxworksuite-organizationpick-web 组件
企微电脑端组织选择组件。

参考手机端组织选择组件，用法一致，仅样式不同。

## wxworksuite-memberpick-mobile 组件
企微手机端人员选择组件。

参考 H5 端 组件文档。

## wxworksuite-memberpick-web 组件
企微电脑端人员选择组件。

参考手机端人员选择组件，用法一致，仅样式不同。
