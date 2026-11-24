import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

const ARRAY_MUTATORS = new Set([
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
  'fill',
  'copyWithin'
])

// 已代理对象缓存：保证同一对象只代理一次（幂等，防止嵌套代理），类似 Vue3 的 reactiveMap
const reactiveCache = new WeakMap<object, unknown>()

export default class LitBase extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .lit-Base {
      display: block;
    }
  `
  @property({ type: Boolean })
  disabled: boolean = false

  constructor() {
    super()
  }

  // 向父级发送事件
  _emit(type: string, detail: any = {}) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: detail
      })
    )
  }

  _reactive<T extends object>(proxytarget: T): T {
    const cached = reactiveCache.get(proxytarget)
    if (cached) return cached as T

    const proxy = new Proxy(proxytarget, {
      get: (target, prop, receiver) => {
        // console.log('get', target, prop, receiver)
        // return Reflect.get(target, prop, receiver)

        const value = Reflect.get(target, prop, receiver)
        if (
          Array.isArray(target) &&
          typeof value === 'function' &&
          ARRAY_MUTATORS.has(prop as string)
        ) {
          return (...args: any[]) => {
            const result = Reflect.apply(value, target, args)
            // console.log('数组方法 触发')
            this.requestUpdate()
            return result
          }
        }
        return value
        // // 惰性递归代理：访问到实例/嵌套对象时自动包装
        // return value && typeof value === 'object' ? _reactive(value) : value
      },
      set: (target, prop, value, receiver) => {
        // console.log('set 触发')
        this.requestUpdate()
        // console.log('set', target, prop, value, receiver)
        // console.log(target === proxytarget)
        // console.log(receiver === proxy)
        // target[prop] = value
        // return true
        return Reflect.set(target, prop, value, receiver)
      },
      deleteProperty: (target, prop) => {
        // console.log('deleteProperty', target, prop)
        // console.log('deleteProperty 触发')
        this.requestUpdate()
        return Reflect.deleteProperty(target, prop)
      }
    })

    reactiveCache.set(proxytarget, proxy)
    return proxy
  }

  render() {
    return html` <div class="lit-base"></div> `
  }
}
