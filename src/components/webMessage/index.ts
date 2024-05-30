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
  :host .spu-web-message {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const template = `
  <div class="spu-web-message">
    <div class="spu-web-message-icon"></div>
  </div>
`

export default class SpuWebMessage extends HTMLElement {

  static componentName: string = 'spu-web-message'
  static register () {
    if (!window.customElements.get(SpuWebMessage.componentName)) {
      window.customElements.define(SpuWebMessage.componentName, SpuWebMessage)
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


      // this.shadow.querySelector('.spu-web-message').addEventListener('click', () => {
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
    styleElement.id = SpuWebMessage.componentName
    styleElement.innerHTML = styletext
    return styleElement
  }

  appendStyle () {
    if (this.isuseshadow) {
      const style = this.createStyleEle()
      this.shadow!.appendChild(style)
    } else {
      if (!document.getElementById(SpuWebMessage.componentName)) {
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
    SpuWebMessage.register()
  }

  open () {
    this.count++
    if (!this.ele) {
      this.ele = document.createElement('spu-web-message')
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
