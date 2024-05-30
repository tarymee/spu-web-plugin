import { getAttributes } from '../common/index'
import renderTemplate from './template'
import { Step } from './step'
import { cloneDeep, merge } from 'lodash-es'
import { fixFileName, dealFileSize, dealResultMessage } from './util'
import { apaasAxios } from '../../axios'
import core, { Module } from '../../core'
import login from '../../login'
import { downloadService } from '../../oss'
import { apaasSpuTrackSendLog } from '../../apaasSpuTrack'

export default class SpuExpandexp extends HTMLElement {

  static componentName: string = 'spu-expandexp'
  static register () {
    if (!window.customElements.get(SpuExpandexp.componentName)) {
      window.customElements.define(SpuExpandexp.componentName, SpuExpandexp)
    }
  }

  shadow!: ShadowRoot
  defaultProps = {
    exportapi: '',
    sheetname: '',
    pagecode: '',
    mergedata: null
  }
  props!: any
  data: any = {}

  statusTimer: number | null = null

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  // 当自定义元素第一次被连接到文档DOM时被调用。
  connectedCallback () {
    this.initProps()
    this.shadow.innerHTML = renderTemplate(this)

    this.initData({
      filetype: '1', // 导出文件类型 1: xls 2: csv 目前spu的导出只实现了xls 因此写死xls
      exportcontent: 'excel', // excel.仅导出单据，link,导出单据和本地链接，photo.导出单据和图片
      filewatermark: '0', // 1.开启文件水印，0.关闭文件水印
      iscompress: '0', // 1.压缩，0.原图
      displaytype: 'horizontal', // horizontal:横向排列 vertical:纵向排列 multi-row:分行展示
      imagetype: 'origin', // 导出图片类型 png jpg origin 默认origin
      imagename: '', // 图片命名规则
      // imagesizepercolumn 和 imageheightcm 为 图片导出SPU新增配置项
      imagesizepercolumn: '5',
      imageheightcm: '2',

      expandStatus: '1', // 1普通导出（没有做图片导出服务） 2服务端导出（做了图片导出服务未SPU化） 3安装了图片导出SPU
      filewatermarkGlobalConfig: '0', // 全局文件水印开关
      exportConfigInit: false,
      exportcontentArray: ['excel', 'link', 'photo'], // 当 expandStatus = 2 | 3时才显示导出内容给用户选择
      percentage: 0,
      step: new Step(),
      stepStatus: 0,
      stepName: 'initial',
      stepText: '',
      resultMessage: '',
      exportDataItem: {},
      exportId: '',
      fileName: '',
      fileSize: '',
      runningTaskCount: 0,
      isOldVersionService: false
    }, (key: string, value: any) => {
      const { exportConfigInit, stepName, stepText, exportcontentArray, exportcontent, isOldVersionService, runningTaskCount, fileName, filetype, fileSize, exportDataItem, percentage, resultMessage } = this.data

      // debugger
      const $exportSel = this.shadow.querySelector('.export-sel') as any
      const $exportSelCon = this.shadow.querySelector('.export-sel-con') as any
      const $exportSectionWrap = this.shadow.querySelector('.export-section-wrap') as any
      const $exportBtnwrap = this.shadow.querySelector('.export-btnwrap') as any
      const $exportDownload = this.shadow.querySelector('.export-file-r-download') as any
      const $exportCancel = this.shadow.querySelector('.export-file-r-cancel') as any
      const $exportProgress = this.shadow.querySelector('.export-progress') as any
      const $exportProgressInner = this.shadow.querySelector('.export-progress-inner') as any
      const $exportProgressText = this.shadow.querySelector('.export-progress-text') as any
      const $exportTip = this.shadow.querySelector('.export-tip') as any
      const $exportTit = this.shadow.querySelector('.export-tit') as any
      const $exportResult = this.shadow.querySelector('.export-result') as any
      const $fileimg = this.shadow.querySelector('.export-file-l-img') as any
      const $filename = this.shadow.querySelector('.export-file-l-filename') as any
      const $filesize = this.shadow.querySelector('.export-file-l-filesize') as any
      const $wait = this.shadow.querySelector('.export-wait') as any
      const $waitSpan = this.shadow.querySelector('.export-wait span') as any

      if (key === 'exportConfigInit') {
        this.vIf($exportSelCon, exportConfigInit)
      }

      if (key === 'expandStatus' || key === 'stepName') {
        // this.vIf($exportSel, (expandStatus !== '1' && stepName === 'initial'))
        this.vIf($exportSel, (stepName === 'initial'))
      }
      if (key === 'exportcontentArray' || key === 'exportcontent') {
        const mapTitle: any = {
          excel: '仅导出单据',
          link: '导出单据和本地链接',
          photo: '导出单据和图片'
        }

        const exportcontentOptions = exportcontentArray.map((item: string) => {
          return {
            label: mapTitle[item],
            value: item
          }
        })

        const html = exportcontentOptions.map((item: any) => {
          return `
            <div class="export-sel-con-item">
              <input type="radio" id="${item.value}" name="exportcontent" value="${item.value}" ${item.value === exportcontent ? 'checked' : ''} />
              <label for="${item.value}">${item.label}</label>
            </div>
          `
        }).join('')

        $exportSelCon.innerHTML = html
        // set(exportcontent)
      }


      // 状态标题
      if (key === 'stepText') {
        this.vText($exportTit, stepText)
      }

      // 下载按钮显隐
      this.vIf($exportDownload, ((stepName === 'error' || stepName === 'success') && exportDataItem?.exportfileurl))

      // 取消按钮显隐
      this.vIf($exportCancel, ((stepName === 'running' || stepName === 'ready') && (!exportDataItem?.exportstate || exportDataItem?.exportstate === 'readyrun' || exportDataItem?.exportstate === 'running')))

      // 进度条
      if (key === 'stepName') {
        this.vIf($exportProgress, (stepName === 'running' || stepName === 'ready' || stepName === 'success' || stepName === 'error' || stepName === 'ext_readyrun' || stepName === 'ext_running'))
      }
      if (key === 'percentage' || key === 'stepName') {
        this.vIf($exportProgressText, percentage < 100)
        if (percentage >= 100) {
          this.vText($exportProgressText, `100%`)
          $exportProgressInner.setAttribute('style', `width: 100%`)

          if (stepName === 'success') {
            $exportProgressInner.classList.add('success')
          } else if (stepName === 'error') {
            $exportProgressInner.classList.add('error')
          }
        } else {
          this.vText($exportProgressText, `${percentage}%`)
          $exportProgressInner.setAttribute('style', `width: ${percentage}%`)

          $exportProgressInner.classList.remove('success')
          $exportProgressInner.classList.remove('error')
        }
      }


      if (key === 'stepName') {
        this.vIf($exportSectionWrap, stepName !== 'initial')
        this.vIf($exportBtnwrap, stepName === 'initial')
        this.vIf($exportTip, (stepName === 'running' || stepName === 'ready' || stepName === 'ext_readyrun' || stepName === 'ext_running' || stepName === 'success'))
      }

      if (key === 'resultMessage') {
        this.vIf($exportResult, !!resultMessage)
        this.vText($exportResult, resultMessage)
      }
      if (key === 'stepName') {
        if (stepName === 'success') {
          $exportResult.classList.add('success')
        } else if (stepName === 'error') {
          $exportResult.classList.add('error')
        } else {
          $exportResult.classList.remove('success')
        }
      }

      if (key === 'exportcontent') {
        if (exportcontent === 'link') {
          $fileimg.classList.add('zip')
          $fileimg.classList.remove('excel')
        } else {
          $fileimg.classList.add('excel')
          $fileimg.classList.remove('zip')
        }
      }

      if (key === 'fileName' || key === 'filetype' || key === 'exportcontent') {
        const fileNameWithSuffix = fixFileName(fileName, filetype, exportcontent)
        this.vText($filename, fileNameWithSuffix)
      }
      if (key === 'fileSize') {
        this.vText($filesize, fileSize)
      }

      if (key === 'isOldVersionService' || key === 'runningTaskCount') {
        const flag = !isOldVersionService && runningTaskCount > 0
        this.vIf($wait, flag)
        if (flag) {
          this.vText($waitSpan, runningTaskCount)
        } else {
          this.vText($waitSpan, '')
        }
      }


    })
    this.data.fileName = this.props.sheetname

    this.initEvent()

    this.getExpandexpConfig()
  }

  vText (ele: any, text: string) {
    const oldValue = ele.innerHTML || ''
    const newValue = text || ''
    if (oldValue !== newValue) {
      // console.log(newValue)
      ele.innerHTML = newValue
    }
  }

  vIf (ele: any, flag: boolean) {
    const elc = ele.classList
    if (flag) {
      elc.contains('hide') && elc.remove('hide')
    } else {
      !elc.contains('hide') && elc.add('hide')
    }
  }

  vOp (ele: any, flag: boolean) {
    const elc = ele.classList
    if (flag) {
      elc.contains('opacity0') && elc.remove('opacity0')
    } else {
      !elc.contains('opacity0') && elc.add('opacity0')
    }
  }

  initData (data: any, setCallback: any) {
    this.data = cloneDeep(data)
    const dataP = cloneDeep(data)
    for (const x in dataP) {
      Object.defineProperty(this.data, x, {
        get: function getter () {
          // console.log('get!')
          return dataP[x]
        },
        set: function getter (value) {
          // console.log('set!')
          dataP[x] = value
          setCallback(x, value)
        }
      })
      // console.log(x)
      this.data[x] = dataP[x]
    }
  }

  initProps () {
    const attributes = getAttributes(this)
    this.props = {
      ...this.defaultProps,
      ...attributes
    }
    // console.log('attributes', attributes)
    if (this.props.mergedata) {
      this.props.mergedata = JSON.parse(this.props.mergedata)
    }
    console.log('this.props', this.props)
  }

  initEvent () {
    // this.shadow.querySelector('.spu-expandexp')!.addEventListener('click', (e) => {
    //   // console.log(this)
    //   // console.log(this.shadow)
    //   console.log(e)
    //   console.log(e.target)
    //   console.log(e.target.nodeName)
    //   debugger

    //   this.dispatchEvent(new CustomEvent('click', {
    //     detail: {
    //       clickMessage: 'Hello from within the Custom Element'
    //     }
    //   }))
    // }, true)

    this.shadow.querySelector('.modal-th .close')!.addEventListener('click', () => {
      this.removeSelf()
    })

    this.shadow.querySelector('.export-file .export-file-r-download')!.addEventListener('click', () => {
      this.handleDownload()
    })

    this.shadow.querySelector('.export-file .export-file-r-cancel')!.addEventListener('click', () => {
      // this.handleCencel()
      const ele = this.shadow.querySelector('.spu-expandexp-confirm')
      this.vIf(ele, true)
    })


    this.shadow.querySelector('.spu-expandexp-confirm-modal-th-close')!.addEventListener('click', () => {
      const ele = this.shadow.querySelector('.spu-expandexp-confirm')
      this.vIf(ele, false)
    })

    this.shadow.querySelector('.spu-expandexp-confirm-modal-cancel')!.addEventListener('click', () => {
      const ele = this.shadow.querySelector('.spu-expandexp-confirm')
      this.vIf(ele, false)
    })

    this.shadow.querySelector('.spu-expandexp-confirm-modal-confirm')!.addEventListener('click', () => {
      this.handleCencel()
    })



    this.shadow.querySelector('.export-btn')!.addEventListener('click', () => {
      // console.log('导出')
      this.handleExport()
      // this.data.percentage = this.data.percentage + 20
      // this.data.isOldVersionService = false
      // this.data.runningTaskCount = 1
      // this.data.runningTaskCount = 1
      // this.data.fileSize = dealFileSize('')
    })
  }

  async getExpandexpConfig () {
    let isInstallexpandexp = await core.checkModule('expandexp')
    // isInstallexpandexp = false
    console.log('isInstallexpandexp', isInstallexpandexp)

    if (isInstallexpandexp) {
      this.data.expandStatus = '3'
      this.data.filewatermark = '1'
      this.data.iscompress = '1'

      // 这个单个查询接口返回的filewatermark已经结合了全局水印开关 因此不需要查询全局水印
      Module.apiRequest({
        modulekey: 'expandexp',
        apitag: 'imageConfig-getByPageCode',
        body: {
          pagecode: this.props.pagecode
        },
        complete: (code: any, data: any, msg: any) => {
          // console.log('imageConfig', code, data, msg)
          if (code === 200) {
            this.data.exportcontentArray = data.exportcontent
            // this.data.exportcontentArray = ['photo']
            if (this.data.exportcontentArray?.length > 0) {
              this.data.exportcontent = this.data.exportcontentArray[0]
            } else {
              this.data.exportcontent = 'excel'
            }
            this.data.filewatermarkGlobalConfig = data.filewatermark.toString()
            this.data.filewatermark = data.filewatermark.toString()
            this.data.iscompress = data.iscompress.toString()
            this.data.imagesizepercolumn = data.imagesizepercolumn.toString()
            this.data.imageheightcm = data.imageheightcm.toString()

            this.data.exportConfigInit = true
          }
        }
      })
      this.sendLog({
        types: 'exportopenmodal',
        event: 'exportopenmodal'
      })
    } else {
      apaasAxios
        .post('/api/expandexp/global/searchExpGloConfig', {
          key: 'export-config-switch',
          tenantcode: login.getUser('tenantcode'),
          productcode: login.getUser('productcode')
        }, {}, {
          isShowLoading: false
        })
        .then((res: any) => {
          // res.data.exttype = '1'
          // res.data.exttype: 2开启了为服务端导出 1为普通导出
          if (res.code === 200 && res?.data?.exttype === '2') {
            this.data.expandStatus = '2'
          } else {
            this.data.expandStatus = '1'
          }
        })
        .catch((err: Error) => {
          this.data.expandStatus = '1'
        }).finally(() => {
          // 发送日志
          this.sendLog({
            types: 'exportopenmodal',
            event: 'exportopenmodal'
          })

          if (this.data.expandStatus === '1') {
            this.data.exportcontentArray = ['excel']
            this.data.exportcontent = 'excel'
            this.data.filewatermark = '0'
            this.data.iscompress = '0'

            this.data.exportConfigInit = true
          } else if (this.data.expandStatus === '2') {
            this.data.iscompress = '1'

            // 获取文件水印开关
            apaasAxios
              .post('/api/expandexp/global/searchWatermarkConfig', '', {
                isShowLoading: false
              })
              .then((res: any) => {
                if (res.code === 200 && res?.data?.configjson) {
                  this.data.filewatermarkGlobalConfig = JSON.parse(res.data.configjson).isWatermark === '1' ? '1' : '0'
                } else {
                  this.data.filewatermarkGlobalConfig = '0'
                }
              })
              .catch(() => {
                this.data.filewatermarkGlobalConfig = '0'
              }).finally(() => {
                this.data.filewatermark = this.data.filewatermarkGlobalConfig === '1' ? '1' : '0'
                this.data.exportConfigInit = true
              })
          }
        })
    }
  }

  getExportcontentValue () {
    let result = ''
    const eles = this.shadow.querySelectorAll('.export-sel-con input[type=radio][name=exportcontent]') as any
    // console.log(eles)
    for (let i = 0, len = eles.length; i < len; i++) {
      if (eles[i].checked === true) {
        result = eles[i].value
        break
      }
    }
    return result
  }

  async handleExport () {
    this.updateStep('ready')
    this.data.fileSize = dealFileSize('')

    const exportcontent = this.getExportcontentValue()
    this.data.exportcontent = exportcontent

    const mergedata = cloneDeep(this.props.mergedata)
    const post = {
      expfile: {
        pagecode: this.props.pagecode,
        sheetname: this.props.sheetname,
        filename: fixFileName(this.data.fileName, this.data.filetype, this.data.exportcontent),
        filetype: this.data.filetype,
        // exttype 1.普通导出，2.服务端导出
        // 如果为1 或没有这个属性，视为不拓展，前端做兼容
        // 如果是仅导出单据 默认走普通导出 exttype = '1'
        // 因为如果仅导出单据 + 支持水印，又要传 exttype = '2'，很麻烦，改为后端处理，如果 expandStatus = 2 | 3 ，exttype就传2，其他情况传1
        // exttype: (config.exportcontentValue === 'excel' || config.expandStatus === '1') ? '1' : '2',
        exttype: this.data.expandStatus === '1' ? '1' : '2',
        // 扩展导出参数
        extconfig: {
          filetype: this.data.filetype,
          exportcontent: exportcontent,
          filewatermark: this.data.filewatermark,
          iscompress: this.data.iscompress,
          displaytype: this.data.displaytype,
          imagetype: this.data.imagetype,
          imagename: this.data.imagename,
          imagesizepercolumn: this.data.imagesizepercolumn,
          imageheightcm: this.data.imageheightcm
        }
      }
    }
    const finallyPost = mergedata ? merge(mergedata, post) : post
    apaasAxios
      .post(this.props.exportapi, finallyPost)
      .then((res: any) => {
        // console.log(res)
        const result = res?.data
        if (result?.code === 200 && result?.data) {
          this.data.exportId = result.data
          this.data.percentage = 0
          // 到ready
          this.updateStep('ready')
          this.statusTimer = window.setInterval(() => {
            this.updateStatus()
          }, 2000)
        } else {
          this.updateStep('error')
          this.data.percentage = 100
          this.data.resultMessage = result?.msg || '网络连接错误'
          this.stopInterval()
        }
      })
      .catch((error: any) => {
        // console.log(error)
        // debugger
        this.updateStep('error')
        this.data.percentage = 100
        this.data.resultMessage = '网络连接错误'
        this.stopInterval()
      })

    this.sendLog({
      types: 'exportclickbutton',
      event: 'exportclickbutton',
      properties: {
        bizdata: {
          exportapi: this.props.exportapi,
          params: finallyPost
        }
      }
    })
  }

  handleDownload () {
    // console.log(this.data)
    // console.log(this.data.exportDataItem)

    let fixExportFileUrl = this.data.exportDataItem.exportfileurl[0] === '/' ? this.data.exportDataItem.exportfileurl : '/' + this.data.exportDataItem.exportfileurl
    let exportFileName = this.data.exportDataItem.filename
    let date = this.data.exportDataItem.initdate

    // console.log({
    //   type: 'att',
    //   source: fixExportFileUrl,
    //   datetime: date,
    //   storagetype: 'storage-1d',
    //   filename: exportFileName
    // })

    const params = {
      type: 'att',
      source: fixExportFileUrl,
      datetime: date,
      storagetype: 'storage-1d',
      filename: exportFileName
    }

    downloadService.downloadFile(params as any)

    // 发送日志
    this.sendLog({
      types: 'exportdownloadfile',
      event: 'exportdownloadfile',
      properties: {
        bizdata: {
          params: params
        }
      }
    })
  }

  async handleTest () {
    console.log(this.data)
    console.log(this.data.exportDataItem)

    // const file = {
    //   "fixExportFileUrl": "/23e/att/20240523/1656688/23eea1bb-cb5a-40b7-a411-4b3ef2439b4c.xlsx",
    //   "date": "1716458086237",
    //   "exportFileName": "终端进离-统计.xlsx",
    //   "type": "att",
    //   "storage": "storage-1d"
    // }

    // const imgUrl = await downloadService.downloadFile({
    //   type: 'att',
    //   // source: file.fixExportFileUrl,
    //   source: '23eea1bb-cb5a-40b7-a411-4b3ef2439b4c.xlsx',
    //   datetime: '1716458086237',
    //   storagetype: 'storage-1d',
    //   filename: '终端进离-统计.xlsx'
    // })
    // console.log(imgUrl)

    // DownloadService.downloadFile(this, fixExportFileUrl, date, exportFileName, 'att', 'storage-1d')
  }

  handleCencel () {
    const $message = this.shadow.querySelector('.spu-expandexp-message') as any
    // this.vText($message, '取消成功！')
    // this.vIf($message, true)
    // this.vOp($message, true)
    // $message.classList.add('success')
    // setTimeout(() => {
    //   this.vOp($message, false)
    //   setTimeout(() => {
    //     this.vIf($message, false)
    //   }, 1000)
    // }, 1500)
    // return false
    // console.log(this.data)
    // console.log(this.data.exportDataItem)

    apaasAxios
      .post('/api/teapi/queue/impexp/cancel', {
        dynamicid: this.data.exportId
      })
      .then((res: any) => {
        if (res?.code === 200 && res?.data) {
          // 取消成功
          this.updateStep('cancel')
          this.data.resultMessage = '任务已取消'
          this.vText($message, '取消成功！')
          this.vIf($message, true)
          this.vOp($message, true)
          $message.classList.add('success')
        }
      })
      .catch((error: any) => {
        this.vText($message, '取消失败！')
        this.vIf($message, true)
        this.vOp($message, true)
        $message.classList.add('error')
      })
      .finally(() => {
        const ele = this.shadow.querySelector('.spu-expandexp-confirm')
        this.vIf(ele, false)

        setTimeout(() => {
          this.vOp($message, false)
          setTimeout(() => {
            this.vIf($message, false)
          }, 2000)
        }, 2000)

      })
  }

  updateStep (statusName: string) {
    if (statusName === 'next') {
      this.data.step.next()
    } else {
      this.data.step.go(statusName)
    }
    this.data.stepStatus = this.data.step.status
    this.data.stepName = this.data.step.statusName
    this.data.stepText = this.data.step.statusText
  }

  async updateStatus () {
    apaasAxios
      .post(`/api/teapi/queue/impexp/expStatus?dynamicid=${this.data.exportId}`, {}, {
        isShowLoading: false
      })
      .then((res: any) => {
        let responseData = res?.data?.states
        let currentData = null
        if (!responseData) {
          this.data.isOldVersionService = true
          return
        } else {
          if (Array.isArray(responseData)) {
            this.data.isOldVersionService = true
            if (responseData.length > 1) {
              responseData = responseData.filter((item: any) => {
                return item.dynamicid === this.data.exportId
              })
            }
            currentData = responseData[0]
          } else {
            this.data.isOldVersionService = false
            this.data.runningTaskCount = responseData.queuesize
            if (responseData.states && responseData.states.length > 1) {
              responseData.states = responseData.states.filter((item: any) => {
                return item.dynamicid === this.data.exportId
              })
            }
            currentData = responseData.states && responseData.states[0]
          }
        }
        if (!currentData) {
          return
        }

        if (currentData.exportstate === 'complete') {
          const data = currentData
          this.data.percentage = 100
          if (data.errorfileurl || data.fatalerrormsg) {
            this.updateStep('error')
          } else {
            this.updateStep('success')
          }
          if (data.filesize) {
            // 普通导出服务返回 4000 服务端导出返回 4kb
            // 这里做兼容处理
            this.data.fileSize = dealFileSize(data.filesize)
          }
          this.data.exportDataItem = data
          this.data.resultMessage = dealResultMessage(data)
          this.stopInterval()
        } else if (currentData.exportstate === 'readyrun') {
          this.updateStep('ready')
        } else if (currentData.exportstate === 'fatalerror') {
          this.data.percentage = 100
          this.updateStep('error')
          this.data.resultMessage = dealResultMessage(currentData)
          this.stopInterval()
        } else if (currentData.exportstate === 'cancel') {
          this.updateStep('cancel')
          this.data.resultMessage = '任务取消'
          // this.stopInterval()
        } else if (currentData.exportstate === 'ext_readyrun') {
          this.updateStep('ext_readyrun')
          currentData && (this.data.percentage = +currentData.finishRate * 0.5 + 50)
        } else if (currentData.exportstate === 'ext_running') {
          this.updateStep('ext_running')
          currentData && (this.data.percentage = +currentData.finishRate * 0.5 + 50)
        } else {
          this.updateStep('running')
          if (currentData) {
            // this.data.percentage = +currentData.finishRate
            if (this.data.expandStatus === '1') {
              this.data.percentage = +currentData.finishRate
            } else {
              this.data.percentage = +currentData.finishRate * 0.5
            }
          }
        }
      })
      .catch((err: any) => {
        console.error(err)
        this.updateStep('error')
        this.data.percentage = 100
        if (err.status === 0) {
          this.data.resultMessage = '网络链接错误'
          this.stopInterval()
        }
      })
  }

  stopInterval () {
    if (this.statusTimer) {
      window.clearInterval(this.statusTimer)
      this.statusTimer = null
    }
  }

  sendLog (data: any) {
    apaasSpuTrackSendLog(merge({
      // types: 'exportdownloadfile',
      // event: 'exportdownloadfile',
      properties: {
        formtype: 'spu',
        exporttype: this.data.expandStatus,
        pagecode: this.props.pagecode
      }
    }, data))
  }

  removeSelf () {
    this.parentNode!.removeChild(this)
  }

  attributeChangedCallback (name: any, oldValue: any, newValue: any) {
    console.log('属性变化', name, oldValue, newValue)
  }

  // 当组件从 DOM 文档移除后调用。
  disconnectedCallback () {
    this.stopInterval()
    // console.log('disconnectedCallback')
    // setTimeout(() => {
    //   console.log(this)
    // }, 100)
  }
}

class Expandexp {
  ele!: HTMLElement
  config!: any

  constructor (config: any) {
    SpuExpandexp.register()
    this.config = config
    this.ele = document.createElement('spu-expandexp')

    if (this.config) {
      for (const x in this.config) {
        if (x === 'mergedata' && this.config[x]) {
          if (this.config[x]) {
            this.ele.setAttribute(x, JSON.stringify(this.config[x]))
          }
        } else {
          this.ele.setAttribute(x, this.config[x])
        }
      }
    }

    // console.log(this.ele)
    document.body.appendChild(this.ele)
  }

  // close () {
  //   if (this.ele) {
  //     document.body.removeChild(this.ele)
  //   }
  // }
}

const expandexp = (config: any) => {
  new Expandexp(config)
}

export {
  expandexp
}
