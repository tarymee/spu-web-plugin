import { css, unsafeCSS } from 'lit'
import imageCrash from './assets/image-crash.png'
import camera from './assets/camera.png'

const style = css`
  :host {
    display: block;
  }
  .lit-photo {
    display: flex;
    flex-wrap: wrap;
  }

  .lit-photo-upload-wrap {
  }

  .lit-photo-upload {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
  }

  .lit-photo-upload:active {
    background-color: #f2f3f5;
  }

  .lit-photo-upload-icon {
    width: 24px;
    height: 24px;
    background-image: url(${unsafeCSS(camera)});
    background-size: 24px 24px;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .lit-photo-upload-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
    opacity: 0;
  }

  .lit-photo-upload-input:disabled {
    cursor: not-allowed;
  }

  .lit-photo-item-wrap {
  }

  .lit-photo-item {
    position: relative;
    box-sizing: border-box;
    border-radius: 8px;
    overflow: hidden;
  }

  .lit-photo-item-image {
    display: block;
    width: 100%;
    height: 100%;
    // object-fit: scale-down;
    object-fit: cover;
    cursor: pointer;
  }

  .lit-photo-item-error {
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    box-sizing: border-box;
    background-color: #f7f7f7;
    background-image: url(${unsafeCSS(imageCrash)});
    background-size: 25px 19px;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .lit-photo-item-none {
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    box-sizing: border-box;
    background-color: #f7f7f7;
    color: #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .lit-photo-item-msg {
    position: absolute;
    width: 100%;
    height: 24px;
    line-height: 24px;
    bottom: 0;
    left: 0;
    text-align: center;
    color: #ed6a0c;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.88);
  }

  .lit-photo-item-title {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    margin-top: 4px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .lit-photo-item-delete {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 0 0 0 8px;
    text-align: center;
    color: #333;
    cursor: pointer;
  }

  .lit-photo-item-tags {
    height: 24px;
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    border-radius: 0 0 0 8px;
    overflow: hidden;
  }
  .lit-photo-item-tags-item {
    flex: none;
    width: 22px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.8);
    color: #e16f24;
  }
`

export { style }
