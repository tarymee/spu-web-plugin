import VConsole from 'vconsole'
import { ssProxy } from './storageProxy'
import { isMobile } from './utils'
import login from './login'

class Urlquery {
  private isinit = false

  get isvirtuallocation(): boolean {
    return ssProxy.getItem('isvirtuallocation') === '1'
  }

  get isdebugger(): boolean {
    return ssProxy.getItem('isdebugger') === '1'
  }

  // 获取 web 端引擎是否开了开发者模式
  private getWebDevmodel() {
    let flag = false
    let webSetting: any = window.localStorage.getItem('setting')
    if (webSetting) {
      try {
        webSetting = JSON.parse(webSetting)
        if (webSetting[login.getUser('tenantcode')]?.devmodel) {
          flag = true
        }
      } catch (err) {
        // console.error(err)
      }
    }
    return flag
  }

  // 单点登录后 获取 web 开发者模式 如果是则设置 isdebugger
  public dealWebDebugger() {
    if (!this.isdebugger && !isMobile() && this.getWebDevmodel()) {
      ssProxy.setItem('isdebugger', '1')
    }
  }

  public init() {
    if (this.isinit) return false

    this.isinit = true

    // 调试
    if (location.href.indexOf('isdebugger=1') >= 0 || ssProxy.getItem('isdebugger') === '1') {
      ssProxy.setItem('isdebugger', '1')
      if (isMobile()) {
        new VConsole({ theme: 'dark' }) /* eslint-disable-line no-new */
      }
    } else {
      ssProxy.setItem('isdebugger', '0')
    }

    // 虚拟定位测试
    if (location.href.indexOf('isvirtuallocation=1') >= 0 || ssProxy.getItem('isvirtuallocation') === '1') {
      ssProxy.setItem('isvirtuallocation', '1')
    } else {
      ssProxy.setItem('isvirtuallocation', '0')
    }

    // this.initDevTool()
  }

  // private initDevTool () {
  //   window.smart100_h5_set_isdebugger = (value = '1') => {
  //     ssProxy.setItem('isdebugger', value)
  //   }
  //   window.smart100_h5_set_isshowhead = (value = '0') => {
  //     ssProxy.setItem('isshowhead', value)
  //   }
  //   window.smart100_h5_set_ispermission = (value = '1') => {
  //     ssProxy.setItem('ispermission', value)
  //   }
  //   window.smart100_h5_set_isvirtuallocation = (value = '1') => {
  //     ssProxy.setItem('isvirtuallocation', value)
  //   }
  //   window.smart100_h5_set_whennotloggedisautojumplogin = (value = '0') => {
  //     ssProxy.setItem('whennotloggedisautojumplogin', value)
  //   }
  // }
}

const urlquery = new Urlquery()

function installUrlquery() {
  urlquery.init()
}

export { installUrlquery, urlquery }
