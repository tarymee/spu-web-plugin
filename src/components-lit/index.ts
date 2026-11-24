// import LitTest from './LitTest/index'
// import LitPhoto from './LitPhoto/index'
import LitPreviewImageMobile from './LitPreviewImage/LitPreviewImageMobile'
import LitPreviewImageWeb from './LitPreviewImage/LitPreviewImageWeb'
import LitAxiosLoadding from '../axios/LitAxiosLoadding' // 这个组件非通用组件 仅用于axios的loadding

const components: {
  [propName: string]: CustomElementConstructor
} = {
  // LitTest,
  // LitPhoto,
  LitPreviewImageMobile,
  LitPreviewImageWeb,
  LitAxiosLoadding
}

// 将 LitTest 转换成 lit-test CustomElement标准写法
function camelToKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

async function installLitComponents() {
  for (const x in components) {
    const name = camelToKebab(x)
    if (!window.customElements.get(name)) {
      window.customElements.define(name, components[x])
    }
  }
}

export { installLitComponents }
