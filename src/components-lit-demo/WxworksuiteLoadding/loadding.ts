import WxworksuiteLoadding from './index'

class Loadding {
  count = 0

  ele: null | HTMLElement = null

  constructor () {
    WxworksuiteLoadding.register()
  }

  open () {
    this.count++
    if (!this.ele) {
      this.ele = document.createElement('wxworksuite-loadding')
      // console.log(this.ele)
      document.body.appendChild(this.ele)
    }
  }

  close () {
    this.count--
    if (this.count <= 0) {
      this.count = 0
      if (this.ele) {
        document.body.removeChild(this.ele)
        this.ele = null
      }
    }
  }
}

const loadding = new Loadding()

export {
  loadding
}
