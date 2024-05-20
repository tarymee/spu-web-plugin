import SpuWebExport from './index'

export default (ele: SpuWebExport) => {
  // const { buttonRadius, buttonText, buttonType } = config
  console.log(ele)

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

.spu-web-export {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.btn {
  line-height: 40px;
  border-radius: 5px;
  background-color: #417AE7;
  color: #fff;
  padding: 0 20px;
  cursor: pointer;
}


.modal {
  width: 80%;
  margin: 10% auto;
  border-radius: 2px;
  overflow: hidden;
}
.modal-th {
  height: 40px;
  background-color: #608fe9;
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
.export-tip {
  line-height: 32px;
  height: 32px;
  text-align: center;
  background-color: rgba(255, 73, 73, .1);
  color: #333;
}
.export-tip span {
  color: red;
  margin: 0 4px;
}
.export-tit {}
.export-sel {}
.export-sel .title {}
.export-btnwrap {
  margin-top: 12px;
  display: flex;
  flex-direction: row-reverse;
}

</style>

    <div class="spu-web-export">
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
            <div class="export-tip">
              导出等待队列中：还有<span>${ ele.config.text }</span>位，请耐心稍等...
            </div>
            <div class="export-tit">导出中</div>
            <div class="export-sel">
              <section class="title">请选择导出内容</section>
            </div>
            <div class="export-sel">
              <section class="title">请选择导出文件类型</section>
            </div>
          </div>




          <div class="export-btnwrap">
            <div class="btn">导出</div>
          </div>


        </div>
      </div>
    </div>
  `
}
