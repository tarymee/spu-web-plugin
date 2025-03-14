import {
  WxworksuitePluginInstall,
  jssdk,
  isWxworkSuiteTenant,
  isWxwork,
  isWxworkPc,
  isWxworkApp
} from '@smart100/wxworksuite-plugin'
import { getToken } from './login'

function installWxworksuitePlugin() {
  WxworksuitePluginInstall({
    getToken: getToken
  })
}

const wxworkSuite = {
  JSSDK: jssdk,
  isWxworkSuiteTenant,
  isWxwork,
  isWxworkPc,
  isWxworkApp
}

export { installWxworksuitePlugin, wxworkSuite }
