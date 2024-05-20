<template>
  <div class="spu-export">
    <div
      v-if="!state.isOldVersionService && state.runningTaskCount > 0"
      style="text-align: center; justify-content: center"
      class="el-alert el-alert--error is-light"
    >
      <div class="el-alert__content">
        <span
          class="el-alert__title"
          v-html="
            `导出等待队列中：还有<span style='color: #f5222d;'> ${state.runningTaskCount} </span>位，请耐心稍等...`
          "
        ></span>
      </div>
    </div>

    <section class="title-container">
      <section class="title-tip-container">{{ step.statusText }}</section>
    </section>

    <div class="select-container" v-if="config.expandStatus !== '1' && step.statusName === 'initial'">
      <section class="title">请选择导出内容</section>
      <div>
        <el-radio-group class="column-checkbox-group" v-model="extconfigParams.exportcontent">
          <el-radio v-for="option in exportcontentOptions" :key="option.value" :label="option.value">{{
            option.label
          }}</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="select-container" v-if="config.expandStatus == '1' && step.statusName === 'initial'">
      <section class="title">请选择导出文件类型</section>
      <div>
        <el-radio-group class="column-checkbox-group" v-model="extconfigParams.filetype">
          <el-radio v-for="option in filetypeOptions" :key="option.value" :label="option.value">{{
            option.label
          }}</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="file-container" v-if="step.statusName !== 'initial'">
      <!-- <div class="file-container"> -->
      <div class="file-msg-container">
        <span class="name">
          <span style="padding-right: 10px" v-if="extconfigParams.exportcontent === 'link'">
            <img style="width: 24px" src="./icons/icon_zip.png" />
          </span>
          <span style="padding-right: 10px" v-else>
            <img style="width: 24px" v-if="extconfigParams.filetype === '1'" src="./icons/icon_excel.png" />
            <img style="width: 24px" v-else-if="extconfigParams.filetype === '2'" src="./icons/icon_csv.png" />
            <img style="width: 24px" v-else-if="extconfigParams.filetype === '3'" src="./icons/icon_pdf.png" />
          </span>
          <span class="name-text">{{ filename }}</span>
        </span>
        <span class="size">{{ state.fileSize }}</span>
      </div>
      <el-button
        size="small"
        v-if="(step.statusName === 'error' || step.statusName === 'success') && state.exportDataItem.exportfileurl"
        style="float: right; position: absolute; right: 15px; top: 16px"
        type="primary"
        :class="{
          'success-color': step.statusName === 'success',
          'error-color': step.statusName === 'error'
        }"
        @click="downloadResultFile"
      >
        下载
      </el-button>
      <!-- 取消 -->
      <span
        class="self-icon icon-close status-icon delete-icon"
        @click="cancelHandler"
        v-if="
          (step.statusName === 'running' || step.statusName === 'ready') &&
          (!state.exportDataItem.exportstate ||
            state.exportDataItem.exportstate === 'readyrun' ||
            state.exportDataItem.exportstate === 'running')
        "
      />
      <el-progress
        v-if="
          step.statusName === 'running' ||
          step.statusName === 'success' ||
          step.statusName === 'error' ||
          step.statusName === 'ext_readyrun' ||
          step.statusName === 'ext_running'
        "
        :percentage="state.percentage"
        :stroke-width="8"
        :show-text="state.percentage == 100 ? false : true"
        :status="
          state.percentage != 100
            ? ''
            : step.statusName == 'success'
            ? 'success'
            : step.statusName == 'error'
            ? 'exception'
            : ''
        "
      />

      <div
        :class="{
          'result-container': true,
          success: step.statusName === 'success',
          error: step.statusName === 'error'
        }"
        v-if="state.resultMessage"
      >
        {{ state.resultMessage }}
      </div>
      <div
        class="result-tip"
        v-if="
          step.statusName === 'running' ||
          step.statusName === 'ready' ||
          step.statusName === 'ext_readyrun' ||
          step.statusName === 'ext_running' ||
          step.statusName === 'success'
        "
      >
        您可以随时关闭该弹框，之后在导入导出列表中查看结果。
      </div>
    </div>

    <div class="btnwrap" v-if="step.statusName === 'initial'">
      <el-button type="primary" @click="handleExport">导出</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  watchEffect,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onBeforeMount,
  PropType,
  reactive,
  ref
} from 'vue'
import { Step } from './step'
import { merge } from 'lodash-es'
import {
  apaasAxios,
  spuAxios,
  getUniqueid,
  spuConfig,
  downloadService,
  getUser,
  lsProxy
} from '@smart100/spu-web-plugin'
import { dealResultMessage } from './util'
import { dealFileSize } from './util'
import { downloadFileForUrl } from '@/utils/index'

const props = withDefaults(
  defineProps<{
    exportApi: string
    sheetname: string
    pagecode?: string
    data?: any
  }>(),
  {
    sheetname: '',
    pagecode: '',
    data: {}
  }
)

const config = reactive({
  expandStatus: '1', // 1普通导出（没有做图片导出服务） 2服务端导出（做了图片导出服务未SPU化） 3安装了图片导出SPU
  exportcontentArray: ['excel', 'link', 'photo'], // 当 expandStatus = 2 | 3时才显示导出内容给用户选择
  // 新导出的文件类型选择
  filetypeArray: ['1', '2']
})

const extconfigParams = reactive<any>({
  filetype: '1', // 导出文件类型 1: xls 2: csv 3: pdf 目前spu的导出只实现了xls 因此写死xls
  exportcontent: 'excel', // excel.仅导出单据，link,导出单据和本地链接，photo.导出单据和图片
  filewatermark: '0', // 1.开启文件水印，0.关闭文件水印
  iscompress: '0', // 1.压缩，0.原图
  displaytype: 'horizontal', // horizontal:横向排列 vertical:纵向排列 multi-row:分行展示
  imagetype: 'origin', // 导出图片类型 png jpg origin 默认origin
  imagename: '', // 图片命名规则
  // imagesizepercolumn 和 imageheightcm 为 图片导出SPU新增配置项
  imagesizepercolumn: '5',
  imageheightcm: '2'
})

const filename = computed(() => {
  let filename = ''
  if (extconfigParams.exportcontent === 'link') {
    filename = props.sheetname + '.zip'
  } else {
    if (extconfigParams.filetype === '1') {
      filename = props.sheetname + '.xlsx'
    } else if (extconfigParams.filetype === '2') {
      filename = props.sheetname + '.csv'
    } else if (extconfigParams.filetype === '3') {
      filename = props.sheetname + '.pdf'
    }
  }
  return filename
})

const exportcontentOptions = computed(() => {
  const mapTitle: any = {
    excel: '仅导出单据',
    link: '导出单据和本地链接',
    photo: '导出单据和图片'
  }
  return config.exportcontentArray.map((item) => {
    return {
      label: mapTitle[item],
      value: item
    }
  })
})

const filetypeOptions = computed(() => {
  const mapTitle: any = {
    '1': 'xlsx',
    '2': 'csv',
    '3': 'pdf'
  }
  const options = config.filetypeArray.map((item) => {
    return {
      label: mapTitle[item],
      value: item
    }
  })
  if (extconfigParams.exportcontent === 'link' || extconfigParams.exportcontent === 'photo') {
    return options.filter((v) => {
      return v.value !== '2' && v.value !== '3'
    })
  } else {
    return options
  }
})

watchEffect(() => {
  if (extconfigParams.exportcontent === 'link' || extconfigParams.exportcontent === 'photo') {
    // 当选择了 link 或者 photo 时 文件类型只能选择导出xlsx
    extconfigParams.filetype = '1'
  }
})

const step = ref(new Step())

const state = reactive<any>({
  percentage: 0,
  resultMessage: '',
  exportDataItem: {},
  exportId: '',
  fileSize: '',
  runningTaskCount: 0,
  isOldVersionService: false
})

// 获取导出服务配置
const getConfig = async () => {
  let isInstallexpandexp = false
  // isInstallexpandexp = true
  if (window?.Module?.checkPermission) {
    isInstallexpandexp = window.Module.checkPermission({
      modulekey: 'expandexp'
    })
  }

  if (isInstallexpandexp) {
    config.expandStatus = '3'
    config.filetypeArray = ['1']
    extconfigParams.filewatermark = '1'
    extconfigParams.iscompress = '1'

    if (window?.Module?.apiRequest) {
      console.log('调用 window.Module.apiRequest')
      window.Module.apiRequest({
        modulekey: 'expandexp',
        apitag: 'imageConfig-getByPageCode',
        body: {
          pagecode: props.pagecode
        },
        complete: (code: any, data: any, msg: any) => {
          // console.log('imageConfig', code, data, msg)
          if (code === 200) {
            config.exportcontentArray = data.exportcontent

            extconfigParams.iscompress = data.iscompress.toString()
            extconfigParams.filewatermark = data.filewatermark.toString()
            extconfigParams.imagesizepercolumn = data.imagesizepercolumn.toString()
            extconfigParams.imageheightcm = data.imageheightcm.toString()
          }
        }
      })
    } else {
      apaasAxios
        .post('/api/expandexp/v1.0/imageConfig/getByPageCode', {
          pagecode: props.pagecode
        })
        .then((res: any) => {
          // console.log(res)
          // debugger
          if (res?.data?.code === 200 && res?.data?.data) {
            const data = res.data.data
            config.exportcontentArray = data.exportcontent

            extconfigParams.iscompress = data.iscompress.toString()
            extconfigParams.filewatermark = data.filewatermark.toString()
            extconfigParams.imagesizepercolumn = data.imagesizepercolumn.toString()
            extconfigParams.imageheightcm = data.imageheightcm.toString()
          }
        })
    }
  } else {
    extconfigParams.filewatermark = '0'
    extconfigParams.iscompress = '0'
    apaasAxios
      .post('/api/expandexp/global/searchExpGloConfig', {
        key: 'export-config-switch',
        tenantcode: getUser('tenantcode'),
        productcode: getUser('productcode')
      })
      .then((res: any) => {
        // res.data.exttype = '1'
        // res.data.exttype: 2开启了为服务端导出 1为普通导出
        if (res.code === 200 && res?.data?.exttype === '2') {
          config.expandStatus = '2'
          config.filetypeArray = ['1']
        } else {
          config.expandStatus = '1'
          config.filetypeArray = ['1', '2']
        }
      })
      .catch((err: Error) => {
        config.expandStatus = '1'
        config.filetypeArray = ['1', '2']
      })
    // 获取文件水印开关
    apaasAxios
      .post('/api/expandexp/global/searchWatermarkConfig', '')
      .then((res: any) => {
        if (res.code === 200 && res?.data?.configjson) {
          extconfigParams.filewatermark = JSON.parse(res.data.configjson).isWatermark === '1' ? '1' : '0'
        } else {
          extconfigParams.filewatermark = '0'
        }
      })
      .catch(() => {
        extconfigParams.filewatermark = '0'
      })
  }
}

let statusTimer: number | null = null

const handleExport = async () => {
  // window.setInterval(() => {
  //   step.value.next()
  // }, 2000)
  // return false

  step.value.next()
  state.fileSize = dealFileSize('')

  // console.log({
  //   expfile: {
  //     pagecode: props.pagecode,
  //     sheetname: props.sheetname,
  //     filename: filename.value,
  //     filetype: extconfigParams.filetype,
  //     // exttype 1.普通导出，2.服务端导出
  //     // 如果为1 或没有这个属性，视为不拓展，前端做兼容
  //     // 如果是仅导出单据 默认走普通导出 exttype = '1'
  //     // 因为如果仅导出单据 + 支持水印，又要传 exttype = '2'，很麻烦，改为后端处理，如果 expandStatus = 2 | 3 ，exttype就传2，其他情况传1
  //     // exttype: (config.exportcontentValue === 'excel' || config.expandStatus === '1') ? '1' : '2',
  //     exttype: config.expandStatus === '1' ? '1' : '2',
  //     // 扩展导出参数
  //     extconfig: {
  //       ...extconfigParams
  //     }
  //   }
  // })
  // debugger

  const post = merge(props.data, {
    expfile: {
      pagecode: props.pagecode,
      sheetname: props.sheetname,
      filename: filename.value,
      filetype: extconfigParams.filetype,
      // exttype 1.普通导出，2.服务端导出
      // 如果为1 或没有这个属性，视为不拓展，前端做兼容
      // 如果是仅导出单据 默认走普通导出 exttype = '1'
      // 因为如果仅导出单据 + 支持水印，又要传 exttype = '2'，很麻烦，改为后端处理，如果 expandStatus = 2 | 3 ，exttype就传2，其他情况传1
      // exttype: (config.exportcontentValue === 'excel' || config.expandStatus === '1') ? '1' : '2',
      exttype: config.expandStatus === '1' ? '1' : '2',
      // 扩展导出参数
      extconfig: {
        ...extconfigParams
      }
    }
  })
  apaasAxios
    .post(props.exportApi, post)
    .then((res: any) => {
      // console.log(res)
      // debugger
      if (res?.data?.code === 200 && res?.data?.data) {
        state.exportId = res.data.data
        state.percentage = 0
        // 到ready
        step.value.go('ready')
        nextTick(() => {
          updateStatus()
        })
        statusTimer = window.setInterval(() => {
          updateStatus()
        }, 2000)
      } else {
        step.value.go('error')
        state.percentage = 100
        state.resultMessage = res?.data?.msg || '网络连接错误'
        stopInterval()
      }
    })
    .catch((error: any) => {
      // debugger
      step.value.go('error')
      state.percentage = 100
      state.resultMessage = '网络连接错误'
      // if (!error || error.response.status === 0 || error.response.status === 404) {
      //   state.resultMessage = '网络连接错误'
      // } else {
      //   state.resultMessage = '网络连接错误'
      // }
      stopInterval()
    })
}

const updateStatus = async () => {
  apaasAxios
    .post(`/api/teapi/queue/impexp/expStatus?dynamicid=${state.exportId}`)
    .then((res: any) => {
      let responseData = res?.data?.states
      let currentData = null
      if (!responseData) {
        state.isOldVersionService = true
        return
      } else {
        if (Array.isArray(responseData)) {
          state.isOldVersionService = true
          if (responseData.length > 1) {
            responseData = responseData.filter((item: any) => {
              return item.dynamicid === state.exportId
            })
          }
          currentData = responseData[0]
        } else {
          state.isOldVersionService = false
          state.runningTaskCount = responseData.queuesize
          if (responseData.states && responseData.states.length > 1) {
            responseData.states = responseData.states.filter((item: any) => {
              return item.dynamicid === state.exportId
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
        state.percentage = 100
        if (data.errorfileurl || data.fatalerrormsg) {
          step.value.go('error')
        } else {
          step.value.go('success')
        }
        if (data.filesize) {
          // 普通导出服务返回 4000 服务端导出返回 4kb
          // 这里做兼容处理
          state.fileSize = dealFileSize(data.filesize)
        }
        state.exportDataItem = data
        state.resultMessage = dealResultMessage(data)
        stopInterval()
      } else if (currentData.exportstate === 'readyrun') {
        step.value.go('ready')
      } else if (currentData.exportstate === 'fatalerror') {
        state.percentage = 100
        step.value.go('error')
        state.resultMessage = dealResultMessage(currentData)
        stopInterval()
      } else if (currentData.exportstate === 'cancel') {
        console.log('cancel')
      } else if (currentData.exportstate === 'ext_readyrun') {
        step.value.go('ext_readyrun')
        if (currentData) {
          state.percentage = +currentData.finishRate * 0.5 + 50
        }
      } else if (currentData.exportstate === 'ext_running') {
        step.value.go('ext_running')
        // debugger
        if (currentData) {
          state.percentage = +currentData.finishRate * 0.5 + 50
        }
      } else {
        step.value.go('running')
        if (currentData) {
          state.percentage = +currentData.finishRate * 0.5
          // state.percentage = +currentData.finishRate
        }
      }
    })
    .catch((err: any) => {
      console.error(err)
      step.value.go('error')
      state.percentage = 100
      if (err.status === 0) {
        state.resultMessage = '网络链接错误'
        stopInterval()
      }
    })
}

const downloadResultFile = async () => {
  // // 下载错误的数据
  // let fixExportFileUrl = this.exportDataItem.exportfileurl[0] === '/' ? this.exportDataItem.exportfileurl : '/' + this.exportDataItem.exportfileurl
  // let exportFileName = this.exportDataItem.filename
  // let date = this.exportDataItem.initdate
  // DownloadService.downloadFile(this, fixExportFileUrl, date, exportFileName, 'att', 'storage-1d')

  const fixExportFileUrl =
    state.exportDataItem.exportfileurl[0] === '/'
      ? state.exportDataItem.exportfileurl
      : '/' + state.exportDataItem.exportfileurl
  const exportFileName = state.exportDataItem.filename
  // const date = state.exportDataItem.initdate + ''
  // downloadFile(fixExportFileUrl, date, {
  //   storage: 'storage-1d',
  //   uploadType: 'att',
  //   fileName: exportFileName
  // })

  const cloudserv: any = JSON.parse(lsProxy.getItem('cloudserv') as string)
  const endpoint = cloudserv?.storage?.cloudserv_storage_storageendpoint
  const bucket = cloudserv?.storage?.cloudserv_storage_storagebucket
  downloadFileForUrl(`https://${bucket}.${endpoint}${fixExportFileUrl}`, exportFileName)
}

const cancelHandler = () => {
  // ElMessageBox.confirm('确认是否取消该任务？', '提示', {
  //   distinguishCancelAndClose: true,
  //   confirmButtonText: '确定取消',
  //   cancelButtonText: '放弃'
  // })
  //   .then(async () => {
  //     try {
  //       await cancelFormImportExport(state.exportId)
  //       step.value.go('cancel')
  //       state.resultMessage = $t('任务已取消')
  //       ElMessage.success($t('任务已取消'))
  //     } catch (error) {
  //       window.$logger.error(error)
  //       ElMessage.error($t('删除失败'))
  //     }
  //   })
  //   .catch(() => { })
}

const stopInterval = () => {
  if (statusTimer) {
    window.clearInterval(statusTimer)
    statusTimer = null
  }
}

onBeforeMount(() => {
  getConfig()
})

onBeforeUnmount(() => {
  stopInterval()
})
</script>

<style lang="less">
.spu-export {
  padding: 0 12px;

  .title-container {
    display: flex;
    justify-content: space-between;
    vertical-align: baseline;
    align-content: space-between;
    .title-tip-container {
      line-height: 32px;
    }
  }

  .select-container {
    .title {
      margin-bottom: 20px;
      margin-top: 10px;
      position: relative;

      &:before {
        content: '*';
        display: inline;
        color: #e53c51;
        padding-right: 2px;
        font-size: 24px;
        vertical-align: middle;
        position: absolute;
        left: -12px;
        top: 1px;
      }
    }

    .error-tips {
      font-size: 12px;
      color: #e53c51;
      position: absolute;
      left: 0px;
      top: 18px;
    }

    .el-radio-group {
      width: 100%;
      padding-bottom: 10px;

      .el-radio {
        padding: 4px 0;
      }
    }

    .el-checkbox,
    .el-radio-wrapper {
      width: 50%;
      line-height: 2;
      margin-right: 0px;
    }

    .column-checkbox-container {
      display: block;

      .column-checkbox-group {
        width: 100%;
        display: block;
      }
    }

    .el-checkbox {
      display: inline-flex;
      margin-bottom: 8px;

      .el-checkbox__label {
        flex: 1;
        white-space: break-spaces;
      }
    }

    .select-all-columns {
      float: right;
    }
  }

  .file-container {
    border: 1px solid #d9d9d9;
    min-height: 98px;
    padding: 15px;
    position: relative;

    .file-msg-container {
      display: flex;
      margin-bottom: 10px;
      width: calc(100% - 72px);
      position: relative;
      justify-content: space-between;
      // align-items: baseline;
      align-content: center;

      .icon {
        font-size: 32px;
      }

      .self-icon {
        font-size: 28px;
      }

      .icon-inoutbox {
        color: #1989fa;
      }

      .name {
        line-height: 32px;
        height: 32px;
        margin-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;

        .name-text {
          margin-left: 4px;
          font-size: 14px;
          color: #333333;
        }
      }

      .size {
        line-height: 32px;
        white-space: nowrap;
        padding-right: 20px;
      }
    }

    .delete-icon {
      position: absolute;
      right: 15px;
      top: 26px;
      font-size: 22px;
      width: 22px;
      height: 22px;
      line-height: 22px;
      border-radius: 11px;
      color: #999;
      cursor: pointer;
      /*background: #d9d9d9;*/
      padding-top: 3px;
    }

    .status-icon {
      position: absolute;
      right: 15px;
      top: 26px;
      font-size: 22px;
      width: 22px;
      height: 22px;
      line-height: 22px;

      &.success-icon {
        color: #13ce66;
      }
    }

    .self-icon.icon-download {
      font-size: 13px;
    }

    .error-color {
      background: #e75b41;
    }

    .success-color {
      background: #00b389;
      border-color: #00b389;
    }

    .result-container {
      height: 28px;
      line-height: 28px;
      text-align: right;
      font-size: 12px;
      padding: 0px 8px;

      &.error {
        background: #fdf1ef;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &.success {
        background: #e5f7f3;
      }
    }

    .result-tip {
      height: 28px;
      line-height: 28px;
      margin-top: 8px;
      font-size: 12px;
      text-align: right;
      color: #999;
    }
  }

  .el-progress--line {
    .el-progress__text {
      display: none;
    }

    .el-progress-bar__outer {
      border-radius: 0px;
    }

    .el-progress-bar__inner {
      border-radius: 0px;
    }
  }

  .btnwrap {
    margin-top: 12px;
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
