import { installApaasSpuTrack } from './apaasSpuTrack'
import { installSpuComponents } from './components'
import { installSpuConfig, spuConfig } from './spuConfig'
import { installNativeApi } from './nativeApi/index'
import { installWxworksuitePlugin, wxworkSuite } from './wxworksuitePlugin'
import { Module } from './manager'

function installSpuService() {
  installSpuComponents() // 安装spu特有组件
  installSpuConfig()
  installWxworksuitePlugin() // 安装企微第三方应用插件
  installNativeApi()
  installApaasSpuTrack()
}

export { installSpuService, Module, spuConfig, wxworkSuite }
