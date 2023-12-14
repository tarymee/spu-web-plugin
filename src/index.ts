import { version } from '../package.json'
import { install } from './install'
import { lsProxy, ssProxy } from './storageProxy'
import { getLocation, getDistance } from './location'
import { spuAxios, apaasAxios } from './axios'
import { spuConfig } from './spuConfig'
import { downloadService, uploadService } from './oss'
import { getUniqueid, functionCheck } from './utils'
import AMapLoader from './AMapLoader'
import login from './login'
import { v4 as getUuid } from 'uuid'
// import { downloadService } from './oss'

// class SPUWebPlugin {
//   static install = install
//   static version = version
// }
// // SPUWebPlugin.install = install
// // SPUWebPlugin.version = version

const SPUWebPlugin = {
  install,
  version
}


const getToken = login.getToken.bind(login)
const getTokenExpires = login.getTokenExpires.bind(login)
const getRefreshToken = login.getRefreshToken.bind(login)
const getUser = login.getUser.bind(login)
const checkLogin = login.checkLogin.bind(login)


export {
  SPUWebPlugin as default,
  lsProxy,
  ssProxy,
  getLocation,
  getDistance,
  spuAxios,
  apaasAxios,
  spuConfig,
  downloadService,
  uploadService,
  getUniqueid,
  getUuid,
  functionCheck,
  AMapLoader,
  getToken,
  getTokenExpires,
  getRefreshToken,
  getUser,
  checkLogin
}
