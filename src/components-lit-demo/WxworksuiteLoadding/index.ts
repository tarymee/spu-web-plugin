const styletext = `
  :host {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    background-color: rgba(255, 255, 255, 0.2);
  }
  :host .wxworksuite-loadding {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host .wxworksuite-loadding-icon {
    width: 24px;
    height: 24px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url(data:image/gif;base64,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);
  }
`

const template = `
  <div class="wxworksuite-loadding">
    <div class="wxworksuite-loadding-icon"></div>
  </div>
`

export default class WxworksuiteLoadding extends HTMLElement {

  static componentName: string = 'wxworksuite-loadding'
  static register () {
    if (!window.customElements.get(WxworksuiteLoadding.componentName)) {
      window.customElements.define(WxworksuiteLoadding.componentName, WxworksuiteLoadding)
    }
  }

  isuseshadow = true
  // isuseshadow = false
  shadow: ShadowRoot | null = null
  constructor () {
    super()
  }

  // 当自定义元素第一次被连接到文档DOM时被调用。
  connectedCallback () {
    // console.log('connectedCallback')
    const templateElem = document.createElement('template')
    templateElem.innerHTML = template
    const content = templateElem.content.cloneNode(true)

    if (this.isuseshadow) {
      this.shadow = this.attachShadow({ mode: 'open' })
      this.shadow.append(content)
      this.appendStyle()


      // this.shadow.querySelector('.wxworksuite-loadding').addEventListener('click', () => {
      //   console.log(this)
      //   console.log(this.isuseshadow)
      //   console.log(this.shadow)
      // })
      // this.addEventListener('click', () => {
      //   console.log(this)
      //   console.log(this.isuseshadow)
      //   console.log(this.shadow)
      // })

    } else {
      this.append(content)
      this.appendStyle()

      // this.addEventListener('click', () => {
      //   console.log(this)
      //   console.log(this.isuseshadow)
      //   console.log(this.shadow)
      // })
    }
  }

  // 当组件从 DOM 文档移除后调用。
  disconnectedCallback () {
    // console.log('disconnectedCallback')
    // setTimeout(() => {
    //   console.log(this)
    // }, 100)
  }

  createStyleEle () {
    var styleElement = document.createElement('style')
    styleElement.type = 'text/css'
    styleElement.id = WxworksuiteLoadding.componentName
    styleElement.innerHTML = styletext
    return styleElement
  }

  appendStyle () {
    if (this.isuseshadow) {
      const style = this.createStyleEle()
      this.shadow!.appendChild(style)
    } else {
      if (!document.getElementById(WxworksuiteLoadding.componentName)) {
        const style = this.createStyleEle()
        document.getElementsByTagName('head')[0].appendChild(style)
      }
    }
  }
}



class Loadding {
  count = 0

  ele: null | HTMLElement = null

  constructor () {
    WxworksuiteLoadding.register()
  }

  open () {
    this.count++
    if (!this.ele) {
      this.ele = document.createElement('wxworksuite-loadding')
      // console.log(this.ele)
      document.body.appendChild(this.ele)
    }
  }

  close () {
    this.count--
    if (this.count <= 0) {
      this.count = 0
      if (this.ele) {
        document.body.removeChild(this.ele)
        this.ele = null
      }
    }
  }
}

const loadding = new Loadding()

export {
  loadding
}
