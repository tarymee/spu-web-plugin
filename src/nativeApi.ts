import login from './login'
import core from './core'

class NativeApi {
  // 已经注入api的或者不同域的就不再注入
  checkIsCanInject(iframe: any) {
    try {
      return !iframe?.contentWindow?.Module || !!iframe?.contentWindow?.Module
    } catch (err) {
      console.error(err)
      console.error(`SPU 容器无法注入 Native-API，url： ${iframe.src}。`)
      return false
    }
  }

  injectApi(iframe: any, options: any) {
    const modulekey = options.modulekey
    // const modulekey = 'demospu'

    const Module = {
      spuContainerType: '',
      getContextSync() {
        return core.getContextSync(modulekey)
      },
      getIndextagSync: core.getIndextagSync.bind(core),
      checkPermission: core.checkPermission.bind(core),
      linkToPage: window?.Module?.linkToPage,
      linkToModule: window?.Module?.linkToModule,
      apiRequest: window?.Module?.apiRequest
    }

    const Native = {
      // exitPage: window?.Native?.exitPage,
      getLocation: window?.Native?.getLocation,
      getSystemInfoSync: window?.Native?.getSystemInfoSync
    }

    const aPaaS = {
      getUserInfoSync: login.getUser.bind(login),
      getToken: window?.aPaaS?.getToken
    }

    iframe.contentWindow.Module = Module
    iframe.contentWindow.Native = Native
    iframe.contentWindow.aPaaS = aPaaS
  }

  inject(iframe: any, options: any) {
    if (this.checkIsCanInject(iframe) && options?.modulekey) {
      this.injectApi(iframe, options)
    }
  }
}

const nativeApi = new NativeApi()

export default nativeApi
