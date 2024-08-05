import { version } from '../package.json'
import { merge } from 'lodash-es'
import { WxworksuitePluginInstall, jssdk, isWxworkSuiteTenant, isWxwork, isWxworkPc, isWxworkApp } from '@smart100/wxworksuite-plugin'
import { v4 as getUuid } from 'uuid'

import { initStorageProxy, lsProxy, ssProxy } from './storageProxy'
import { getLocation, getDistance } from './location'
import { initAxios, spuAxios, axios } from './axios'
import { initSpuConfig, spuConfig } from './spuConfig'
import { globalConfig } from './globalConfig'
import { downloadService, uploadService } from './oss'
import { getUniqueid, functionCheck, setTitle, getSpuContainerType, isInApp } from './utils'
import urlquery from './urlquery'
import AMapLoader from './AMapLoader'
import login from './login'
import core from './core'
import components from './components'
import { expandexp } from './components/expandexp'
import { initApaasSpuTrack } from './apaasSpuTrack'
import { initTest } from './test'



// class SPUWebPlugin {
//   static install = install
//   static version = version
// }
// // SPUWebPlugin.install = install
// // SPUWebPlugin.version = version



const globalOptions: any = {
  modulekey: 'demospu',
  modulename: 'demospu',
  moduleversion: 'v1.0',
  storageproxyprefix: '',
  router: null
}

const install = (app: any, options: any) => {

  urlquery.init()

  // console.log(app)
  // console.log(app.version)
  merge(globalOptions, options)
  console.log('@smart100/spu-web-plugin start!')
  console.log('@smart100/spu-web-plugin userOptions: ', options)
  console.log('@smart100/spu-web-plugin globalOptions: ', globalOptions)
  // console.error('test')

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

  // 安装企微第三方应用插件
  WxworksuitePluginInstall({
    getToken: login.getToken.bind(login)
  })

  login.startRefreshtoken()

  if (globalOptions.router) {
    globalOptions.router.beforeEach(async (to: any, from: any, next: any) => {
      // console.log(from)
      // console.log(to)
      // const isInitVisit = from.path === '/' && from.name === undefined // 路由初始化访问
      // console.log('isInitVisit', isInitVisit)

      // 自动登录
      if (to.query.token) {
        const singleLoginRes = await login.singleLogin(to.query)
        if (singleLoginRes.flag) {
          // debugger
          // next()
          next({
            path: to.path,
            params: to.params,
            query: singleLoginRes.query
          })
        } else {
          console.error('单点登录失败，请检查链接所传 token 是否非法或过期。')
          next()
        }
      } else {
        next()
      }
    })
  } else {
    console.warn('@smart100/spu-web-plugin 需要传入一个 vue-router 实例以便执行单点登录逻辑，如果您没传 vue-router 实例则需要自行在合适的位置执行单点登录代码。')
  }


  initApaasSpuTrack()

  initTest(globalOptions)
}

const SPUWebPlugin = {
  install,
  version
}



const updateToken = login.updateToken.bind(login)
const getToken = login.getToken.bind(login)
const getTokenExpires = login.getTokenExpires.bind(login)
const getRefreshToken = login.getRefreshToken.bind(login)
const getUser = login.getUser.bind(login)
const checkLogin = login.checkLogin.bind(login)
const singleLogin = login.singleLogin.bind(login)



const wxworkSuite = {
  JSSDK: jssdk,
  isWxworkSuiteTenant,
  isWxwork,
  isWxworkPc,
  isWxworkApp
}



const Module = {
  getModuleData: core.getModuleData.bind(core),
  getEnvname: login.getEnvname.bind(login),
  getEnvData: core.getEnvData.bind(core),
  checkModule: core.checkModule.bind(core),
  getSpuContainerType: getSpuContainerType
}


export {
  SPUWebPlugin as default,
  globalOptions,
  lsProxy,
  ssProxy,
  getLocation,
  getDistance,
  spuAxios,
  axios,
  axios as apaasAxios,
  spuConfig,
  globalConfig,
  downloadService,
  uploadService,
  getUniqueid,
  getUuid,
  functionCheck,
  setTitle,
  isInApp,
  AMapLoader,
  singleLogin,
  updateToken,
  getToken,
  getTokenExpires,
  getRefreshToken,
  getUser,
  checkLogin,
  Module,
  components,
  expandexp,
  wxworkSuite
}
