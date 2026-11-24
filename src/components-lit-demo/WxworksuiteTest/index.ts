import { LitElement, css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

// @customElement('wxworksuite-test')
export default class WxworksuiteTest extends LitElement {

  static componentName: string = 'wxworksuite-test'
  static register () {
    if (!window.customElements.get(WxworksuiteTest.componentName)) {
      window.customElements.define(WxworksuiteTest.componentName, WxworksuiteTest)
    }
  }

  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      display: block
    }
    .demo {
      margin: 5px 10px;
    }
  `

  @property({
    type: Boolean
  })
  flag: boolean = true

  // reflect: true
  @property({ type: Number })
  count: number = 0

  @property({ type: String })
  name1?: string = 'World'

  @property({ type: Object })
  classes?: any = {
    'lit-button': true,
    'someclass': true,
    'anotherclass': true
  }

  @property({ type: Object })
  obj?: any = {}

  @property({ type: Array })
  arr?: any = []

  // // 还是会基于属性传递
  // @property({ attribute: false, state: true })
  // _active = '内部属性值'

  // // 还是会基于属性传递 定义一个内部属性
  // @state()
  // protected _active = '内部属性值'

  // 还是会基于属性传递
  protected _active = '内部属性值'

  // 还是会基于属性传递
  _styleObj = {
    color: 'blue'
  }

  @state()
  protected _opendata: any = {
    type: 'userName',
    openid: 'woOUQJEAAATELkAo5cgbkznEdBjmtgcA'
  }

  get computedvalue () {
    return this.name1 + 'computedvalue'
  }

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
    console.log('this.renderRoot', this.renderRoot)
    console.log('this.count', this.count, typeof this.count)
    console.log('this.classes', this.classes)
    console.log('this.obj', this.obj)
    console.log('this._styleObj', this._styleObj)
    console.log('this.flag', this.flag, typeof this.flag)
    console.log('this.arr', this.arr, typeof this.arr)
  }

  private change (e: Event) {
    console.warn('change')
    this.print()

    this.count++
    this.name1 = this.name1 + '1'
    this.classes.xxx = true
    this.obj.cccc = 'dd45'
    this.flag = !this.flag
    this.arr.push({
      id: Date.now().toString(),
      name: 'ssss'
    })


    this._active = this._active + '1'
    this._styleObj.color = this._styleObj.color === 'red' ? 'blue' : 'red'

    this._opendata.type = this._opendata.type === 'departmentName' ? 'userName' : 'departmentName'
    this._opendata.openid = this._opendata.openid === '6' ? 'woOUQJEAAATELkAo5cgbkznEdBjmtgcA' : '6'

    // 向父级发送事件
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        count: this.count,
        name1: this.name1
      }
    }))
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

      <div class=${classMap(this.classes)} style=${styleMap(this._styleObj)}>
        classes: ${this.classes}
        <br />
        style: ${this._styleObj}
      </div>

      <div class="demo">
        name1: ${this.name1}
      </div>

      <div class="demo">
        count: ${this.count}
      </div>

      <div class="demo">
        ${ this.flag ? html`<div>flag: true</div>` : 'flag: false' }
      </div>

      <div class="demo">
        obj: ${JSON.stringify(this.obj)}
      </div>

      <div class="demo">
        _active: ${this._active}
      </div>

      <div class="demo">
        wxworksuite-opendata: <br />
        <wxworksuite-opendata ref="wxworksuiteopendataRef" type="${this._opendata.type}" openid="${this._opendata.openid}"></wxworksuite-opendata>
      </div>

      <div class="demo">
        computedvalue: ${this.computedvalue}
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
            </ul>
          `
          :
          ''
        }
      </div>
    `
  }
}

// window.customElements.define('wxworksuite-test', WxworksuiteTest)
