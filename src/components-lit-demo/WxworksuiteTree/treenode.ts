import { LitElement, css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { repeat } from 'lit/directives/repeat.js'

export default class WxworksuiteTreenode extends LitElement {

  static componentName: string = 'wxworksuite-treenode'
  static register () {
    if (!window.customElements.get(WxworksuiteTreenode.componentName)) {
      window.customElements.define(WxworksuiteTreenode.componentName, WxworksuiteTreenode)
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .tree-node {
      display: block;
      /* border-radius: 10px; */
      background: #fff;
    }
    .tree-node-web {}
    .tree-node-line {
      display: flex;
      width: 100%;
      height: 54px;
      line-height: 54px;
      font-size: 16px;
      align-items: center;
      cursor: pointer;
      box-sizing: border-box;
      border-bottom: 1px solid #F6F6F6;
      padding: 0 12px
    }
    .tree-node-web .tree-node-line {
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      border-bottom: none;
      padding: 0 8px
    }
    .tree-node-line-select {
      background-color: rgba(000, 000, 000, 0.2);
    }
    .tree-node-line:hover {
      background-color: rgba(000, 000, 000, 0.1);
    }
    // .tree-node-line:focus {
    //   background-color: rgba(000, 000, 000, 0.1);
    // }
    // .tree-node-line:active {
    //   background-color: rgba(000, 000, 000, 0.1);
    // }

    .tree-node-org {
      flex: none;
      width: 24px;
      height: 24px;
      background-size: 16px 16px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAQtQTFRFAAAAAID/Inf/Ioj/G4b/F4D/H3r/H4X/HYD/HHv/HIT/G4D/Gn//GYT/GID/F3z/FoP/HXz/HIP/G4D/GoP/GYP/GIL/HID/G4L/GYL/HIL/G4T/G4H/G4X/GoP/GYH/GYP/GoT/GoP/GYT/GoL/GoL/GYX/GYP/GoT/GoP/GYT/GoT/GoT/GoP/GoX/GoX/GoT/GYT/GoT/GYT/GoX/GoX/GYX/GoX/GYX/GYX/GoX/GoX/GoX/GoX/GYX/GYT/GYX/GoX/GoX/GYX/GYX/GoX/GoT/GoX/GYb/GoX/GoX/GoX/GYT/GYX/GoX/GYT/GoX/GoX/GoX/GoX/GoX/GYX/GoX/GoX/GoX/qs3FVQAAAFh0Uk5TAAQPDxMWGRkaGxscHh8gISMjJSYnKSsuLzM3OEFDRkdITU5TWFpcZWxtcHh+iIibnKKmrK60uLq+wMHGx8/T1NXX293e4eLj6evs7vHx8fP19vf4+fz9/ho458UAAAE2SURBVEjH7ZbXVoNAEIYXEmCjsRFRwJ7Ye+911RhLFIwG3v9JpIUzuBJ3LvQq3+U/++2ew3DODCEBkqyo9BdURZZIQkGjQmiF+HyRClOM7qcIgjckDSNoEpEpCpkoOEEhKk5QCRf17Th+wvv+IFfmhSUfsCYgbEBhS0DYhMJ2T/gLQaQPK1BYFxDKh17nePt4RECgtGKa5t2tYRjDPxRJzm/MWE7huzC7e3Ia4rjnIWd7k92F6sfna4Z2a6qrcPQ2kQ2mvYM8oTQWwK4syxroREO2bbcudV2v9PPCwlP68d3VOFp20+h5kRPqoF1OOXqyCaIHToD99c0wGc1EPeF/BA9WxznB44QbUH0sRVEDRIwTZi5emgnXtTiav0/vZ3OpgB4o6JGFHorosYse7PjVAb+c4NafL0Vh7eZJslu0AAAAAElFTkSuQmCC);
    }
    .tree-node-web .tree-node-org {
      width: 20px;
      height: 20px;
      background-size: 14px 14px;
    }

    .tree-node-expand {
      flex: none;
      width: 24px;
      height: 24px;
    }
    .tree-node-web .tree-node-expand {
      width: 20px;
      height: 20px;
    }
    .tree-node-expand-left {
      /* margin-left: 8px; */
    }
    .tree-node-web .tree-node-expand-left {
      /* margin-left: 4px; */
    }

    .tree-node-expand-1 {
      transition: all 0.3s;
      width: 24px;
      height: 24px;
      background-size: 10px 10px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IArs4c6QAAAE5QTFRFAAAAmZmZnZ2dk5OTlZubmJiYmJiblpaZlZeXl5ealZial5eZlpeZlpiZlpiZl5eZlpeZlpeZlpealpialpeZlpeZlpeZlpeYl5ialpeZUWV/QAAAABl0Uk5TAAUNGik0SktlZW+CoLnP0tXY4O/x8/f7/lzrYIYAAABWSURBVBgZtcFHDoAgAEXBh9h713//i2qMQWDvDL+odwX2GlgUWYFBkRHINgW2jFtxyHPkPKpTzlnyauQ0OK1eLR/T6dEZPEmvW58QsLM0WyLpNKX86AJTcwzl85W+bAAAAABJRU5ErkJggg==);
    }
    .tree-node-web .tree-node-expand-1 {
      width: 20px;
      height: 20px;
      background-size: 8px 8px;
    }
    .tree-node-expand-0 {
      transition: all 0.3s;
      width: 24px;
      height: 24px;
      background-size: 10px 10px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IArs4c6QAAAFRQTFRFAAAAmZmZnZ2dk5OTlZubmJiYmJiblpaZlZeXl5ealZial5eZlpiYlpeZlpiZlpiZl5eZlpeZlpeZlpealpeZlpiZlpeZlpeZlpeZlpeYl5ialpeZ086ZTwAAABt0Uk5TAAUNGik0SktlZW+Cg6C5z9LV2ODh7/Hz9/v+0+Z51wAAAFNJREFUGNON0DkSgCAAQ1FUcFfcF/7972kvcSTla5KJMV9p98lFeMFZvRHgbgQSOoEwZAIZc4H4QiCrFciSiptNK1KTxPjQi0NqcV0ZnXzMzvzlAX8aDeeIcC7nAAAAAElFTkSuQmCC);
    }
    .tree-node-web .tree-node-expand-0 {
      width: 20px;
      height: 20px;
      background-size: 8px 8px;
    }

    .tree-node-name {
      flex: 1;
      color: #666;
      display: block;
      white-space: nowrap;
      word-wrap: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .tree-node-check {
      flex: none;
      width: 30px;
      height: 54px;
      background-size: 18px 18px;
      background-position: center;
      background-repeat: no-repeat;
    }
    .tree-node-web .tree-node-check {
      width: 24px;
      height: 32px;
      background-size: 14px 14px;
    }
    .tree-node-check-1 {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAP9QTFRFAAAAAFX/IID/GIb/F4P/F4f/Gof/GoX/G4T/G4f/GYb/Gob/GoX/G4b/GoX/GoX/GoX/Gob/GoX/Gob/GoX/G4X/HIb/Hof/H4j/MJH/NJP/OJX/O5b/PJf/QJn/QZn/Rpz/SZ7/S5//UKL/UqL/VqX/XKj/Y6v/ZKz/Z63/aq//crP/dLX/erj/fLn/f7r/hL3/hr7/i8H/k8X/mMj/m8n/os3/pc7/qtH/rtP/rtT/sNX/t9j/x+H/2Or/3u3/4u//5vH/6PP/6vP/6/T/7fX/7vb/8Pf/8ff/8vj/8/j/9fn/9/r/9/v/+fz/+vz/+/3//P3//f7//v7/////i2rNLwAAABR0Uk5TAAMIFSEiRFhoaJikxMrN1+v4/v5B0+PEAAABVUlEQVQ4y42U53aDMAyFDSFhb7Xp3k1305XuvdOZtHr/Z6lNgWMT4Pj+4Ro+PCRLhHDSDNsLwjDwbEMjpVJ0J4JckaMro0zLh4L8VgFRrRhGFFsqzzRcKJXb4BgfKuTnlOpCpdxsRQtqZKXniuugODmj4kOtfBYvverrxHm/y546hZwKpn2J2GfGIaQZlTPjF4h4lWRII2Y5M3ZKmZvJxBvELoeOKXM79e9t4qVvZ3odjulR5m46HXgkSN01Djdy5pAyD7PZKCBh6h4Rv7O5DijzNJ//EubQ+hDxYyWxe5R5WQAOypaDrV/Et0VqdplZ4jYY5BsH6NIJnudgmzLvy/xJPT4EbCv3+z+In6tCOGwhmEeY6KsjxswQ03LCmMGayNC0CAlmCRtsFoLvFK9K++x1p5ghXfbSSV1fuUKQKymp4pQrc7mGIdd6JJsYU9PM2qEptMM/OntmUPz7cm0AAAAASUVORK5CYII=);
    }
    .tree-node-web .tree-node-check-1 {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHqADAAQAAAABAAAAHgAAAADKQTcFAAADiUlEQVRIDcWXS0hUYRTH//ebOy+d1HEh5Yj0gCBKeiwialG0kWjRoiCECMIMgjYV6iZaBC4KCjLatIkwSikSXRhUoFGEVNBr0aKVUEmQOjPqOHfu4+uc786Mjxkfo46dxdzh3u87v/M/5zvncjWQRa7LGmnjhiZxSAIb+N5qmwYMSw0Dmgctv1q1nxpDYeELAStXG5bPHwUwCh07dVZKC9YEyoEogcQUnF6+sZbGTFGsmi4khJlioQXFfPbfwHoxVDm2TW4poZqAEPm15b+7zGiklHBSSXjNKLaExiGTcbhB5DpcNTBDpZlEbWgC7y5V4O3FMC4fJPfmJPjZXFsVsIJaKVT5x/GkMYyaCo/i7IgEKJhJynoRwC7URLmIE7QStWEXmjAl2l8nVJ1VvedInlex4zhUHwt8nc8y0KCMofNMBbZWuWc1ZUs0Pkrg09AUNG8pbadBOcdywOzMMQ3AiCISyBwQK6dOCkqB+ewYOk6XY1eNV7l2aP+Fp0n0f48D3hICB4m7FDAplEYMPY0hfGwO435DAH46pdIyZ8ElQUUqhnsNZTiw2ZfV09xjoPdzlKBBCB+ppZbSFgOzCkgHfjmFuoir4Mj2AKWxDCHECZ5ScG4RacRx+3gp6rf5s9BrL1J4ODgGeAIEDQHCkxfKG3JSzcEZjsDNgVTW4b5NPjxrKkdYJzi1jExG0XY0gBO7KY1pa39j4m7/KDSdoP6FobxlFlilhFLDtbnz8g+uPjey6a2r9qL3XBjrqe4th31o3M+HxrUHHyy09Y1A83jTUH1epZk9WnXb7CZT6XYs2FNj0OhlfXJvGLeO+eER7gGJTjmoCE7H2/3NxvnOv1RLndK7jtLsXRTK8GkP6VCUaqHDEwyrWnW9j6KpKwnDcofATOirHw4udI3QuaCZzDVdIjQvmG9m4KpWVLO+rzGc6khgMjU9gQaHHJztGIHtaBCBMoL6lqQ0rQ85qc484KubdpsG/wRgJbFnYwhX6kvwOy7R2j2KSUNSTdPQed5CM/3N/L8geCZcmglqpySlg0Yi1Z5+CFqulJLUgtSy30Xfx5x2yf2YHgawqc0EHSCdWonSuxzoksC8SMHpHGrUZjyRlHHbkanzoP4V9rOo4ow7Bcgz+jLPC71ydw4Xumml65kp+LNipY4K3c9Mwd8yFMFooZuXu55ZzBT8AcXfMvSuflzMtCvfxGAWM/8BWXBdqzgbblMAAAAASUVORK5CYII=);
    }
    .tree-node-check-0 {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAE5QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxKKmWQAAABp0Uk5TAAECAwUHCAkLDhETGBkaGxwfICEiIyQmKCm9h7L5AAAA20lEQVQ4y42U17KDMAxE14QSSmi2wef/f/Q+pAyTC472UXPGsspKOqjsRr+ntPuxK3WudgHSFsKWgKU9Qe4B1r52kuTqfoVw/0LcAFN1jFQTDO4YuXli8/12E/G3AxOZi/8/KGbih3Kex3ktD/w748B8UbBmhlddxOIKKiLPGgONLtUQJKllUkYTraSFKgdVLFLJqqxWSnX0eain00idh2pG+eTykEte+6Yf2nal8AsKyQaZ0pk+bmqBqZmmsZgGbFsV09LZ1tdkBJulTOa02dx2MGynx3jEcufwDz3UEok9W1hJAAAAAElFTkSuQmCC);
    }
    .tree-node-web .tree-node-check-0 {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHqADAAQAAAABAAAAHgAAAADKQTcFAAABBUlEQVRIDe2XvQ3CMBBGieNIQXLhLEATJT2wBgzCRLAHrAEDJErDAnFhiUj5Ef4ipbGlVD6lsTufrXt3z8052pnVNE2ptb4Pw3Aax1Ei5nvFcaw45x8hxC3P8yoCtG3b9zRNIkmSb5qmlbn08wk2zey7riv7vj8wxnSWZWduOn0AKqV8FkXx8gm0c9V1fVFKXWGXGb1HdEoNRRFggIUnZXhT6LWro9qDBSYDwPebrhW9sGbw2kWqswCmMuvkDaodJVSBoJrKrJM3qHaUUAWCaiqzTt6g2lFCFZhVY+6lAth5FxbDhI9h275AtQcLTIZvBSZ8DNtUsCUvGGCBudkXJkI1W3za/i2+j6GGn+mPAAAAAElFTkSuQmCC);
    }
    .tree-node-check-2 {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAASxQTFRFAAAAAFX/IID/GIb/F4P/F4f/Gof/GoX/G4T/G4f/GYb/Gob/GoX/G4b/GoX/GoX/GoX/Gob/GoX/Gob/FnTfFnTgFnThFnXhFnXiFnXjFnbjFnbkFnflFnfmFnjnFnjoFnjpFnnpFnnqF3fmF3joF3npF3nqF3nrF3rrF3rsF3rtF3vtF3vuF3vvF3zvF3zwF33xF33yF370GHvsGHvtGHvuGHzuGHzvGHzwGH3wGH7yGH7zGH70GH71GH/2GID3GID4GIL7GIL8GIP9GYH4GYH5GYL7GYP8GYP9GYT+GoX/N4nnN4vqOIzuOI7wTZfqTprxU5npVJvuVJzuVJ/0osfyosn1o8v5xdz4xd35xd77xd782ur82+r72+v97/X97/b97/b+8/j+////kkh67gAAABR0Uk5TAAMIFSEiRFhoaJikxMrN1+v4/v5B0+PEAAACMElEQVQ4y43UaVeyQBgGYFxyF1zCiCiIyiAxKkpNC1pkGdo322wR//9/eGEGfJHsnO4vnAPXmRlm5nkwLJRkJo+XyuUSns8ksZmJpQsVe5JKIR37aVKEHQmRipB4rmr/SDUXD5tE0Z6ZYiJkCPuXEBMVL9q/phjMmAveAOtkb1eWd/dOLBC8y/n/VQ2IJkuiwPOCKMlawKrwH2P+gsDZjsg9DIaOMxw8cOLOma8Ib7/SgWnyl69jP6+XfDNQaRcVkDmXuZvv8STfN5x8jlQBw+YqaD3H3MXXOJSvC+4YrauSxLJooNPNxZfxVF4WN0/RUBksjwY6Yu7GkdwxR2ioPIZDZG4tPEXR08KWCRGOlSAy2PmPKPqYZw2ISljZe1g6TTpR5JC0bnlfyz7qU7MQ1fcRnM7S6NowioY1WrPQdDhCTG0QRYMagxCOtsDq18n7KLon62i6PNpMS98mmbdp88aQ22jhGXQswOitUVejsBldUWs9uAXuscADBqYqUcu3ITW6XaYkFW5mwb8qwNK7As1evwfm/Zqlha4OjyUdXDpgah1hiW08Pn86zufzY4NdEjoaHAheOnh9gWWobXF9hW9IzabU4FfWxbZqeANVU/8LwVMdRayvbrDsxmpdVDrIBIWASspVWrelKPsHB/uK0upqyExKChUnsExd7R22W632YU/VTWiIRKTMgcsMva9pfd1wCYiUedAwgOtgACSRhvG31vPHJuZlLhu0w+xUO/wHsg0VS5qPp80AAAAASUVORK5CYII=);
    }
    .tree-node-web .tree-node-check-2 {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAACCklEQVRYCe2YvU4CQRDH/7t8f5ioNEK0sLPTykaNhQ9h5wOYWJn4BjYmlnT2+hgSQ2XlA2ijEWOBRhI4OLhxBiwId3sbEY/mNpDs7c7N/Pa/s7PJKXCrXNKa6uIChH0CyjIWVVNAAwo1yuDs9VQ9qx+YByIsRQURFIfBmpTFlhZl5g0jgLwzy8KiZZuCiOcyxiw66pwJW6iw6DCDeczFQDbVY4VihWwK2ObjHLIplLQZkDeA/MEX3p+a4utTaf4loKRvaEYgYgByHZQLLnbWE8gYLQ2eJ4Yd10P9qYu3VhKUKRrBzGEGLrZXCddHC8inzSuaiBv62O4VcXj1jvuXHlS+xIolfPbGpCYGOt5NzQxGIsvCTg5KoL7D6nc4C/xpYAQa5Yz/Bd+Sfj3AeZTKA14/MC/NQDqJ6u0X2r3ZQbVdQvXOAdi3qanKeYBubO15HqjTxEqug72NErJpsxOT8/Fxp0+oP/bQaIk4DnQqB5Uu+E6cEUicyXH3Op+gASdhQoD+ktxy7NXIgxz99OikjUNLP3zZXDd0bhHgBCfyJt+d6lnq0HDL2HdQCwUaFjA+miQFLejtKcemKozjscIcjNvNoh+s2yw8T+kjBrIJFysUK2RTwDavueA1bEZRzQuLlOBaVAGtcZhFy5crvvM+rMb/bMDqNIVFy2c07mwy1M08tk9iSmz5eiYs3/KJmIkHsG5JAAAAAElFTkSuQmCC);
    }

    .tree-node-children {
      padding-left: 18px;
    }
    .tree-node-web .tree-node-children {
      padding-left: 12px;
    }
  `

  @property({ type: String })
  displaytype: string = 'mobile' // web | mobile

  @property({ type: Boolean })
  isonelevel: boolean = true

  @property({ type: Boolean })
  isrenderchildren: boolean = true

  @property({ type: Object })
  node: any = {}

  // 判断是否开启企微通信录支持，默认不开启
  @property({ type: Boolean })
  iswwopendata: boolean = false

  // 控制通信录转移类型
  @property({ type: String })
  wwopendatatype: string = '' // userName | departmentName

  @property({ type: Boolean })
  updatepoint: boolean = false

  @property({ type: Boolean })
  ismulselect: boolean = false

  @property({ type: String })
  expandmode: string = 'root' // root | no | all

  @property({ type: String })
  expandicon: string = 'normal' // normal | organization

  constructor () {
    super()
  }

  connectedCallback () {
    super.connectedCallback()
  }

  private toggle (type: 'expand' | 'select' | 'check') {
    // console.log(type)
    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: {
        type: type,
        node: this.node
      }
    }))
  }

  private clickNode () {
    if (this.ismulselect) {
      this.toggle('check')
    } else {
      this.toggle('select')
    }
  }

  handleToggle (e: any) {
    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: e.detail
    }))
  }

  private test () {
    console.log(this)
  }

  // children isselected: ${this.node.isselected}<br />
  // children ischecked: ${this.node.ischecked}<br />
  // children checkstate: ${this.node.checkstate}<br />
  // children ismulselect: ${this.ismulselect}
  render () {
    return html`
      <div class=${classMap({
        'tree-node': true,
        'tree-node-web': this.displaytype === 'web',
        'tree-node-mobile': this.displaytype === 'mobile'
      })}>
        <!--  tabindex="-1" -->
        <div class="tree-node-line" class=${classMap({
          'tree-node-line': true,
          'tree-node-line-select': this.node.isselected
        })}>

          ${
            this.expandicon === 'organization'
            ?
            html`
              <div class="tree-node-org"></div>
            `
            :
            html`
              <div class="tree-node-expand" style=${styleMap({
                display: this.isonelevel ? 'none' : 'block',
              })}>
                ${
                  this.node?.children?.length && this.isrenderchildren
                  ?
                  html`
                    <div
                      @click="${(e: Event) => this.toggle('expand')}"
                      class=${classMap({
                        'tree-node-expand-1': this.node.isexpand,
                        'tree-node-expand-0': !this.node.isexpand
                      })}
                    >
                    </div>
                  `
                  :
                  ''
                }
              </div>
            `
          }

          ${
            this.ismulselect && this.displaytype === 'web'
            ?
            html`
              <div
                @click="${(e: Event) => this.toggle('check')}"
                class=${classMap({
                  'tree-node-check': true,
                  'tree-node-check-0': this.node.checkstate === '0',
                  'tree-node-check-1': this.node.checkstate === '1',
                  'tree-node-check-2': this.node.checkstate === '2'
                })}
              >
              </div>
            `
            :
            ''
          }


          <div
            @click="${this.clickNode}"
            class=${classMap({
              'tree-node-name': true
            })}
          >
            <!-- ${this.node.name} -->
            ${
              ((this.iswwopendata && this.wwopendatatype) || (this.node.iswwopendata && this.node.wwopendatatype))
              ?
              html`
                <wxworksuite-opendata
                  type="${(this.node.iswwopendata && this.node.wwopendatatype) ? this.node.wwopendatatype : this.wwopendatatype}"
                  openid="${this.node.name}"
                >
                </wxworksuite-opendata>
              `
              :
              html`${this.node.name}`
            }
          </div>

          ${
            this.ismulselect && this.displaytype === 'mobile'
            ?
            html`
              <div
                @click="${(e: Event) => this.toggle('check')}"
                class=${classMap({
                  'tree-node-check': true,
                  'tree-node-check-0': this.node.checkstate === '0',
                  'tree-node-check-1': this.node.checkstate === '1',
                  'tree-node-check-2': this.node.checkstate === '2'
                })}
              >
              </div>
            `
            :
            ''
          }

          ${
            this.expandicon === 'organization'
            ?
            html`
              <div class="tree-node-expand tree-node-expand-left" style=${styleMap({
                display: this.isonelevel ? 'none' : 'block',
              })}>
                ${
                  this.node?.children?.length && this.isrenderchildren
                  ?
                  html`
                    <div
                      @click="${(e: Event) => this.toggle('expand')}"
                      class=${classMap({
                        'tree-node-expand-1': this.node.isexpand,
                        'tree-node-expand-0': !this.node.isexpand
                      })}
                    >
                    </div>
                  `
                  :
                  ''
                }
              </div>
            `
            :
            ''
          }

        </div>


        ${
          this.node?.children?.length && this.isrenderchildren
          ?
          html`
            <div
              class="tree-node-children"
              style=${styleMap({
                display: !this.node.isexpand ? 'none' : 'block',
              })}
            >
              ${
                repeat(
                  this.node.children,
                  (item: any) => item.id,
                  (item, index) => html`
                    <wxworksuite-treenode
                      displaytype="${this.displaytype}"
                      expandmode="${this.expandmode}"
                      expandicon="${this.expandicon}"
                      .node="${item}"
                      .isonelevel="${this.isonelevel}"
                      .isrenderchildren="${this.isrenderchildren}"
                      .iswwopendata="${this.iswwopendata}"
                      wwopendatatype="${this.wwopendatatype}"
                      .ismulselect="${this.ismulselect}"
                      .updatepoint="${this.updatepoint}"
                    >
                    </wxworksuite-treenode>
                  `
                )
              }
            </div>
          `
          :
          ''
        }
      </div>
    `
  }
}

