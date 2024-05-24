import { initStorageProxy } from './storageProxy'
import login from './login'
import { initAxios } from './axios'
import urlquery from './urlquery'
import { initSpuConfig } from './spuConfig'
import { merge } from 'lodash-es'

import { initTest } from './test'
// import tenantInfo from './tenantInfo'
// import { downloadService } from './oss'


const globalOptions: SPUWebPluginOptions = {
  modulekey: 'demospu',
  modulename: 'demospu',
  moduleversion: 'v1.0',
  router: null
}

let isInstall = false

const install = (app: any, options: SPUWebPluginOptions) => {
  // console.log(app)
  // console.log(app.version)
  console.log('@smart100/spu-web-plugin options', options)
  merge(globalOptions, options)
  console.log('@smart100/spu-web-plugin globalOptions', globalOptions)

  // if (install.installed) return
  // install.installed = true
  // debugger

  // if (app) {
  //   const version = Number(app.version.split('.')[0])
  //   if (version < 3) {
  //     console.error('This plugin requires Vue 3')
  //     return false
  //   }
  // } else {
  //   console.error('This plugin requires Vue App Instance')
  // }


  initStorageProxy(globalOptions)
  initAxios(globalOptions)
  initSpuConfig(globalOptions)
  urlquery.init()
  login.startRefreshtoken()

  // setTimeout(async () => {
  //   const a = await downloadService.getUrl({
  //     // source: 'a1b9954a-fb39-4bb2-aa0b-501f4af0d99e.jpeg',
  //     // datetime: '1698832693257',
  //     // source: '2f7dfe47-1827-4db1-9d99-3ddb08bb7e21.jpg',
  //     // datetime: '1698832697897',
  //     source: 'e3befbe5-8954-46d2-a368-5f812a5530e5.jpg',
  //     datetime: '1699527237567',
  //     // cope: {
  //     //   width: 100
  //     // }
  //   })
  //   console.log(a)
  //   console.log(71117)
  // }, 1000)


  // tenantInfo.getAndSave()

  if (globalOptions.router) {
    globalOptions.router.beforeEach(async (to: any, from: any, next: any) => {
      // console.log(from)
      // console.log(to)
      // const isInitVisit = from.path === '/' && from.name === undefined // 路由初始化访问
      // console.log('isInitVisit', isInitVisit)

      // 自动登录
      if (to.query.token) {
        const singleLoginRes = await login.singleLogin(to.query)
        next({
          path: to.path,
          params: to.params,
          query: singleLoginRes.query
        })
      } else {
        next()
      }
    })
  } else {
    console.error('请传入 router 实例。')
  }


  initTest(globalOptions)

  isInstall = true

  // Vue.component('xt-engine', components.engine)
  // Vue.prototype.$xtEngine = () => {
  //   console.log('$xtEngine')
  // }

  // const component = options?.component
  // if (component) {
  //   for (const x in component) {
  //     register(x, component[x])
  //   }
  // }
}

export {
  install,
  isInstall,
  globalOptions
}
