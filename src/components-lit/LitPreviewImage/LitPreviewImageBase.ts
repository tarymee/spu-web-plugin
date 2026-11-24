import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { property, state } from 'lit/decorators.js'
import LitBase from '../LitBase'
import { PhotoManger } from '../LitPhoto/PhotoManger'
import { style } from './style'

export type LitPreviewImageSource =
  | string // 直接可展示的 URL（http/https/blob/data/base64）
  | {
      source: string
      datetime: string
      storage?: StorageType
      watermark?: string
      watermarkcomposite?: 'blended' | 'attached'
      title?: string
    }

export interface LitPreviewImageOptions {
  images: LitPreviewImageSource[]
  index?: number // 默认 0，越界归 0
  type?: 'mobile' | 'web' // 不传自动判断
}

const clampNum = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export default class LitPreviewImageBase extends LitBase {
  static styles = style

  @property({ type: Array })
  images: LitPreviewImageSource[] = []

  @property({ type: Number })
  index = 0

  @state()
  protected _list: PhotoManger[] = this._reactive([])

  @state()
  protected _current = 0

  // 按索引缓存原图 src：undefined=加载中/未加载，''=加载失败
  @state()
  protected _srcMap: (string | undefined)[] = []

  // 移动端滑动/下拉的手势临时位移（web 端保持 0，不影响渲染）
  @state()
  protected _gesture = { x: 0, y: 0 }

  // 切换/回弹动画中，track 开启 transition
  @state()
  protected _animating = false

  // 动画结束后要切换到的目标索引（null 表示仅回弹）
  protected _swipeTo: number | null = null

  private _animTimer: ReturnType<typeof setTimeout> | null = null

  private _closing = false

  connectedCallback() {
    super.connectedCallback()
    this._parseImages()
    this._bindInput()
    this._loadAround()
    requestAnimationFrame(() => {
      this.setAttribute('visible', '')
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._unbindInput()
    if (this._animTimer) {
      clearTimeout(this._animTimer)
      this._animTimer = null
    }
  }

  protected _parseImages() {
    const list: PhotoManger[] = []
    ;(this.images || []).forEach((item) => {
      if (typeof item === 'string') {
        if (!item) return
        const photo = new PhotoManger({ type: 'view' })
        photo.sourceurl = item // 字符串项直接写原图 URL，bigurl getter 自然生效
        list.push(photo)
      } else if (item && item.source && item.datetime) {
        list.push(
          new PhotoManger({
            type: 'view',
            source: item.source,
            datetime: item.datetime,
            storage: item.storage,
            watermark: item.watermark,
            watermarkcomposite: item.watermarkcomposite,
            title: item.title
          })
        )
      }
    })
    this._list = this._reactive(list)
    this._srcMap = []
    this._current = clampNum(Number(this.index) || 0, 0, Math.max(0, this._list.length - 1))
  }

  // 加载并缓存某张图的原图 URL，完成后触发渲染
  protected async _ensureSrc(idx: number): Promise<string | undefined> {
    if (this._srcMap[idx] !== undefined) return this._srcMap[idx]
    const item = this._list[idx]
    await item.loadBigurl()
    if (this._srcMap[idx] !== undefined) return this._srcMap[idx] // 并发保护
    const url = item.bigurl
    const map = [...this._srcMap]
    map[idx] = url || ''
    this._srcMap = map
    return map[idx]
  }

  // 预加载当前图及左右相邻图（循环取模，不 await，完成后自动触发渲染）
  protected _loadAround() {
    const len = this._list.length
    if (!len) {
      this._close()
      return
    }
    const ids = [
      ...new Set(
        [this._current - 1, this._current, this._current + 1].map((i) => (i + len) % len)
      )
    ]
    ids.forEach((id) => this._ensureSrc(id))
  }

  protected _onImgError(idx: number) {
    const map = [...this._srcMap]
    map[idx] = ''
    this._srcMap = map
  }

  // 带滑动的循环切换：目标索引大于当前则左滑，小于则右滑
  _goTo(i: number) {
    if (this._animating) return
    const len = this._list.length
    if (!len) return
    const next = ((i % len) + len) % len // 循环：最后一张继续往下回到第一张
    if (next === this._current) return
    const w = this.clientWidth || 1
    const isNext = next === (this._current + 1) % len
    this._swipeTo = next
    this._animTo(isNext ? -w : w)
  }

  protected _close() {
    if (this._closing) return
    this._closing = true
    this.removeAttribute('visible')
    setTimeout(() => this.remove(), 220) // 与 CSS transition 时长匹配
  }

  // 遮罩层样式：下拉关闭时整体下移 + 变淡
  protected _overlayStyle() {
    return styleMap({
      transform: this._gesture.y ? `translateY(${this._gesture.y}px)` : '',
      opacity: String(Math.max(0.35, 1 - this._gesture.y / 400))
    })
  }

  protected _renderTop() {
    const len = this._list.length
    return html`
      <div class="lit-preview-top">
        <div class="lit-preview-index">${len ? `${this._current + 1}/${len}` : ''}</div>
        <div class="lit-preview-close" @click=${() => this._close()}>✕</div>
      </div>
    `
  }

  // 三张并排（prev -100% / current 0 / next +100%），track 平移手势位移实现切换滑动
  protected _renderImages() {
    const len = this._list.length
    if (!len) return html``
    const cur = this._current
    const prevIdx = (cur - 1 + len) % len
    const nextIdx = (cur + 1) % len
    const prevSrc = this._srcMap[prevIdx]
    const curSrc = this._srcMap[cur]
    const nextSrc = this._srcMap[nextIdx]
    // 占位（loading/error）放进 slide 内，随 track 一起滑动，避免遮挡切换动画
    const slide = (src: string | undefined, idx: number) => {
      if (src) return html`<img class="lit-preview-image" src=${src} @error=${() => this._onImgError(idx)} />`
      if (src === '') return html`<div class="lit-preview-error"></div>`
      return html`<div class="lit-preview-loading"></div>`
    }
    return html`
      <div
        class="lit-preview-track"
        style=${styleMap({
          transform: `translateX(${this._gesture.x}px)`,
          transition: this._animating ? 'transform 0.25s ease' : 'none'
        })}
        @transitionend=${this._onTrackTransitionEnd}
      >
        <div class="lit-preview-slide" style="transform: translateX(-100%)">
          ${slide(prevSrc, prevIdx)}
        </div>
        <div class="lit-preview-slide">${slide(curSrc, cur)}</div>
        <div class="lit-preview-slide" style="transform: translateX(100%)">
          ${slide(nextSrc, nextIdx)}
        </div>
      </div>
    `
  }

  protected _renderNav() {
    return html``
  }

  // 点击遮罩空白处关闭：body/track/slide（未点中图片/箭头）
  protected _onBodyClick(e: MouseEvent) {
    const t = e.target as HTMLElement
    if (
      t === e.currentTarget ||
      t.classList?.contains('lit-preview-track') ||
      t.classList?.contains('lit-preview-slide')
    ) {
      this._close()
    }
  }

  protected _bindInput() {}

  protected _unbindInput() {}

  // track 动画结束：回弹不切换；滑出则切换索引
  protected _onTrackTransitionEnd = () => {
    if (!this._animating) return
    this._animating = false
    if (this._animTimer) {
      clearTimeout(this._animTimer)
      this._animTimer = null
    }
    if (this._swipeTo !== null && this._swipeTo !== this._current) {
      this._current = this._swipeTo
      this._loadAround()
    }
    this._swipeTo = null
    this._gesture = { x: 0, y: 0 }
  }

  protected _animTo(to: number) {
    this._animating = true
    this._gesture = { x: to, y: 0 }
    if (this._animTimer) clearTimeout(this._animTimer)
    this._animTimer = setTimeout(() => this._onTrackTransitionEnd(), 320) // transition 兜底
  }

  render() {
    const len = this._list.length
    const current = this._current
    const title = len ? this._list[current]?.title || '' : ''
    return html`
      <div class="lit-preview" style=${this._overlayStyle()}>
        ${this._renderTop()}
        <div class="lit-preview-body" @click=${this._onBodyClick}>
          ${this._renderImages()}
          ${this._renderNav()}
        </div>
        <!-- 始终渲染占位，保证图片区域相对上下高度差恒定而真正居中 -->
        <div class="lit-preview-title ${title ? '' : 'lit-preview-title--empty'}">
          ${title || ''}
        </div>
      </div>
    `
  }
}
