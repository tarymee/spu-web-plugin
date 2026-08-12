import { version } from '../package.json'
import { merge } from 'lodash-es'
import { v4 as getUuid } from 'uuid'
import { installStorageProxy, lsProxy, ssProxy } from './storageProxy'
import { getLocation, getDistance, getAddress } from './map/index'
import { installAxios, spuAxios, apaasAxios, normalAxios, decryptAxiosResponseData } from './axios'
import { installAxiosCache, axiosCache } from './axiosCache'
import { installSpuConfig, spuConfig } from './spuConfig'
import { globalConfig } from './globalConfig'
import { downloadService, uploadService, installOssCache, ossCache } from './oss'
import { getServToken } from './oss/servtoken'
import { getCloudServ } from './oss/cloudServ'
import {
  getUniqueid,
  functionCheck,
  setTitle,
  isInApp,
  isdebugger,
  isvirtuallocation,
  getServerTime,
  isOnline
} from './utils'
import { encrypt, decrypt } from './crypt'
import { installUrlquery } from './urlquery'
import { mapService } from './map/MapService'
import AMapLoader from './map/AMapLoader'
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  getTokenExpires,
  setTokenExpires,
  checkLogin,
  getUser,
  updateToken,
  singleLogin,
  installAuth
} from './login'
import { Module } from './core'
import components from './components'
import { expandexp } from './components/expandexp'
import { installApaasSpuTrack } from './apaasSpuTrack'
import { installWxworksuitePlugin, wxworkSuite } from './wxworksuitePlugin'
import { installTest } from './test'
import { installCenterHost } from './centerHost'

// class SPUWebPlugin {
//   static install = install
//   static version = version
// }
// // SPUWebPlugin.install = install
// // SPUWebPlugin.version = version

const globalOptions: any = {
  isspu: true,
  customerid: '', // spuConfig 用到
  customertype: '', // spuConfig 用到
  axiosbaseurl: '',
  modulename: '',
  modulekey: '',
  moduleversion: '',
  storageproxyprefix: '',
  isfixapptokenexpired: false, // 是否修复apptoken过期问题 目前版本暂时不默认修复 等门户引擎验证通过之后 再改成默认修复
  osscache: {
    flag: false,
    cachetime: 60 * 1000 * 60 * 2 // 默认缓存2小时
  },
  singleLoginCallback: null,
  centerHost: null,
  router: null
}

const dealOptions = (options: any) => {
  merge(globalOptions, options)

  let flag = true
  if (globalOptions.axiosbaseurl.endsWith('/')) {
    console.error(`axiosbaseurl 不得以 “/” 结尾！`)
    flag = false
  }

  if (globalOptions.isspu) {
    if (!globalOptions.modulekey || !globalOptions.moduleversion) {
      console.error(`spu 项目必须传入 modulekey | moduleversion！`)
      flag = false
      // console.error(`您当前没有传入，插件自动获取 url 链接上的 modulekey | moduleversion 作为参数。`)
      // // 基于部署路径查出 modulekey moduleversion
      // const arr = location.pathname.split('/')
      // globalOptions.modulekey = arr[1] || ''
      // globalOptions.moduleversion = arr[2] || ''
    }
  } else {
    if (globalOptions.modulekey || globalOptions.moduleversion || globalOptions.modulename) {
      console.error(`非 spu 项目不得传入 modulekey | moduleversion | modulename！`)
      flag = false
    }
    if (!globalOptions.storageproxyprefix) {
      console.error(`非 spu 项目必须传入 storageproxyprefix 以作为 localStorage 命名空间前缀！`)
      flag = false
    }
  }

  return flag
}



const install = (app: any, options: any) => {
  // console.log(app)
  // console.log(app.version)

  const flag = dealOptions(options)

  if (!flag) {
    console.error(`@smart100/spu-web-plugin@${version} not install!`)
    return
  }

  installStorageProxy()
  installUrlquery()
  installCenterHost()
  installAxios()
  installAxiosCache()
  globalOptions.isspu && installSpuConfig()
  installWxworksuitePlugin() // 安装企微第三方应用插件
  installAuth()
  installOssCache()
  globalOptions.isspu && installApaasSpuTrack()

  installTest(globalOptions)

  console.log(`@smart100/spu-web-plugin@${version} install!`)
  console.log(`@smart100/spu-web-plugin@${version} userOptions`, options)
  console.log(`@smart100/spu-web-plugin@${version} globalOptions`, globalOptions)

  // setTimeout(() => {
  //   console.error('8877778')
  // }, 1000)

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
}

const SPUWebPlugin = {
  install,
  version
}

export {
  SPUWebPlugin as default,
  globalOptions,
  lsProxy,
  ssProxy,
  getLocation,
  getDistance,
  getAddress,
  normalAxios,
  spuAxios,
  apaasAxios,
  apaasAxios as axios, // 兼容之前导出
  decryptAxiosResponseData,
  axiosCache,
  spuConfig,
  globalConfig,
  ossCache,
  downloadService,
  uploadService,
  getServToken,
  getCloudServ,
  getUniqueid,
  getUuid,
  functionCheck,
  getServerTime,
  isOnline,
  encrypt,
  decrypt,
  setTitle,
  isInApp,
  AMapLoader,
  mapService,
  singleLogin,
  updateToken,
  getToken,
  getTokenExpires,
  getRefreshToken,
  setToken,
  setTokenExpires,
  setRefreshToken,
  getUser,
  checkLogin,
  Module,
  components,
  expandexp,
  wxworkSuite,
  isdebugger,
  isvirtuallocation
}
