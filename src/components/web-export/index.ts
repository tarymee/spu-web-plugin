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
  // 属性
  disableButton: false,

  // 事件
  onButtonClick: null
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
    const attributes = getAttributes(this)
    console.log(attributes)
    this.config = {
      ...defaultConfig,
      ...attributes
    }
    this.shadow.innerHTML = renderTemplate(this)

    this.initEvent()
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
