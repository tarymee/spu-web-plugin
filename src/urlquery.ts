import VConsole from 'vconsole'
import { ssProxy } from './storageProxy'

class Urlquery {
  private isinit = false

  get isvirtuallocation(): boolean {
    return ssProxy.getItem('isvirtuallocation') === '1'
  }

  get isdebugger(): boolean {
    return ssProxy.getItem('isdebugger') === '1'
  }

  public init() {
    if (this.isinit) return false

    this.isinit = true

    // 调试
    if (location.href.indexOf('isdebugger=1') >= 0 || ssProxy.getItem('isdebugger') === '1') {
      ssProxy.setItem('isdebugger', '1')
      new VConsole({ theme: 'dark' }) /* eslint-disable-line no-new */
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
