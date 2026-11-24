import { LitElement, css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { isInMiniProgram, delay, getUniqueid, getQueryByUrl } from '../../../utils'
import { spuAxios } from '../../../axios'
import { getUser, getToken, getTokenExpires, getRefreshToken } from '../../../auth/login'

// @customElement('wxworksuite-test')
export default class SpuCustomervisitSkip extends LitElement {
  static componentName: string = 'spu-customervisit-skip'

  static styles = css`
    :host {
      display: block;
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 99999;
    }

    .spu-customervisit-skip-btn {
      display: block;
      height: 40px;
      width: 80px;
      line-height: 40px;
      background: #07c160;
      color: #fff;
      text-align: center;
      border-radius: 20px;
      font-size: 16px;
      cursor: pointer;
      z-index: 99999;
    }
  `

  constructor() {
    super()
  }

  private skip(e: Event) {
    // console.log(this, e)
    let litheformvisitdata: any = getQueryByUrl('litheformvisitdata')
    litheformvisitdata = litheformvisitdata
      ? JSON.parse(decodeURIComponent(litheformvisitdata))
      : null

    // console.log(litheformvisitdata)
    // debugger

    let skipreason: any = ''
    if (litheformvisitdata.requiredskipreason === '1') {
      skipreason = window.prompt('跳过原因', '')
      if (!skipreason) {
        window.alert('请输入跳过原因！')
        return false
      }
      // try {
      //   skipreason = await prompt({
      //     title: '跳过原因',
      //     placeholder: '请输入跳过原因'
      //   })
      //   console.log('跳过原因', skipreason)
      // } catch (err) {
      //   console.error(err)
      //   // Toast.fail('请输入跳过原因！')
      //   return false
      // }
    }

    spuAxios
      .post(
        '/visitworkexecute/saveVisitWorkRecord',
        {
          submitter: getUser('mbcode'),
          submittertime: Date.now().toString(),
          customerid: litheformvisitdata.customerid,
          customertype: litheformvisitdata.customertype,
          customerstatusid: getUniqueid(),
          workrecordid: getUniqueid(),
          actualvisitid: getUniqueid(),
          workid: litheformvisitdata.workid,
          visitcontent: litheformvisitdata.stepname,
          stepid: litheformvisitdata.stepid,
          casecode: litheformvisitdata.casecode,
          visitcontentid: '',
          settings: JSON.parse(litheformvisitdata.settings as string),
          execstatus: '4',
          skipreason: skipreason
        },
        {
          modulekey: 'customervisit'
        }
      )
      .then((res: any) => {
        // console.log('then', res, window.Native)
        if (res.code === 200) {
          window.Module?.callModuleEvent &&
            window.Module.callModuleEvent({
              modulekey: 'customervisit',
              key: 'step_execute_success',
              data: ''
            })
          window.Native?.exitPage && window.Native.exitPage()
        } else {
          window.alert(res.msg || '网络异常，请稍后重试。')
        }
      })
      .catch((err: any) => {
        // console.error('catch', err)
        window.alert(err.msg || '网络异常，请稍后重试。')
      })
  }

  render() {
    return html`<div class="spu-customervisit-skip-btn" @click="${this.skip}">跳过</div> `
  }
}
