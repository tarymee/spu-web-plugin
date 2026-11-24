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
  el.images = opts.images
  el.index = opts.index || 0
  document.body.appendChild(el) // 关闭时组件自移除
}

export { litPreviewImage, LitPreviewImageMobile, LitPreviewImageWeb }
export type { LitPreviewImageOptions, LitPreviewImageSource } from './LitPreviewImageBase'
