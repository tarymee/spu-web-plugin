import { WxworksuitePluginInstall, jssdk, isWxworkSuiteTenant, isWxwork, isWxworkPc, isWxworkApp } from '@smart100/wxworksuite-plugin'
import login from './login'

function installWxworksuitePlugin() {
  WxworksuitePluginInstall({
    getToken: login.getToken.bind(login)
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
