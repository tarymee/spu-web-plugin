import SpuCustomervisitSkip from './SpuCustomervisitSkip/index'

const components: {
  [propName: string]: CustomElementConstructor
} = {
  SpuCustomervisitSkip
}

// 将 LitTest 转换成 lit-test CustomElement标准写法
function camelToKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

async function installSpuComponents() {
  for (const x in components) {
    const name = camelToKebab(x)
    if (!window.customElements.get(name)) {
      window.customElements.define(name, components[x])
    }
  }
}

export { installSpuComponents }
