# LitPreviewImage 图片预览功能设计

日期：2026-10-16
状态：已批准

## 背景与目标

为 `@smart100/spu-web-plugin` 增加一个图片预览功能，通过函数式调用 `litPreviewImage()` 弹出全屏/弹窗预览，分别适配手机端和 Web 端两种界面形态。需求源自 `src/components-lit/LitPreviewImage/README.md`。

调用方式：

```js
litPreviewImage({
  image: [],        // 图片数组
  index: 0,         // 起始预览位置，不传默认第一张
  type: ''          // 'mobile' | 'web'，不传由代码自动判断环境
})
```

## 需求要点（已与用户确认）

| 维度 | 结论 |
|------|------|
| image 元素格式 | 同时支持 URL 字符串和存储对象 `{ source, datetime, storage, watermark, watermarkcomposite, title }` |
| 布局 | 手机端竖屏全屏、图片占满屏宽、无左右方向键；Web 端桌面弹窗、左右圆形箭头；两端半透明遮罩（`rgba(10,10,10,0.55)`）、顶部页码 + ✕、底部 title 条（替代缩略图条，仅当有 title 时显示） |
| 手势/交互 | 手机：左右滑动切换、双指缩放、双击缩放、下滑关闭；Web：←/→ 键盘、Esc、滚轮缩放、双击缩放 |
| 图片加载 | 主图只加载原图（`loadBigurl()`），不做"先缩略图再换原图"；不加载缩略图 |
| 扩展功能 | 加载中 loading 态、加载失败占位图、显示 title、attached 水印 canvas 合成到图 |
| 返回值 | 无返回值，组件自管理关闭（自移除） |
| 环境判断 | UA + 视口综合判断 |

## 架构选型（方案 A：共享基类 + 两个子组件）

三个候选方案中选定：

- **方案 A（采用）**：`LitPreviewImageBase` 承载所有共享逻辑；`LitPreviewImageMobile` / `LitPreviewImageWeb` 继承基类，只实现布局与交互差异；`index.ts` 导出 `litPreviewImage()` 函数。
- 方案 B（两个完全独立组件）：逻辑重复，否决。
- 方案 C（单一组件按 type 切换渲染）：违背 README「两个组件名」要求，否决。

## 文件结构

```
src/components-lit/LitPreviewImage/
├── index.ts                  # 导出 litPreviewImage() 函数 + 两个组件类 + 类型
├── LitPreviewImageBase.ts    # 共享基类（extends LitBase）
├── LitPreviewImageMobile.ts  # 移动端组件（extends Base）
├── LitPreviewImageWeb.ts     # Web 端组件（extends Base）
├── style.ts                  # 共享样式 + 各端差异样式
└── demo.vue                  # 演示页
```

## 数据模型

```ts
type LitPreviewImageSource =
  | string   // 直接可展示的 URL（http/https/blob/data/base64）
  | {
      source: string
      datetime: string
      storage?: StorageType
      watermark?: string
      watermarkcomposite?: 'blended' | 'attached'
      title?: string
    }

interface LitPreviewImageOptions {
  image: LitPreviewImageSource[]
  index?: number              // 默认 0，越界归 0
  type?: 'mobile' | 'web'     // 不传自动判断
}
```

## 图片解析与加载（基类）

复用 `src/components-lit/LitPhoto/PhotoManger` 管理单张图片（不再新建 PreviewImage 类）：

1. 过滤 `image` 数组中的空项（LitPhoto 值中未拍摄项为空字符串 `''`）。
2. 每项创建一个 `PhotoManger`：
   - 字符串项：`new PhotoManger({ type: 'view' })` 后直接赋值 `instance.sourceurl = url`（`bigurl` getter 自然生效）。
   - 存储对象项：`new PhotoManger({ type: 'view', source, datetime, storage, watermark, watermarkcomposite, title })`。
3. 主图：直接 `loadBigurl()` 加载原图，不预加载缩略图；attached 水印由 `loadBigurl()` 内部 canvas 合成到图。
4. 切换目标时对目标项 `loadBigurl()`。
5. 图片加载中显示 loading 态；`img` 的 error 事件切换为失败占位图（复用 `../LitPhoto/assets/image-crash.png`）。

## 环境判断

```ts
function detectType(): 'mobile' | 'web' {
  const ua = navigator.userAgent
  const isMobileUA = /Mobile|Android|iPhone|iPod|iPad|Windows Phone/i.test(ua)
  const isTouchOrNarrow =
    matchMedia('(max-width: 768px)').matches || matchMedia('(pointer: coarse)').matches
  return isMobileUA || isTouchOrNarrow ? 'mobile' : 'web'
}
```

## 共享基类 `LitPreviewImageBase`

```ts
class LitPreviewImageBase extends LitBase {
  @property({ type: Array }) image: LitPreviewImageSource[] = []
  @property({ type: Number }) index = 0

  @state() protected _list: PhotoManger[] = this._reactive([])
  @state() protected _current = 0
  @state() protected _loading = false
  @state() protected _zoom = { scale: 1, x: 0, y: 0 }   // 缩放/平移状态
}
```

职责：
- **解析与加载**：connectedCallback 时过滤空项 → 建 PhotoManger 列表 → 定位 `_current`（钳制越界）→ 对当前项 `loadBigurl()`；`_goTo(i)` 切换并加载目标项、重置缩放。
- **缩放状态**：`_zoom` 统一管理，提供 `_zoomIn/_zoomOut/_resetZoom/_toggleZoom`；双击/双指/滚轮都归一到这套 API。
- **关闭**：`_close()` 执行关闭动画后 `this.remove()`。
- **共享渲染框架**：`render()` 输出半透明遮罩 → 顶部条（页码 `_current+1/_list.length` + ✕）→ 图片区（含缩放 transform 的 `<img>`，绑定 loading/error）→ 底部 title 条（`_list[_current].title` 有值才显示）。
- **可覆盖钩子**：`_renderNav()`（Web 返回左右箭头，Mobile 返回空）、`_bindInput()` / `_unbindInput()`（子类各自绑定输入事件）。
- **清理**：disconnectedCallback 中解绑事件。

共享样式 `style.ts`：遮罩 `rgba(10,10,10,0.55)`、顶部/底部条、页码、✕、loading/占位等公共样式；各端差异样式由子类内联。

## 移动端组件 `LitPreviewImageMobile`

- 布局：全屏 fixed 覆盖 + 半透明遮罩；图片区宽度占满屏宽（`object-fit: contain`）；无左右箭头。
- 手势（touch 事件）：
  - touchstart：记录起点、手指数、当前缩放；双指记录捏合起始距离。
  - 单指 + 未缩放（scale=1）：横向拖动 → 图片跟随手指平移，松手时 `|dx| > 80px 或 > 25% 屏宽` → 切换相邻图（带滑动动画），否则回弹；纵向向下拖动 → 遮罩随手指下移 + 透明度递减，松手时 `dy > 120px` → 关闭。
  - 双指捏合：`scale = clamp(startScale × dist/startDist, 1, 4)`；缩放中可平移。
  - 双击：缩放 1 ↔ 2 切换。
  - 单指 + 已缩放（scale>1）：平移图片。
- 关闭：✕ 按钮、下拉关闭。

## Web 端组件 `LitPreviewImageWeb`

- 布局：桌面弹窗（fixed 覆盖 + 半透明遮罩）；图片居中展示；顶部页码 + ✕；左右圆形箭头按钮。
- 交互：
  - 键盘：`←`/`→` 切换、`Esc` 关闭。
  - 滚轮：`wheel` 缩放（scale 1~4，以光标位置为中心）。
  - 双击：缩放 1 ↔ 2 切换；缩放状态下可拖拽平移。
  - 点击箭头切换、点击遮罩空白处关闭。

## 函数入口 `litPreviewImage()` 与注册

```ts
// src/components-lit/LitPreviewImage/index.ts
function litPreviewImage(opts: LitPreviewImageOptions) {
  const type = opts.type || detectType()
  const Comp = type === 'mobile' ? LitPreviewImageMobile : LitPreviewImageWeb
  const el = new Comp()
  el.image = opts.image
  el.index = opts.index || 0
  document.body.appendChild(el)   // 关闭时组件自移除
}

export { litPreviewImage, LitPreviewImageMobile, LitPreviewImageWeb }
export type { LitPreviewImageOptions, LitPreviewImageSource }
```

- 两个组件加入 `src/components-lit/index.ts` 的 components map（kebab 名 `lit-preview-image-mobile` / `lit-preview-image-web`）；`@customElement` 装饰器 import 时已注册，installLitComponents 的 `get(name)` 守卫避免重复注册。
- 插件入口 `src/index.ts` 导出 `litPreviewImage`。
- 多次调用各自创建独立覆盖层，可叠加；关闭自移除。

## 边界情况

- `image` 为空数组 / 全部为空项：不弹出或直接关闭。
- `index` 越界：钳制到合法范围。
- 单张图片：左右切换无效果、页码显示 `1/1`、Web 端箭头可隐藏或置灰。
- 图片加载失败：显示失败占位图，不阻塞其他图片。
- attached 水印合成失败：回退显示原图，不阻断预览。

## demo 与验证

`demo.vue`（与 LitPhoto 一致）：
- 按钮①：字符串 URL 数组触发预览。
- 按钮②：存储对象数组触发预览（含 watermark / title，验证水印合成与 title 显示）。
- 可指定 `type` 或留空走自动判断。

手动验证清单（仓库无自动化测试框架，按 `npm run build` + demo 手动验证）：
- 移动端：滑动切换、双指缩放、双击、下拉关闭、✕ 关闭、title 显示、loading/失败占位。
- Web 端：箭头/键盘切换、滚轮缩放、双击、Esc、✕、title。
- 环境自动判断：`type` 留空时手机视口走 mobile、桌面走 web。
