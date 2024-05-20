import { getAttributes } from '../common/index'
import renderTemplate from './template'

export default class SpuExpandexp extends HTMLElement {

  static componentName: string = 'spu-expandexp'
  static register () {
    if (!window.customElements.get(SpuExpandexp.componentName)) {
      window.customElements.define(SpuExpandexp.componentName, SpuExpandexp)
    }
  }

  shadow!: ShadowRoot
  defaultConfig = {
    exportApi: '',
    sheetname: '',
    pagecode: '',
    data: null,
  }
  config!: any

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
      ...this.defaultConfig,
      ...attributes
    }
    console.log('attributes', attributes)
    console.log('this.config', this.config)
  }

  initEvent () {
    // this.shadow.querySelector('.spu-expandexp')!.addEventListener('click', (e) => {
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
      this.removeSelf()
    })

    this.shadow.querySelector('.export-btnwrap .btn')!.addEventListener('click', () => {
      console.log('导出')
    })
  }

  removeSelf () {
    this.parentNode!.removeChild(this)
  }

  updateView () {
    // console.log('属性变化', name)
  }

  attributeChangedCallback (name: any, oldValue: any, newValue: any) {
    console.log('属性变化', name, oldValue, newValue)
  }

  // 当组件从 DOM 文档移除后调用。
  disconnectedCallback () {
    // console.log('disconnectedCallback')
    // setTimeout(() => {
    //   console.log(this)
    // }, 100)
  }
}



class Expandexp {
  ele!: HTMLElement
  config!: any

  constructor (config: any) {
    SpuExpandexp.register()
    this.config = config
    this.ele = document.createElement('spu-expandexp')

    if (this.config) {
      for (const x in this.config) {
        this.ele.setAttribute(x, this.config[x])
      }
    }

    // console.log(this.ele)
    document.body.appendChild(this.ele)
  }

  // close () {
  //   if (this.ele) {
  //     document.body.removeChild(this.ele)
  //   }
  // }
}



const expandexp = (config: any) => {
  return new Expandexp(config)
}


export {
  expandexp
}
