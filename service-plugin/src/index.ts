import { version } from '../package.json'
import { merge } from 'lodash-es'
import downloadService from './oss/downloadService'
import uploadService from './oss/uploadService'

const globalOptions: any = {
  getTenantcode: null,
  getCloudserv: null,
  getToken: null,
  getRefreshToken: null,
  getTokenExpires: null,
  setToken: null,
  setRefreshToken: null,
  setTokenExpires: null
}

const install = (app: any, options: any) => {
  // console.log(app)
  // console.log(app.version)
  merge(globalOptions, options)

  for (const x in globalOptions) {
    if (!globalOptions[x]) {
      console.error(`need ${x} function`)
    }
  }

  // console.error('@smart100/service-plugin install!')
  console.log('@smart100/service-plugin install!')
  console.log('@smart100/service-plugin userOptions:', options)
  console.log('@smart100/service-plugin globalOptions:', globalOptions)
}

const ServicePlugin = {
  install,
  version
}

export { ServicePlugin as default, globalOptions, downloadService, uploadService }
