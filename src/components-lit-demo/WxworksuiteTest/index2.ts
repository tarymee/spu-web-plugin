import { LitElement, css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { repeat } from 'lit/directives/repeat.js'

export default class WxworksuiteTest2 extends LitElement {

  static componentName: string = 'wxworksuite-test2'
  static register () {
    if (!window.customElements.get(WxworksuiteTest2.componentName)) {
      window.customElements.define(WxworksuiteTest2.componentName, WxworksuiteTest2)
    }
  }

  @property({
    state: true, // 继承外部传入的值 但不响应更新
    // noAccessor: true, // 继承外部传入的值 但不响应更新
    type: Array
  })
  flag: boolean = false

  @property({
    type: Array
  })
  arr?: any = []


  constructor () {
    super()
    console.warn('constructor')
    this.print()
  }

  connectedCallback () {
    super.connectedCallback()
    console.warn('connectedCallback')
    this.print()
  }

  // 指定哪些属性更改应导致更新
  // shouldUpdate (changeProps: any) {
  //   return changeProps.has('flag')
  // }

  // 在组件的 DOM 第一次更新后调用，紧接在调用 updated() 之前
  firstUpdated () {
    console.warn('firstUpdated')
    this.print()
  }

  // 每当组件的更新完成并且元素的 DOM 已更新和呈现时调用
  updated () {
    console.warn('updated')
    this.print()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  attributeChangedCallback (name: any, oldValue: any, newValue: any) {
    console.log('属性变化', name, oldValue, newValue)
  }

  print () {
    console.log('this', this)
  }

  private change (e: Event) {
    console.warn('change')

    this.flag = !this.flag

    // this.arr.push({
    //   id: Date.now().toString(),
    //   name: 'ssss'
    // })
    // // this.arr[0].id = 'sddd'
    // // this.arr[0].name = 'sddd'
    // this.requestUpdate() // 强制更新
  }

  private test (e: Event) {
    console.log(this)
  }

  render () {
    return html`
      <button class="demo" @click="${this.change}">
        change
      </button>
      <button class="demo" @click="${this.test}">
        test
      </button>

      <div class="demo">
        ${ this.flag ? html`<div>flag: true</div>` : 'flag: false' }
      </div>

      <div class="demo">
        arr:
        ${
          this.arr.length
          ?
          html`
            <ul>
              ${this.arr.map((item: any) => {
                return html`<li>${item.name}</li>`
              })}

              ${repeat(this.arr, (item: any) => item.id, (item, index) => html`
                <li>${index}: ${item.name}, ${item.id}</li>
              `)}
            </ul>
          `
          :
          ''
        }
      </div>
    `
  }
}
