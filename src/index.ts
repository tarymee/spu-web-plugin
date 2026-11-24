import { version } from '../package.json'
import { merge } from 'lodash-es'
import { installStorageProxy, lsProxy, ssProxy } from './storageProxy'
import { installCenterHost } from './centerHost'
import { installUrlquery } from './urlquery'
import { installAxios, spuAxios, apaasAxios, normalAxios, decryptAxiosResponseData } from './axios'
import { installAxiosCache, axiosCache } from './axios/axiosCache'
import { downloadService, uploadService, installOssCache, ossCache } from './oss'
import { globalConfig } from './globalConfig'
import { getServToken } from './oss/servtoken'
import { getCloudServ } from './oss/cloudServ'
import { getLocation, getDistance, getAddress } from './map/index'
import { AI } from './AI'
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
} from './auth/login'
import { installSpuService, Module, spuConfig, wxworkSuite } from './spu'
import {
  getUuid,
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
import { expandexp } from './components/expandexp'
import { installLitComponents } from './components-lit'
import { litPreviewImage } from './components-lit/LitPreviewImage'

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
  installLitComponents() // 安装lit通用组件
  installAuth() // 安装授权模块 包括 登录服务 token相关服务 user相服务关 环境信息服务 等等
  installOssCache()
  globalOptions.isspu && installSpuService() // 安装spu相关服务

  console.log(`@smart100/spu-web-plugin@${version} install!`)
  console.log(`@smart100/spu-web-plugin@${version} userOptions`, options)
  console.log(`@smart100/spu-web-plugin@${version} globalOptions`, globalOptions)

  // setTimeout(() => {
  //   console.error('99999999999999999')
  // }, 1000)

  // setTimeout(async () => {
  //   const imgUrl = await downloadService.getUrl({
  //     type: 'img',
  //     source: '590184d6-f156-4792-85f6-90e408222333.png',
  //     datetime: '1790670071186',
  //     storagetype: 'storage'
  //   })
  //   // console.log(imgUrl)
  //   // console.log(AI)
  //   try {
  //     const a = await AI.fakeCheck(imgUrl)
  //     // const a = await AI.blurCheck(imgUrl)
  //     console.log(a)
  //   } catch (err) {
  //     console.error(7777)
  //     console.error(err)
  //   }
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
  AMapLoader,
  mapService,
  getLocation,
  getDistance,
  getAddress,
  normalAxios,
  spuAxios,
  apaasAxios,
  apaasAxios as axios, // 必须保留 兼容之前导出
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
  expandexp,
  wxworkSuite,
  isdebugger,
  isvirtuallocation,
  AI,
  litPreviewImage
}
