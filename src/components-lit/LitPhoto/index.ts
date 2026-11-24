import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { repeat } from 'lit/directives/repeat.js'
import LitBase from '../LitBase'
import { PhotoManger, IPhotoItem, IPhotoValue } from './PhotoManger'
import { style } from './style'

export default class LitPhoto extends LitBase {
  static styles = style

  @property({ type: Boolean })
  required = ''

  @property({ type: String })
  title = ''

  @property({ type: Array })
  defaultvalue = []

  // 拍摄位定义
  // 定义拍摄位（标识/名称/是否必拍），不配置时为自由拍照模式
  @property({ type: Array })
  slots: {
    code: string
    required: '1' | '0'
    title: string
  }[] = [
    // {
    //   code: '正面',
    //   required: '1',
    //   title: '正面'
    // },
    // {
    //   code: '背面',
    //   required: '1',
    //   title: '背面'
    // }
  ]
  // 照片来源：
  // 0 默认值，从相机获取
  // 1 从相册获取
  // 2 从相机或相册获取
  @property({ type: String })
  source: '0' | '1' | '2' = '0'

  // 前端Compressor.js压缩参数 https://www.npmjs.com/package/compressorjs
  // 0 2.12MB 114.61 KB 94.72% -
  // 0.2 2.12MB 349.57 KB 83.90% -
  // 0.4 2.12MB 517.10 KB 76.18% -
  // 0.6 2.12MB 694.99 KB 67.99% Recommend
  // 0.8 2.12MB 1.14 MB 46.41% Recommend
  // 1   2.12MB 2.12 MB 0% Not recommend 原图
  @property({ type: String })
  compression = '1'

  @property({ type: String })
  watermark = '{date}'

  // 水印合成方式
  // blended: 水印直接合成在原始图片上 默认值
  // attached: 水印存储在照片的值当中，需要在显示的时候临时合成
  @property({ type: String })
  watermarkcomposite: 'blended' | 'attached' = 'blended'

  // 最大拍摄张数
  @property({ type: String })
  maxnumber = '' // '' 表示无限制

  // 最小拍摄张数
  @property({ type: String })
  minnumber = '0'

  // AI 模糊检测 '0' 关闭 '1' 警告 '2' 强制
  // 请确保租户已经开通了该 AI 检测接口
  // 关闭 不检测
  // 警告 控件角标显示提示，不阻止提交表单
  // 强制 控件角标显示提示，并且阻止提交表单
  @property({ type: String })
  blurcheck: '0' | '1' | '2' = '0'

  // AI 翻拍检测 规则与 blurcheck 相同
  @property({ type: String })
  fakecheck: '0' | '1' | '2' = '0'

  // 缩略图尺寸设置 默认为 200。设置为 200 时，从阿里云请求缩略图尺寸为 200×200，具体返回尺寸以阿里云为准
  @property({ type: String })
  thumbnailsize = '200'

  // 缩略图尺寸样式
  @property({ type: String })
  thumbnailwidth = '72px'

  @property({ type: String })
  thumbnailheight = '72px'

  @property({ type: String })
  thumbnailmargin = '8px'

  @property({ type: Boolean })
  islocation = true // 上传图片后生成图片信息时是否携带定位信息

  @property({ type: Boolean })
  ispreview = true // 是否开启预览大图

  @state()
  protected _list: PhotoManger[] = this._reactive([])

  // 拍摄位/自由拍照
  get _isslots(): boolean {
    return this.slots?.length ? true : false
  }

  get _isAIckeck(): boolean {
    return this.blurcheck !== '0' || this.fakecheck !== '0'
  }

  get _maxnumber(): number {
    let number = 9999
    if (this.slots?.length) {
      number = this.slots.length
    } else {
      if (this.maxnumber) {
        number = Number(this.maxnumber)
      }
    }
    return number
  }

  get _minnumber(): number {
    let number = 0
    if (this.minnumber && !this._isslots) {
      number = Number(this.minnumber)
    }
    return number
  }

  // constructor() {
  //   super()
  //   console.warn('constructor')
  // }

  connectedCallback() {
    super.connectedCallback()
    // console.warn('connectedCallback')

    if (this.slots?.length) {
      if (this.defaultvalue?.length) {
        this.setValue(this.defaultvalue, false)
      } else {
        this._list.push(
          ...this.slots.map((item) => {
            return this._reactive(new PhotoManger(this._createParam('add')))
          })
        )
      }
    } else {
      if (this.defaultvalue?.length) {
        this.setValue(this.defaultvalue, false)
      }
    }
  }

  // // 在组件的 DOM 第一次更新后调用，紧接在调用 updated() 之前
  // firstUpdated() {
  //   console.warn('firstUpdated')
  // }

  // // 每当组件的更新完成并且元素的 DOM 已更新和呈现时调用
  // updated() {
  //   console.warn('updated')
  // }

  // disconnectedCallback() {
  //   super.disconnectedCallback()
  //   console.warn('disconnectedCallback')
  // }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    console.log('属性变化', name, oldValue, newValue)
  }

  async _handleInputFileChange(e: any, index?: number) {
    console.log('_handleInputFileChange')
    const files: File[] = [...(e.target?.files || [])]
    // console.log(e)
    // console.log(e.target.files)
    // console.log(files)
    // debugger
    // 取得file之后清空input框的值 避免下次选择相同图片时不触发valuechange
    if (e.target?.value) {
      e.target.value = ''
    }
    if (!files.length) return

    const file = files[0]

    if (this._isslots) {
      const photoInstace = this._list[index as number]
      photoInstace.setFile(file)
      this._emit('onuploadbefore')
      await photoInstace.upload()
      this._emit('onvaluechange')
    } else {
      // if (this._list.length >= this._maxnumber) {
      //   window.alert('当前选择已经超过最大可选张数!')
      //   return
      // }

      const photoInstace = this._reactive(
        new PhotoManger(
          this._createParam('add', {
            file: file
          })
        )
      )
      // console.log(photoInstace)
      this._list.push(photoInstace)
      this._emit('onuploadbefore')
      await photoInstace.upload()
      this._emit('onvaluechange')
    }
  }

  _handleDel(item: PhotoManger, index: number) {
    console.log('_handleDel', item, index)
    if (this._isslots) {
      this._list.splice(index, 1, this._reactive(new PhotoManger(this._createParam('add'))))
    } else {
      // debugger
      this._list.splice(index, 1)
    }
    this._emit('onvaluechange')
  }

  async _handleClick(item: PhotoManger, index: number) {
    console.log('_handleClick', item, index)
    console.log(this.ispreview)
    if (this.ispreview) {
      const bigurls = []
      for (let i = 0, len = this._list.length; i < len; i++) {
        const item = this._list[i]
        // console.log(item)
        await item.loadBigurl()
        bigurls.push(item.bigurl)
      }
      console.log(bigurls, index)
      // if (window?.Module?.previewImage) {
      //   window.Module.previewImage(bigurls, index)
      // } else {
      //   previewImages(bigurls, index)
      //   showImagePreview(bigurls, index)
      // }
    } else {
      this._emit('onclicked', {
        value: this._list[index].getValue(),
        index
      })
    }
  }

  _createParam(type: 'add' | 'view', item?: IAny): IPhotoItem {
    if (type === 'add') {
      return {
        type: type,
        file: item?.file || '',
        title: this.title || '',
        compression: this.compression,
        watermark: this.watermark,
        watermarkcomposite: this.watermarkcomposite,
        thumbnailsize: this.thumbnailsize,
        islocation: this.islocation,
        blurcheck: this.blurcheck,
        fakecheck: this.fakecheck
      }
    } else {
      return {
        type: type,
        compression: this.compression,
        watermark: this.watermark,
        watermarkcomposite: this.watermarkcomposite,
        thumbnailsize: this.thumbnailsize,
        blurcheck: this.blurcheck,
        fakecheck: this.fakecheck,
        // 兼容图片未拍为空字符串的情况
        ...(item || {})
      }
    }
  }

  getValue() {
    // console.log(this._list)
    return this._list.map((item) => {
      return item.getValue()
    })
  }

  async setValue(value: IPhotoValue[], isemit = true) {
    this._list.length = 0
    if (value.length) {
      this._list.push(
        ...value.map((item) => {
          return this._reactive(new PhotoManger(this._createParam('view', item)))
        })
      )
      this._list.forEach((item) => {
        item.loadShowurl()
      })
    }
    if (isemit) {
      this._emit('onvaluechange')
    }
  }

  validata() {
    let msg = ''
    const value = this.getValue()
    // 剔除未上传的
    const valuein = value.filter((item) => item !== '')

    if (this.required && !valuein.length) {
      msg = `图片未拍摄/未上传，请至少拍摄/上传一张图片`
    }

    if (!msg) {
      if (valuein.length < this._minnumber) {
        msg = `图片张数小于最小拍摄张数：${this._minnumber}`
      }
    }

    if (!msg && this._isslots) {
      const slots = this.slots
      for (let i = 0, len = slots.length; i < len; i++) {
        if (slots[i].required === '1' && value[i] === '') {
          msg = `第${i + 1}张图片${slots[i].code}为必填，未拍摄/未上传`
          break
        }
      }
    }

    if (!msg) {
      for (let i = 0, len = this._list.length; i < len; i++) {
        const item = this._list[i]
        const onemsg = item.validata().msg
        if (onemsg) {
          msg = `第${i + 1}张${onemsg}`
          break
        }
      }
    }

    return { msg }
  }

  private test(e?: Event) {
    console.warn('test', e)
    console.log(this)
    console.log(this._list)
  }

  // <div class="lit-photo"><button @click="${this.test}">lit-photo-test</button></div>
  render() {
    return html`
      <div class="lit-photo">
        ${
          this._list.length
            ? html`
                ${this._list.map((item: any, index: number) => {
                  return html`
                    ${
                      this._isslots && !item.file && item.uploadstate === '-1' && !this.disabled
                        ? html`
                            <div
                              class="lit-photo-upload-wrap"
                              style=${styleMap({
                                width: this.thumbnailwidth,
                                marginRight: this.thumbnailmargin,
                                marginBottom: this.thumbnailmargin
                              })}
                            >
                              <div
                                class="lit-photo-upload"
                                style=${styleMap({
                                  width: this.thumbnailwidth,
                                  height: this.thumbnailheight
                                })}
                              >
                                <div class="lit-photo-upload-icon"></div>
                                <input
                                  type="file"
                                  class="lit-photo-upload-input"
                                  accept="image/*"
                                  capture="${this.source === '0' ? 'environment' : undefined}"
                                  .disabled=${this.disabled}
                                  @change="${(e: Event) => this._handleInputFileChange(e, index)}"
                                />
                              </div>
                              <div class="lit-photo-item-title">
                                ${
                                  this.slots[index].required === '1'
                                    ? html`<span style="color: red">*</span>`
                                    : ''
                                }
                                ${this.slots[index].code}
                              </div>
                            </div>
                          `
                        : html`
                            <div
                              class="lit-photo-item-wrap"
                              style=${styleMap({
                                width: this.thumbnailwidth,
                                marginRight: this.thumbnailmargin,
                                marginBottom: this.thumbnailmargin
                              })}
                            >
                              <div
                                class="lit-photo-item"
                                style=${styleMap({
                                  width: this.thumbnailwidth,
                                  height: this.thumbnailheight
                                })}
                              >
                                ${
                                  item.showurl
                                    ? html`<img
                                        class="lit-photo-item-image"
                                        src="${item.showurl}"
                                        @click="${(e: Event) => this._handleClick(item, index)}"
                                      />`
                                    : this._isslots && item.uploadstate === '-1'
                                      ? html`<div class="lit-photo-item-none">未拍摄</div>`
                                      : html`<div class="lit-photo-item-error"></div>`
                                }
                                ${
                                  item.uploadstate === '3'
                                    ? html`<div class="lit-photo-item-msg">上传失败</div>`
                                    : item.uploadstate === '1'
                                      ? html`<div class="lit-photo-item-msg">上传中</div>`
                                      : item.blurcheck !== '0' && item.blurstate === '1'
                                        ? html`<div class="lit-photo-item-msg">检测中</div>`
                                        : item.blurcheck !== '0' && item.fakestate === '1'
                                          ? html`<div class="lit-photo-item-msg">检测中</div>`
                                          : item.blurcheck !== '0' && item.isblur === '0'
                                            ? html`<div
                                                class="lit-photo-item-msg"
                                                style="color:#E16F24"
                                              >
                                                检测失败
                                              </div>`
                                            : item.fakecheck !== '0' && item.isfake === '0'
                                              ? html`<div
                                                  class="lit-photo-item-msg"
                                                  style="color:#F43F4F"
                                                >
                                                  检测失败
                                                </div>`
                                              : ''
                                }
                                ${
                                  !this.disabled
                                    ? html`<div
                                        class="lit-photo-item-delete"
                                        @click="${(e: Event) => this._handleDel(item, index)}"
                                        style=${styleMap({
                                          borderRadius: item.tagdata.length ? '0' : '0 0 0 8px'
                                        })}
                                      >
                                        ×
                                      </div>`
                                    : ''
                                }
                                ${
                                  item.tagdata.length
                                    ? html`<div
                                        class="lit-photo-item-tags"
                                        style=${styleMap({
                                          right: !this.disabled ? '24px' : '0'
                                        })}
                                      >
                                        ${item.tagdata.map((tagitem: any) => {
                                          return html`
                                            <div
                                              class="lit-photo-item-tags-item"
                                              style=${styleMap({
                                                color: tagitem.color
                                              })}
                                            >
                                              ${tagitem.text}
                                            </div>
                                          `
                                        })}
                                      </div>`
                                    : ''
                                }
                              </div>
                              ${
                                this._isslots
                                  ? html`<div class="lit-photo-item-title">
                                      ${
                                        this.slots[index].required === '1'
                                          ? html`<span style="color: red">*</span>`
                                          : ''
                                      }
                                      ${this.slots[index].code}
                                    </div>`
                                  : ''
                              }
                            </div>
                          `
                    }
                  `
                })}
              `
            : ''
        }
        ${
          !this.disabled && !this._isslots && this._list.length < this._maxnumber
            ? html`<div
                class="lit-photo-upload-wrap"
                style=${styleMap({
                  marginRight: this.thumbnailmargin,
                  marginBottom: this.thumbnailmargin
                })}
              >
                <div
                  class="lit-photo-upload"
                  style=${styleMap({
                    width: this.thumbnailwidth,
                    height: this.thumbnailheight
                  })}
                >
                  <div class="lit-photo-upload-icon"></div>
                  <input
                    type="file"
                    class="lit-photo-upload-input"
                    accept="image/*"
                    capture="${this.source === '0' ? 'environment' : undefined}"
                    .disabled=${this.disabled}
                    @change="${(e: Event) => this._handleInputFileChange(e)}"
                  />
                </div>
              </div>`
            : ''
        }
      </div>
    `
  }
}
