import { property } from 'lit/decorators.js'
import WxworksuiteMemberpickMobile from './mobile'

export default class WxworksuiteMemberpickWeb extends WxworksuiteMemberpickMobile {

  static componentName: string = 'wxworksuite-memberpick-web'
  static register () {
    if (!window.customElements.get(WxworksuiteMemberpickWeb.componentName)) {
      window.customElements.define(WxworksuiteMemberpickWeb.componentName, WxworksuiteMemberpickWeb)
    }
  }

  @property({ type: String })
  displaytype: string = 'web'
}
