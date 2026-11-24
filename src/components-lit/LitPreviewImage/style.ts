import { css, unsafeCSS } from 'lit'
import imageCrash from '../LitPhoto/assets/image-crash.png'

const style = css`
  :host {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(10, 10, 10, 0.55);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  :host([visible]) {
    opacity: 1;
  }
  .lit-preview {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    will-change: transform, opacity;
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
  /* 移动端：无关闭按钮，序号水平居中 */
  .lit-preview-top--centered {
    justify-content: center;
    padding: 0;
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
    -webkit-user-drag: none;
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
    height: 44px;
    line-height: 44px;
    box-sizing: border-box;
    padding: 0 16px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(0, 0, 0, 0.25);
  }
  /* 无 title 时仅保留占位高度，隐藏背景 */
  .lit-preview-title--empty {
    background: transparent;
  }
  /* 移动端画廊滑动：三张并排，跟随手势平移 */
  .lit-preview-track {
    position: absolute;
    inset: 0;
  }
  .lit-preview-slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* 箭头：基于 body 垂直居中，不随图片尺寸变化 */
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
