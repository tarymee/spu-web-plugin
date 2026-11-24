# LitPreviewImage 图片预览功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现函数式调用的图片预览功能 `litPreviewImage({ image, index, type })`，包含 `LitPreviewImageMobile` 与 `LitPreviewImageWeb` 两个 Lit 组件（共享基类），支持 URL 字符串与存储对象两种图片输入、半透明遮罩、缩放/滑动/键盘交互、title 显示与 attached 水印 canvas 合成。

**Architecture:** 参照现有 `src/components-lit/LitPhoto` 模式：`LitPreviewImageBase extends LitBase` 承载图片解析（复用 `PhotoManger`）、原图加载、缩放状态、渲染框架与关闭逻辑；`LitPreviewImageMobile`（touch 手势）与 `LitPreviewImageWeb`（键盘/滚轮/鼠标）继承基类只做布局与输入差异。`index.ts` 导出 `litPreviewImage()` 函数，从插件入口导出并注册为自定义元素。

**Tech Stack:** Lit 3（@property/@state 装饰器、styleMap、@customElement）、PhotoManger（`src/components-lit/LitPhoto/PhotoManger`）、downloadService（`src/oss`）、Vue 3（仅 demo.vue）。

**提交说明：** 按项目约定，所有 git 提交由用户手动完成，本计划不包含自动提交步骤。每个任务完成后以 `npm run build` 验证（rollup 内 typescript 插件会做类型检查）。

---

### Task 1: 共享样式 `style.ts`

**Files:**
- Create: `src/components-lit/LitPreviewImage/style.ts`

- [ ] **Step 1: 创建共享样式文件**

```ts
import { css, unsafeCSS } from 'lit'
import imageCrash from '../LitPhoto/assets/image-crash.png'

const style = css`
  :host {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    background: rgba(10, 10, 10, 0.55);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
  }
  .lit-preview-top {
    height: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    color: #fff;
  }
  .lit-preview-index {
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }
  .lit-preview-close {
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
    border-radius: 50%;
  }
  .lit-preview-close:active {
    background: rgba(255, 255, 255, 0.2);
  }
  .lit-preview-body {
    flex: 1;
    min-height: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .lit-preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    cursor: zoom-in;
  }
  .lit-preview-loading,
  .lit-preview-error {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lit-preview-loading {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
  .lit-preview-loading::before {
    content: '';
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lit-preview-spin 0.8s linear infinite;
  }
  @keyframes lit-preview-spin {
    to {
      transform: rotate(360deg);
    }
  }
  .lit-preview-error {
    background-color: rgba(255, 255, 255, 0.12);
    background-image: url(${unsafeCSS(imageCrash)});
    background-size: 48px 38px;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .lit-preview-title {
    flex: none;
    min-height: 44px;
    box-sizing: border-box;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    text-align: center;
    background: rgba(0, 0, 0, 0.25);
  }
  .lit-preview-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.18);
  }
  .lit-preview-arrow:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  .lit-preview-arrow--left {
    left: 16px;
  }
  .lit-preview-arrow--right {
    right: 16px;
  }
`

export { style }
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功，无 TS 错误（此时尚未引用该文件，主要确认 rollup 的 image 插件能解析 `../LitPhoto/assets/image-crash.png`，可临时在 base 引入后验证）。

---

### Task 2: 共享基类 `LitPreviewImageBase`

**Files:**
- Create: `src/components-lit/LitPreviewImage/LitPreviewImageBase.ts`

- [ ] **Step 1: 创建基类**

```ts
import { html, styleMap } from 'lit'
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
  image: LitPreviewImageSource[]
  index?: number // 默认 0，越界归 0
  type?: 'mobile' | 'web' // 不传自动判断
}

const clampNum = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export default class LitPreviewImageBase extends LitBase {
  static styles = style

  @property({ type: Array })
  image: LitPreviewImageSource[] = []

  @property({ type: Number })
  index = 0

  @state()
  protected _list: PhotoManger[] = this._reactive([])

  @state()
  protected _current = 0

  @state()
  protected _loading = true

  @state()
  protected _error = false

  @state()
  protected _src = ''

  // 缩放/平移状态
  @state()
  protected _zoom = { scale: 1, x: 0, y: 0 }

  // 移动端滑动/下拉的手势临时位移（web 端保持 0，不影响渲染）
  @state()
  protected _gesture = { x: 0, y: 0 }

  private _loadToken = 0

  connectedCallback() {
    super.connectedCallback()
    this._parseImages()
    this._bindInput()
    this._loadCurrent()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._unbindInput()
  }

  protected _parseImages() {
    const list: PhotoManger[] = []
    ;(this.image || []).forEach((item) => {
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
    this._current = clampNum(Number(this.index) || 0, 0, Math.max(0, this._list.length - 1))
  }

  async _loadCurrent() {
    if (!this._list.length) {
      this._close()
      return
    }
    const token = ++this._loadToken
    this._loading = true
    this._error = false
    const item = this._list[this._current]
    await item.loadBigurl()
    if (token !== this._loadToken) return // 已被更新的切换打断
    const url = item.bigurl
    if (url) {
      this._src = url
    } else {
      this._error = true
    }
    this._loading = false
  }

  protected _onImgError() {
    this._error = true
    this._loading = false
  }

  _goTo(i: number) {
    if (!this._list.length) return
    const next = clampNum(i, 0, this._list.length - 1)
    if (next === this._current) return
    this._current = next
    this._resetZoom()
    this._gesture = { x: 0, y: 0 }
    this._loadCurrent()
  }

  protected _resetZoom() {
    this._zoom = { scale: 1, x: 0, y: 0 }
  }

  protected _setZoom(scale: number) {
    this._zoom = { ...this._zoom, scale: clampNum(scale, 1, 4) }
  }

  protected _toggleZoom() {
    if (this._zoom.scale > 1) this._resetZoom()
    else this._setZoom(2)
  }

  protected _close() {
    this.remove()
  }

  // 遮罩层样式：下拉关闭时整体下移 + 变淡
  protected _overlayStyle() {
    return styleMap({
      transform: this._gesture.y ? `translateY(${this._gesture.y}px)` : '',
      opacity: String(Math.max(0.35, 1 - this._gesture.y / 400))
    })
  }

  // 图片区样式：滑动位移 + 缩放/平移
  protected _bodyStyle() {
    const { scale, x, y } = this._zoom
    return styleMap({
      transform: `translate(${this._gesture.x + x}px, ${y}px) scale(${scale})`
    })
  }

  protected _renderNav() {
    return html``
  }

  // 点击遮罩空白处关闭（web 端覆盖此方法；移动端通过 ✕/下拉关闭）
  protected _onBodyClick(e: MouseEvent) {}

  protected _bindInput() {}

  protected _unbindInput() {}

  render() {
    const len = this._list.length
    const current = this._current
    const title = len ? this._list[current]?.title || '' : ''
    return html`
      <div class="lit-preview" style=${this._overlayStyle()}>
        <div class="lit-preview-top">
          <div class="lit-preview-index">${len ? `${current + 1}/${len}` : ''}</div>
          <div class="lit-preview-close" @click=${() => this._close()}>✕</div>
        </div>
        <div class="lit-preview-body" style=${this._bodyStyle()} @click=${this._onBodyClick}>
          ${this._loading ? html`<div class="lit-preview-loading"></div>` : ''}
          ${this._src && !this._error
            ? html`<img
                class="lit-preview-image"
                src=${this._src}
                @error=${this._onImgError}
              />`
            : ''}
          ${this._error ? html`<div class="lit-preview-error"></div>` : ''}
          ${this._renderNav()}
        </div>
        ${title ? html`<div class="lit-preview-title">${title}</div>` : ''}
      </div>
    `
  }
}
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功。若 `storage` 类型报错，确认 `StorageType` 由 `src/types/global.d.ts` 全局声明（该文件无 import/export，为全局 ambient 声明）。

---

### Task 3: 移动端组件 `LitPreviewImageMobile`

**Files:**
- Create: `src/components-lit/LitPreviewImage/LitPreviewImageMobile.ts`

- [ ] **Step 1: 创建移动端组件**

```ts
import { css } from 'lit'
import { customElement } from 'lit/decorators.js'
import LitPreviewImageBase from './LitPreviewImageBase'

// 移动端图片宽度占满屏宽
const mobileStyle = css`
  .lit-preview-image {
    width: 100%;
    height: 100%;
  }
`

@customElement('lit-preview-image-mobile')
export default class LitPreviewImageMobile extends LitPreviewImageBase {
  static styles = [super.styles, mobileStyle]

  protected _gestureStart = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    fingers: 0,
    pinchDist: 0,
    startScale: 1
  }

  private _lastTap = 0

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

  private _onTouchStart = (e: TouchEvent) => {
    const t = e.touches
    const g = this._gestureStart
    g.fingers = t.length
    if (t.length === 1) {
      g.x = t[0].clientX
      g.y = t[0].clientY
      g.lastX = t[0].clientX
      g.lastY = t[0].clientY
    } else if (t.length === 2) {
      g.pinchDist = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
      g.startScale = this._zoom.scale
    }
  }

  private _onTouchMove = (e: TouchEvent) => {
    const t = e.touches
    const g = this._gestureStart
    if (t.length === 2) {
      e.preventDefault()
      const dist = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
      if (g.pinchDist) {
        this._setZoom((g.startScale * dist) / g.pinchDist)
      }
      g.lastX = (t[0].clientX + t[1].clientX) / 2
      g.lastY = (t[0].clientY + t[1].clientY) / 2
      return
    }
    if (t.length === 1) {
      const x = t[0].clientX
      const y = t[0].clientY
      if (this._zoom.scale > 1) {
        e.preventDefault()
        this._zoom = {
          ...this._zoom,
          x: this._zoom.x + (x - g.lastX),
          y: this._zoom.y + (y - g.lastY)
        }
      } else {
        this._gesture = { x: x - g.x, y: Math.max(0, y - g.y) }
      }
      g.lastX = x
      g.lastY = y
      this.requestUpdate()
    }
  }

  private _onTouchEnd = (e: TouchEvent) => {
    const g = this._gestureStart
    if (this._zoom.scale <= 1) {
      const { x, y } = this._gesture
      if (y > 120) {
        this._close() // 下拉关闭
        return
      }
      if (Math.abs(x) > Math.min(80, this.clientWidth * 0.25)) {
        this._goTo(this._current + (x < 0 ? 1 : -1)) // 左右滑动切换
        return
      }
      this._gesture = { x: 0, y: 0 }
      // 双击缩放：位移很小且在 300ms 内的第二次点击
      const now = Date.now()
      if (Math.abs(x) < 10 && Math.abs(y) < 10 && now - this._lastTap < 300) {
        this._toggleZoom()
      }
      this._lastTap = now
    } else if (g.fingers === 2) {
      if (this._zoom.scale < 1.15) this._resetZoom() // 双指微缩回弹
    }
    g.fingers = 0
    this.requestUpdate()
  }
}
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功，无 TS 错误。

---

### Task 4: Web 端组件 `LitPreviewImageWeb`

**Files:**
- Create: `src/components-lit/LitPreviewImage/LitPreviewImageWeb.ts`

- [ ] **Step 1: 创建 Web 端组件**

```ts
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import LitPreviewImageBase from './LitPreviewImageBase'

@customElement('lit-preview-image-web')
export default class LitPreviewImageWeb extends LitPreviewImageBase {
  protected _drag: { x: number; y: number; px: number; py: number } | null = null

  protected _bindInput() {
    window.addEventListener('keydown', this._onKeydown)
    this.addEventListener('wheel', this._onWheel, { passive: false })
    this.addEventListener('dblclick', this._onDblclick)
    this.addEventListener('mousedown', this._onMouseDown)
    this.addEventListener('mousemove', this._onMouseMove)
    this.addEventListener('mouseup', this._onMouseUp)
  }

  protected _unbindInput() {
    window.removeEventListener('keydown', this._onKeydown)
    this.removeEventListener('wheel', this._onWheel)
    this.removeEventListener('dblclick', this._onDblclick)
    this.removeEventListener('mousedown', this._onMouseDown)
    this.removeEventListener('mousemove', this._onMouseMove)
    this.removeEventListener('mouseup', this._onMouseUp)
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._close()
    else if (e.key === 'ArrowLeft') this._goTo(this._current - 1)
    else if (e.key === 'ArrowRight') this._goTo(this._current + 1)
  }

  private _onWheel = (e: WheelEvent) => {
    e.preventDefault() // 阻止底层页面滚动
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    this._setZoom(this._zoom.scale * factor)
  }

  private _onDblclick = (e: MouseEvent) => {
    e.preventDefault()
    this._toggleZoom()
  }

  private _onMouseDown = (e: MouseEvent) => {
    if (this._zoom.scale > 1) {
      this._drag = { x: this._zoom.x, y: this._zoom.y, px: e.clientX, py: e.clientY }
    }
  }

  private _onMouseMove = (e: MouseEvent) => {
    if (this._drag) {
      this._zoom = {
        ...this._zoom,
        x: this._drag.x + (e.clientX - this._drag.px),
        y: this._drag.y + (e.clientY - this._drag.py)
      }
    }
  }

  private _onMouseUp = () => {
    this._drag = null
  }

  // 点击遮罩空白处关闭（目标为 body 容器本身时）
  protected _onBodyClick(e: MouseEvent) {
    if (e.target === e.currentTarget) this._close()
  }

  protected _renderNav() {
    const len = this._list.length
    if (len <= 1) return html``
    return html`
      <div
        class="lit-preview-arrow lit-preview-arrow--left"
        @click=${(e: Event) => {
          e.stopPropagation()
          this._goTo(this._current - 1)
        }}
      >
        ‹
      </div>
      <div
        class="lit-preview-arrow lit-preview-arrow--right"
        @click=${(e: Event) => {
          e.stopPropagation()
          this._goTo(this._current + 1)
        }}
      >
        ›
      </div>
    `
  }
}
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功，无 TS 错误。

---

### Task 5: 函数入口 `index.ts`

**Files:**
- Create: `src/components-lit/LitPreviewImage/index.ts`

- [ ] **Step 1: 创建函数入口**

```ts
import LitPreviewImageMobile from './LitPreviewImageMobile'
import LitPreviewImageWeb from './LitPreviewImageWeb'
import type { LitPreviewImageOptions } from './LitPreviewImageBase'

function detectType(): 'mobile' | 'web' {
  const ua = navigator.userAgent
  const isMobileUA = /Mobile|Android|iPhone|iPod|iPad|Windows Phone/i.test(ua)
  const isTouchOrNarrow =
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  return isMobileUA || isTouchOrNarrow ? 'mobile' : 'web'
}

function litPreviewImage(opts: LitPreviewImageOptions) {
  const type = opts.type || detectType()
  const Comp = type === 'mobile' ? LitPreviewImageMobile : LitPreviewImageWeb
  const el = new Comp()
  el.image = opts.image
  el.index = opts.index || 0
  document.body.appendChild(el) // 关闭时组件自移除
}

export { litPreviewImage, LitPreviewImageMobile, LitPreviewImageWeb }
export type { LitPreviewImageOptions, LitPreviewImageSource } from './LitPreviewImageBase'
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功，无 TS 错误。

---

### Task 6: 注册与插件导出

**Files:**
- Modify: `src/components-lit/index.ts`
- Modify: `src/index.ts`
- Modify: `src/types/index.d.ts`

- [ ] **Step 1: 将两个组件加入注册表**

编辑 `src/components-lit/index.ts`，在 import 区与 components map 各加两行：

```ts
import LitPreviewImageMobile from './LitPreviewImage/LitPreviewImageMobile'
import LitPreviewImageWeb from './LitPreviewImage/LitPreviewImageWeb'
```

```ts
const components: {
  [propName: string]: CustomElementConstructor
} = {
  LitTest,
  LitPhoto,
  LitPreviewImageMobile,
  LitPreviewImageWeb,
  LitAxiosLoadding
}
```

- [ ] **Step 2: 插件入口导出 `litPreviewImage`**

编辑 `src/index.ts`，在 import 区加入：

```ts
import { litPreviewImage } from './components-lit/LitPreviewImage'
```

在导出列表（末尾 `AI` 之前）加入：

```ts
  AI,
  litPreviewImage
}
```

- [ ] **Step 3: 公共类型声明**

编辑 `src/types/index.d.ts`，在 `export const AI: any` 之前追加：

```ts
export type LitPreviewImageSource =
  | string
  | {
      source: string
      datetime: string
      storage?: StorageType
      watermark?: string
      watermarkcomposite?: 'blended' | 'attached'
      title?: string
    }

export interface LitPreviewImageOptions {
  image: LitPreviewImageSource[]
  index?: number
  type?: 'mobile' | 'web'
}

export const litPreviewImage: (options: LitPreviewImageOptions) => void
```

- [ ] **Step 4: 构建验证**

Run: `npm run build`
Expected: 构建成功，无 TS 错误，`dist/index.d.ts` 已包含 `litPreviewImage` 声明。

---

### Task 7: 演示页 `demo.vue`

**Files:**
- Create: `src/components-lit/LitPreviewImage/demo.vue`

- [ ] **Step 1: 创建演示页**

```vue
<template>
  <div class="demo">
    <div class="demo-tit">lit-preview-image</div>
    <div class="demo-btn">
      <button @click="previewUrl">URL 数组预览</button>
      <button @click="previewStorage">存储对象预览</button>
      <button @click="previewType">指定 type=web</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { litPreviewImage } from './index'

const urlImages = [
  'https://dummyimage.com/600x400/5b8def/fff&text=1',
  'https://dummyimage.com/600x900/8f6fe8/fff&text=2',
  'https://dummyimage.com/900x600/2aa198/fff&text=3'
]

const storageImages = [
  {
    source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
    datetime: '1791724631817',
    storage: 'storage',
    watermark: '2026-10-11 21:17:11\n喜乐多终端\n广东省广州市天河区迎龙路477号',
    watermarkcomposite: 'attached',
    title: '陈列架'
  },
  {
    source: '571be5d2-5915-46f7-b118-64666b56c58d.png',
    datetime: '1791724642218',
    storage: 'storage',
    title: '正面'
  }
]

const previewUrl = () => litPreviewImage({ image: urlImages })
const previewStorage = () => litPreviewImage({ image: storageImages, index: 1 })
const previewType = () => litPreviewImage({ image: urlImages, type: 'web' })
</script>

<style scoped>
.demo-tit {
  margin: 32px 16px 0;
  font-size: 20px;
  font-weight: bold;
}
.demo-btn {
  margin: 16px;
}
.demo-btn button {
  margin: 4px;
}
</style>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功（demo.vue 不在 rollup 打包范围内，不会被打入产物）。

---

## 手动验证清单（在宿主 Vue 项目中引入 demo.vue 验证）

1. **URL 数组预览**：弹出预览，页码 `1/3`；图片占满/居中显示；半透明遮罩可见底层页面。
2. **移动端**（手机视口，`type` 留空自动走 mobile）：
   - 左右滑动切换（超过阈值翻页，回弹归位）
   - 双指捏合缩放（1~4）、双指微缩回弹
   - 双击缩放 1↔2；缩放后单指平移
   - 下拉关闭（遮罩下移 + 变淡）；✕ 关闭
   - title 显示于底部；`1/2` 页码
3. **Web 端**（桌面视口，或指定 `type: 'web'`）：
   - 左右箭头切换；单图不显示箭头
   - `←`/`→` 切换、`Esc` 关闭
   - 滚轮缩放、双击缩放、缩放后拖拽平移
   - 点击遮罩空白处关闭（点图片不关闭）
   - title 显示于底部
4. **存储对象预览**：watermark 为 `attached` 的图片经 canvas 合成水印后展示；title 正常显示。
5. **边界**：`index` 越界归 0；空数组不弹（或立即关闭）；单图页码 `1/1`。
6. **构建产物**：`dist/index.d.ts` 含 `litPreviewImage` 类型声明。
