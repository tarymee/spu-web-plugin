import { getAttributes } from '../common/index'
import renderTemplate from './template'
import { Step } from './step'

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


  status = {
    expandStatus: '1', // 1普通导出（没有做图片导出服务） 2服务端导出（做了图片导出服务未SPU化） 3安装了图片导出SPU
    // filetypeOptions: [
    //     {
    //         label: 'xls',
    //         value: '1'
    //     },
    //     {
    //         label: 'csv',
    //         value: '2'
    //     }
    // ],
    filewatermarkGlobalConfig: '0', // 全局文件水印开关
    exportcontentArray: ['excel', 'link', 'photo'], // 当 expandStatus = 2 | 3时才显示导出内容给用户选择
    percentage: 0,
    step: new Step(),
    resultMessage: '',
    exportId: '',
    fileSize: '',
    fileName: '',
    runningTaskCount: 0,
    isOldVersionService: false,
    shouldShowErrorTip: false
  }

  extconfigParams = {
    filetype: '1', // 导出文件类型 1: xls 2: csv 目前spu的导出只实现了xls 因此写死xls
    exportcontent: 'excel', // excel.仅导出单据，link,导出单据和本地链接，photo.导出单据和图片
    filewatermark: '0', // 1.开启文件水印，0.关闭文件水印
    iscompress: '0', // 1.压缩，0.原图
    displaytype: 'horizontal', // horizontal:横向排列 vertical:纵向排列 multi-row:分行展示
    imagetype: 'origin', // 导出图片类型 png jpg origin 默认origin
    imagename: '', // 图片命名规则
    // imagesizepercolumn 和 imageheightcm 为 图片导出SPU新增配置项
    imagesizepercolumn: '5',
    imageheightcm: '2'
  }

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

    this.shadow.querySelector('.export-file .export-file-r-download')!.addEventListener('click', () => {
      console.log('下载')
    })

    this.shadow.querySelector('.export-file .export-file-r-cancel')!.addEventListener('click', () => {
      console.log('取消')
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
