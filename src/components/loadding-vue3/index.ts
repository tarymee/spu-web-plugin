import { createVNode, render } from 'vue'
import loadding from './index.vue'

class Loadding {
  private count = 0

  private mountNode: HTMLDivElement | null = null

  open () {
    this.count++
    if (!this.mountNode) {
      const vm = createVNode(loadding, {
        // ...options
      })
      this.mountNode = document.createElement('div')
      render(vm, this.mountNode)
      document.body.appendChild(this.mountNode)
    }
  }

  close () {
    this.count--
    if (this.count <= 0) {
      this.count = 0
      if (this.mountNode) {
        document.body.removeChild(this.mountNode)
        this.mountNode = null
      }
    }
  }
}

// class Loadding2 {
//   constructor () {
//     this.MyVueElement = defineCustomElement({
//       // 这里是普通的 Vue 组件选项
//       // props: {},
//       // emits: {},
//       template: `
//         5436546546
//         <div class="aaa">231365135</div>
//       `,
//       styles: [`
//         .aaa {
//           display: block;
//         }
//       `]
//     })
//     this.MyVueElement = defineCustomElement(loadding)
//     customElements.define('my-vue-element', this.MyVueElement)
//   }

//   public MyVueElement
//   public count = 0

//   public mountNode: any = null

//   open () {
//     this.count++
//     if (!this.mountNode) {
//       this.mountNode = new this.MyVueElement({
//         // 初始化的 prop (可选)
//         msg: 'ssssss'
//       })
//       console.log(this.mountNode)
//       document.body.appendChild((this.mountNode as any))
//     }
//   }

//   close () {
//     this.count--
//     if (this.count <= 0) {
//       this.count = 0
//       // wx.hideLoading()
//       if (this.mountNode) {
//         document.body.removeChild(this.mountNode)
//         this.mountNode = null
//       }
//     }
//   }
// }

export default new Loadding()
