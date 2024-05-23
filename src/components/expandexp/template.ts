import SpuExpandexp from './index'

export default (ele: SpuExpandexp) => {
  return `
<style>
:host {
  display: block;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0px;
  right: 0px;
  bottom: 0px;
}

.hide {
  display: none!important;
}

.spu-expandexp {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}




.modal {
  width: 80%;
  max-width: 800px;
  min-width: 500px;
  margin: 50px auto 0;
  border-radius: 2px;
  overflow: hidden;
}
.modal-th {
  height: 40px;
  background-color: #409eff;
}
.modal-th .title {
  float: left;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
  margin-left: 16px;
}
.modal-th .close {
  float: right;
  line-height: 40px;
  height: 40px;
  width: 40px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}
.modal-tb {
  padding: 16px;
  background-color: #fff;
}

.export {}
.export-wait {
  line-height: 32px;
  height: 32px;
  text-align: center;
  background-color: rgba(255, 73, 73, .1);
  color: #333;
}
.export-wait span {
  color: red;
  margin: 0 4px;
}
.export-tit {
  line-height: 32px;
  height: 32px;
}

.export-sel {
  margin-bottom: 12px;
}
.export-sel-title {
  margin-bottom: 12px;
}
.export-sel-con {
  display: flex;
}
.export-sel-con-item {
  margin-right: 32px;
  display: flex;
  cursor: pointer;
}
.export-sel-con-item label {
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
.export-sel-con-item input {
  cursor: pointer;
}

.export-section-wrap {}
.export-section {
  border: 1px solid #ddd;
  padding: 12px;
}

.export-file {
  height: 28px;
  line-height: 28px;
  display: flex;
  justify-content: space-between;
  // margin-bottom: 12px;
}
.export-file-l {
  flex: 1;
  display: flex;
}
.export-file-l img {
  flex: none;
  display: block;
  height: 28px;
  width: 28px;
  margin-right: 4px;
}
.export-file-l-filename {
  flex: 1;
}
.export-file-l-filesize {
  flex: none;
}
.export-file-r {
  display: flex;
  width: 80px;
  flex-direction: row-reverse;
}
.export-file-r-download {
  line-height: 26px;
  border-radius: 3px;
  background-color: #67c23a;
  border: 1px solid #67c23a;
  color: #fff;
  padding: 0 12px;
  font-size: 14px;
  cursor: pointer;
}
.export-file-r-download:hover {
  background: #85ce61;
  border-color: #85ce61;
}
.export-file-r-cancel {
  line-height: 26px;
  border-radius: 3px;
  color: #f56c6c;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  padding: 0 12px;
  font-size: 14px;
  cursor: pointer;
}
.export-file-r-cancel:hover {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}



.export-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}
.export-progress-outer {
  flex: 1;
  height: 8px;
  background-color: #EBEEF5;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
}
.export-progress-inner {
  animation-duration: 3s;
  height: 100%;
  width: 0;
  background-color: #417AE7;
  -webkit-transition: width .6s ease;
  transition: width .6s ease;
}
.export-progress-inner.error {
  background: red;
}
.export-progress-inner.success {
  background: #67C23A;
}
.export-progress-text {
  flex: none;
  width: 50px;
  font-size: 14px;
  line-height: 30px;
  text-align: right;
}



.export-result {
  height: 28px;
  line-height: 28px;
  text-align: right;
  font-size: 12px;
  padding: 0px 8px;
}
.export-result.error {
  background: #fdf1ef;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.export-result.success {
  background: #e5f7f3;
}


.export-tip {
  height: 28px;
  line-height: 28px;
  margin-top: 8px;
  font-size: 12px;
  text-align: right;
  color: #999;
}

.export-btnwrap {
  margin-top: 12px;
  display: flex;
  flex-direction: row-reverse;
}
.export-btnwrap .btn {
  line-height: 38px;
  line-height: 38px;
  border: 1px solid #409eff;
  background-color: #409eff;
  border-radius: 5px;
  color: #fff;
  padding: 0 20px;
  font-size: 16px;
  cursor: pointer;
}
.export-btnwrap .btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}
</style>

    <div class="spu-expandexp">
      <div class="modal">
        <div class="modal-th">
          <div class="title">
            数据导出
          </div>
          <div class="close">
            x
          </div>
        </div>
        <div class="modal-tb">
          <div class="export">
            <div class="export-wait hide">
              导出等待队列中：还有<span></span>位，请耐心稍等...
            </div>

            <div class="export-sel hide">
              <div class="export-sel-title">请选择导出内容</div>
              <div class="export-sel-con"></div>
            </div>

            <div class="export-section-wrap hide">
              <div class="export-tit"></div>
              <div class="export-section">
                <div class="export-file">
                  <div class="export-file-l">
                    <img src="" class="hide" />
                    <span class="export-file-l-filename"></span>
                    <span class="export-file-l-filesize"></span>
                  </div>
                  <div class="export-file-r">
                    <div class="export-file-r-download hide">下载</div>
                    <div class="export-file-r-cancel hide">取消</div>
                  </div>
                </div>

                <div class="export-progress">
                  <div class="export-progress-outer">
                    <div class="export-progress-inner"></div>
                  </div>
                  <div class="export-progress-text"></div>
                </div>

                <div class="export-result hide"></div>

                <div class="export-tip hide">您可以随时关闭该弹框，之后在导入导出列表中查看结果。</div>
              </div>
            </div>

            <div class="export-btnwrap">
              <div class="btn">导出</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
