# 接口请求

统一对 `axios` 实例进行封装，增加配置项自动传递 `token`，显示 `loadding` 遮罩层等等。

并提供了多种 `axios` 实例用以适配不同的接口情况。

## 请求配置

`axios` 实例除了默认支持原有 `axios` 的请求配置之外，还额外支持以下配置项，配置项可不传，不传采用默认值：

```js
{
  modulekey: '', // spuAxios 实例特有，请求别的 SPU 接口，发起请求时会自动在 url 上拼接前缀：/api/modulekey/moduleversion，默认为空
  isShowLoading: true, // 发起请求时是否展示 loadding 弹窗，默认 true
  isSendToken: true, // 发起请求时是否在 headers 传递 token，默认 true
  isSendTecode: true, // 发起请求时是否在 headers 传递 tecode 租户号，默认 false
}
```

## spuAxios

`SPU` 接口调用形态：

- 调用接口加前缀 `/api/${modulekey}/${moduleversion}`
- 状态码一直返回200，调用成功/错误基于接口数据返回的 data.code【200是成功】判断
- 返回数据放 data.data，错误信息放 data.msg

`spuAxios` 是专门用于请求 `SPU` 接口的 `axios` 实例，统一对返回数据进行包装，保证一致性。

- 类型：

```js
const spuAxios: AxiosInstance
```

- 统一数据返回类型：

```js
const spuAxiosRes: Promise<{
  code: 200 | 404 | number
  data: any
  msg: string
}>
```

- 示例：

```js
import { spuAxios } from '@smart100/spu-web-plugin'

// 请求当前 SPU 内的接口，发起请求时会自动在 url 上拼接前缀：/api/modulekey/moduleversion
spuAxios
  .post(
    '/customer/getCustomerInfo',
    {
      customerid: '123456'
    },
    // 额外配置项
    {
      isShowLoading: true,
      isSendToken: true,
      isSendTecode: false
    }
  )
  .then((res: any) => {
    console.log(res)
    if (res.code === 200) {
      console.log(res.data)
    } else {
      window.alert(res.msg)
    }
  })
  .catch((err: any) => {
    window.alert(err.message)
  })

// 所处前端项目是访销SPU【customervisit】，想请求主数据SPU【system】的接口
spuAxios
  .post(
    '/dictionary/getDictionaryList', // 获取数据字典
    {
      dictionarycode: '953797145398480985',
      dictionaryid: '',
      dicvalue: '',
      status: 1,
      pageindex: 0,
      pagesize: 99999
    },
    // 额外配置项
    {
      modulekey: 'system'
    }
  )
  .then((res: any) => {
    console.log(res)
    if (res.code === 200) {
      console.log(res.data)
    } else {
      window.alert(res.msg)
    }
  })
  .catch((err: any) => {
    window.alert(err.message)
  })
```

## apaasAxios/axios

`低码flycode` 或 `旧格式（比如平台接口）` 接口调用形态：

- 返回数据放 `data.resp_data`
- 错误信息放 `data.error_code`
- 状态码基于 `http` 状态码返回

`apaasAxios` 专门用于请求 `低码flycode` 或 `旧格式（比如平台接口）` 接口，统一对返回数据进行包装，保证一致性。

`apaasAxios` 和 `axios` 是相同的函数，区别在于 `axios` 是旧写法已经不推荐使用【怕与原 axios 依赖同名混淆】，`apaasAxios` 是新写法，推荐使用新写法。

- 类型：

```js
const apaasAxios: AxiosInstance
const axios: AxiosInstance
```

- 统一数据返回类型：

```js
const apaasAxios: Promise<{
  code: 200 | 404 | number
  data: any
  msg: string
}>
```

- 示例：

```js
import { apaasAxios, axios } from '@smart100/spu-web-plugin'

// 请求平台 flycode 接口
apaasAxios
  .post(
    '/api/teapi/dy-biz/893405830819483679/1498533100018339939',
    {
      kx_kq_store: {
        id: '123456'
      }
    }
  )
  .then((res: any) => {
    console.log(res)
    if (res.code === 200) {
      console.log(res.data)
    } else {
      window.alert(res.msg)
    }
  })
  .catch((err: any) => {
    window.alert(err.message)
  })

// 请求平台刷新 token 接口
apaasAxios
  .get('/api/auth/refreshtoken', {
    params: {
      refreshtoken: 'xxx'
    },
    isShowLoading: false,
    isSendTecode: true,
    // 不传默认token 传递自定义token
    isSendToken: false,
    headers: {
      token: 'xxx'
    }
  })
  .then((res: any) => {
    // console.log(res)
  })

```

## normalAxios

`normalAxios` 一般用于调用非 `SPU` 接口和非 `低码flycode` 或 `旧格式（比如平台接口）`，接口返回什么就是什么，不做包装。

- 类型：

```js
const normalAxios: AxiosInstance
```

- 示例：

```js
import { normalAxios } from '@smart100/spu-web-plugin'

// 请求图片blob
normalAxios
  .get('http://xxx.jpg', {
    responseType: 'blob',
    isSendToken: false
  })
  .then((response: any) => {
    console.log(response)
  })
  .catch((e: any) => {
    console.error(e)

  })
```
