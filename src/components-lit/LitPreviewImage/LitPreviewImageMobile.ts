import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import LitPreviewImageBase from './LitPreviewImageBase'

@customElement('lit-preview-image-mobile')
export default class LitPreviewImageMobile extends LitPreviewImageBase {
  protected _gestureStart = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    time: 0,
    locked: '' as '' | 'h' | 'v'
  }

  protected _bindInput() {
    this.addEventListener('touchstart', this._onTouchStart, { passive: false })
    this.addEventListener('touchmove', this._onTouchMove, { passive: false })
    this.addEventListener('touchend', this._onTouchEnd)
    this.addEventListener('touchcancel', this._onTouchEnd)
  }

  protected _unbindInput() {
    this.removeEventListener('touchstart', this._onTouchStart)
    this.removeEventListener('touchmove', this._onTouchMove)
    this.removeEventListener('touchend', this._onTouchEnd)
    this.removeEventListener('touchcancel', this._onTouchEnd)
  }

  // 顶部：无关闭按钮，序号水平居中
  protected _renderTop() {
    const len = this._list.length
    return html`
      <div class="lit-preview-top lit-preview-top--centered">
        <div class="lit-preview-index">${len ? `${this._current + 1}/${len}` : ''}</div>
      </div>
    `
  }

  private _onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    this._gestureStart = {
      x: t.clientX,
      y: t.clientY,
      lastX: t.clientX,
      lastY: t.clientY,
      time: Date.now(),
      locked: ''
    }
  }

  private _onTouchMove = (e: TouchEvent) => {
    if (this._animating) return
    const t = e.touches[0]
    if (!t) return
    const g = this._gestureStart
    const dx = t.clientX - g.lastX
    const dy = t.clientY - g.lastY
    if (!g.locked) {
      g.locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
    }
    if (g.locked === 'h') {
      e.preventDefault()
      this._gesture = { x: this._gesture.x + dx, y: 0 }
    }
    g.lastX = t.clientX
    g.lastY = t.clientY
  }

  private _onTouchEnd = () => {
    if (this._animating) return
    const len = this._list.length
    const w = this.clientWidth || 1
    const { x, y } = this._gesture
    // 点击/触摸图片或遮罩层（位移极小且时间短，且非垂直拖动）→ 关闭；与左右滑区分
    if (
      this._gestureStart.locked !== 'v' &&
      Math.abs(x) < 10 &&
      Math.abs(y) < 10 &&
      Date.now() - this._gestureStart.time < 300
    ) {
      this._close()
      return
    }
    if (len <= 1) {
      this._swipeTo = null
      this._animTo(0)
      return
    }
    if (x <= -w / 3) {
      // 左滑超过 1/3：切下一张（循环）
      this._swipeTo = (this._current + 1) % len
      this._animTo(-w)
    } else if (x >= w / 3) {
      // 右滑超过 1/3：切上一张（循环）
      this._swipeTo = (this._current - 1 + len) % len
      this._animTo(w)
    } else {
      // 未超过阈值：回弹原图
      this._swipeTo = null
      this._animTo(0)
    }
  }
}
