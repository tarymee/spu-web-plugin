import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import LitPreviewImageBase from './LitPreviewImageBase'

@customElement('lit-preview-image-web')
export default class LitPreviewImageWeb extends LitPreviewImageBase {
  protected _bindInput() {
    window.addEventListener('keydown', this._onKeydown)
  }

  protected _unbindInput() {
    window.removeEventListener('keydown', this._onKeydown)
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._close()
    else if (e.key === 'ArrowLeft') this._goTo(this._current - 1)
    else if (e.key === 'ArrowRight') this._goTo(this._current + 1)
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
