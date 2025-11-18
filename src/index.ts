import { version } from '../package.json'
import { merge } from 'lodash-es'
import { v4 as getUuid } from 'uuid'
import { installStorageProxy, lsProxy, ssProxy } from './storageProxy'
import { getLocation, getDistance, getAddress } from './map/index'
import { installAxios, spuAxios, axios, decryptAxiosResponseData } from './axios'
import { installSpuConfig, spuConfig } from './spuConfig'
import { globalConfig } from './globalConfig'
import { downloadService, uploadService } from './oss'
import { getServToken } from './oss/servtoken'
import { getCloudServ } from './oss/cloudServ'
import {
  getUniqueid,
  functionCheck,
  setTitle,
  isInApp,
  isdebugger,
  isvirtuallocation,
  getServerTime
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

// class SPUWebPlugin {
//   static install = install
//   static version = version
// }
// // SPUWebPlugin.install = install
// // SPUWebPlugin.version = version

const getDefaultGlobalOptions = () => {
  // 基于部署路径查出 modulekey moduleversion
  const arr = location.pathname.split('/')
  return {
    modulename: '',
    modulekey: arr[1] || '',
    moduleversion: arr[2] || '',
    storageproxyprefix: '',
    isfixapptokenexpired: false, // 是否修复apptoken过期问题 目前版本暂时不默认修复 等门户引擎验证通过之后 再改成默认修复
    singleLoginCallback: null,
    router: null
  }
}

const globalOptions: any = getDefaultGlobalOptions()

const install = (app: any, options: any) => {
  // console.log(app)
  // console.log(app.version)
  merge(globalOptions, options)

  installStorageProxy(globalOptions)
  installUrlquery()
  installAxios(globalOptions)
  installSpuConfig(globalOptions)
  installWxworksuitePlugin() // 安装企微第三方应用插件
  installAuth(globalOptions)
  installApaasSpuTrack()
  installTest(globalOptions)

  console.log(`@smart100/spu-web-plugin@${version} install!`)
  console.log(`@smart100/spu-web-plugin@${version} userOptions`)
  console.log(options)
  console.log(`@smart100/spu-web-plugin@${version} globalOptions`)
  console.log(globalOptions)

  // setTimeout(() => {
  //   console.error('888')
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
  spuAxios,
  axios,
  axios as apaasAxios,
  decryptAxiosResponseData,
  spuConfig,
  globalConfig,
  downloadService,
  uploadService,
  getServToken,
  getCloudServ,
  getUniqueid,
  getUuid,
  functionCheck,
  getServerTime,
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
