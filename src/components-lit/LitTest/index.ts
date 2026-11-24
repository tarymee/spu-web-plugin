import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import LitBase from '../LitBase'

class AAA {
  id = 0
  constructor() {
    // setTimeout(() => {
    //   this.add()
    // }, 1000)
  }
  add() {
    this.id++
  }
}

export default class LitPhoto extends LitBase {
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

  // @state({
  //   hasChanged(newVal: any, oldVal: any) {
  //     console.log('newVal', newVal)
  //     console.log('oldVal', oldVal)
  //     return newVal !== oldVal
  //   }
  // })
  @state()
  protected _arr: any[] = this._reactive([])

  @state()
  protected _obj: any = this._reactive({
    id: 1,
    name: 'sss'
  })

  constructor() {
    super()
    console.warn('constructor')
    this.console()
  }

  console() {
    console.log('this', this)
    console.log('this._arr', this._arr, typeof this._arr)
    console.log('this._obj', this._obj, typeof this._obj)
  }

  private change(e: Event) {
    console.warn('change')
    // this._arr.push({
    //   id: Date.now().toString()
    // })
    // this._obj.id++
    // delete this._obj.name
    const aaa = this._reactive(new AAA())
    aaa.add()
    this._arr.push(aaa)

    setTimeout(() => {
      this._arr.length = 0
    }, 1000)
  }

  private test(e: Event) {}

  render() {
    return html`
      <div class="lit-test">
        <button class="lit-test-demo" @click="${this.change}">change</button>
        <button class="lit-test-demo" @click="${this.console}">console</button>
        <button class="lit-test-demo" @click="${this.test}">test</button>

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
        <div class="lit-test-demo">
          _obj:${this._obj}
          <br />
          _obj.id:${this._obj.id}
          <br />
          _obj.name:${this._obj.name}
          <br />
        </div>
      </div>
    `
  }
}
