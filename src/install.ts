import { initStorageProxy } from './storageProxy'
import login from './login'
import { initAxios } from './axios'
import urlquery from './urlquery'
import { initSpuConfig } from './spuConfig'
import { initApaasSpuTrack } from './apaasSpuTrack'
import { merge } from 'lodash-es'
import { initTest } from './test'

const globalOptions: SPUWebPluginOptions = {
  modulekey: 'demospu',
  modulename: 'demospu',
  moduleversion: 'v1.0',
  router: null
}

const install = (app: any, options: SPUWebPluginOptions) => {
  // console.log(app)
  // console.log(app.version)
  merge(globalOptions, options)
  console.log('@smart100/spu-web-plugin start!')
  console.log('options', options)
  console.log('globalOptions', globalOptions)

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
  initApaasSpuTrack()
  urlquery.init()
  login.startRefreshtoken()
  initTest(globalOptions)

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
    console.error('@smart100/spu-web-plugin require a vue-router instance.')
  }
}

export {
  install,
  globalOptions
}
