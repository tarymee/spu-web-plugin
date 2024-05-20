import renderTemplate from './template'

/**
 * 获取 Custom elements 上所有属性的键值对
 * @param {HTMLElement} elem
 * @returns
 */
const getAttributes = (elem: any) => {
  console.log(elem)
  if (!elem) return {}
  const attrs: any = {}
  const attrSource = Object.values(elem.attributes)
  if (attrSource?.length > 0) {
    attrSource.forEach(ele => {
      const { name, value } = ele as any
      attrs[name] = value
    })
  }

  return attrs
}


const componentName = 'spu-web-export'


const defaultConfig = {
  exportApi: '',
  sheetname: '',
  pagecode: '',
  data: null,
}

export default class SpuWebExport extends HTMLElement {

  shadow!: ShadowRoot
  config = defaultConfig

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  // 当自定义元素第一次被连接到文档DOM时被调用。
  connectedCallback () {
    this.initConfig()
    this.shadow.innerHTML = renderTemplate(this)
    this.initEvent()
  }

  initConfig () {
    const attributes = getAttributes(this)
    this.config = {
      ...defaultConfig,
      ...attributes
    }
    console.log('attributes', attributes)
    console.log('this.config', this.config)
  }

  initEvent () {
    // this.shadow.querySelector('.spu-web-export')!.addEventListener('click', (e) => {
    //   // console.log(this)
    //   // console.log(this.shadow)
    //   console.log(e)
    //   console.log(e.target)
    //   console.log(e.target.nodeName)
    //   debugger

    //   this.dispatchEvent(new CustomEvent('click', {
    //     detail: {
    //       clickMessage: 'Hello from within the Custom Element'
    //     }
    //   }))
    // }, true)

    this.shadow.querySelector('.modal-th .close')!.addEventListener('click', () => {
      // console.log(this)
      this.parentNode!.removeChild(this)
    })
  }

  updateView () {
    // console.log('属性变化', name)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    // console.log('属性变化', name)
  }

  // 当组件从 DOM 文档移除后调用。
  disconnectedCallback () {
    // console.log('disconnectedCallback')
    // setTimeout(() => {
    //   console.log(this)
    // }, 100)
  }
}

// 定义组件
if (!window.customElements.get(componentName)) {
  window.customElements.define(componentName, SpuWebExport)
}










class Export {
  count = 0

  ele: null | HTMLElement = null

  open () {
    this.count++
    if (!this.ele) {
      this.ele = document.createElement('spu-web-export')
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
