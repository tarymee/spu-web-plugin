import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import LitBase from '../LitBase'

// @customElement('lit-test')
export default class LitTest extends LitBase {
  static styles = css`
    :host {
      display: block;
    }
    .lit-test {
      display: block;
    }
    .lit-test-demo {
      margin: 5px 10px;
    }
  `

  @property({ type: Boolean })
  flag?: boolean = true

  // reflect: true
  @property({ type: Number })
  count: number = 0

  @property({ type: String })
  name1?: string = 'World'

  @property({ type: Object })
  classes: IAny = {
    'lit-button': true,
    someclass: true,
    anotherclass: true
  }

  @property({ type: Object })
  obj: IAny = {}

  @property({ type: Object })
  obj1: IAny = {}

  @property({ type: Array })
  arr: any[] = []

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

  @state()
  protected _arr: any[] = []

  get computedvalue() {
    return this.name1 + 'computedvalue'
  }

  constructor() {
    super()
    console.warn('constructor')
    this.print()
  }

  connectedCallback() {
    super.connectedCallback()
    console.warn('connectedCallback')
    this.print()
  }

  // 在组件的 DOM 第一次更新后调用，紧接在调用 updated() 之前
  firstUpdated() {
    console.warn('firstUpdated')
    this.print()
  }

  // 每当组件的更新完成并且元素的 DOM 已更新和呈现时调用
  updated() {
    console.warn('updated')
    this.print()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    console.warn('disconnectedCallback')
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    console.log('属性变化', name, oldValue, newValue)
  }

  print() {
    console.log('this', this)
    console.log('this.renderRoot', this.renderRoot, typeof this.renderRoot)
    console.log('this.count', this.count, typeof this.count)
    console.log('this.classes', this.classes)
    console.log('this.obj', this.obj, typeof this.obj)
    console.log('this.obj1', this.obj1, typeof this.obj1)
    console.log('this._styleObj', this._styleObj, typeof this._styleObj)
    console.log('this.flag', this.flag, typeof this.flag)
    console.log('this.arr', this.arr, typeof this.arr)
    console.log('this._arr', this._arr, typeof this._arr)
  }

  private change(e: Event) {
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

    this._arr.push({
      id: Date.now().toString()
    })

    this._active = this._active + '1'
    this._styleObj.color = this._styleObj.color === 'red' ? 'blue' : 'red'

    this._opendata.type = this._opendata.type === 'departmentName' ? 'userName' : 'departmentName'
    this._opendata.openid = this._opendata.openid === '6' ? 'woOUQJEAAATELkAo5cgbkznEdBjmtgcA' : '6'

    // 向父级发送事件
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          count: this.count,
          name1: this.name1
        }
      })
    )
  }

  private test(e: Event) {
    console.log(this)
  }

  render() {
    return html`
      <div class="lit-test">
        <button class="lit-test-demo" @click="${this.change}">change</button>
        <button class="lit-test-demo" @click="${this.print}">print</button>
        <button class="lit-test-demo" @click="${this.test}">test</button>

        <div class=${classMap(this.classes)} style=${styleMap(this._styleObj)}>
          classes: ${this.classes}
          <br />
          style: ${this._styleObj}
        </div>

        <div class="lit-test-demo">name1: ${this.name1}</div>

        <div class="lit-test-demo">count: ${this.count}</div>

        <div class="lit-test-demo">${this.flag ? html`<div>flag: true</div>` : 'flag: false'}</div>

        <div class="lit-test-demo">obj: ${JSON.stringify(this.obj)}</div>
        <div class="lit-test-demo">obj: ${this.obj}</div>
        <div class="lit-test-demo">obj1: ${this.obj1}</div>

        <div class="lit-test-demo">_active: ${this._active}</div>

        <div class="lit-test-demo">computedvalue: ${this.computedvalue}</div>

        <div class="lit-test-demo">
          arr:
          ${
            this.arr.length
              ? html`
                  <ul>
                    ${this.arr.map((item: any) => {
                      return html`<li>${item.name}</li>`
                    })}
                  </ul>
                `
              : ''
          }
        </div>

        <div class="lit-test-demo">
          _arr:${this._arr.length}
          ${
            this._arr.length
              ? html`
                  <ul>
                    ${this._arr.map((item: any) => {
                      return html`<li>${item.id}</li>`
                    })}
                  </ul>
                `
              : ''
          }
        </div>
      </div>
    `
  }
}
