<template>
  <div class="demo-btn">
    <van-button class="btn" type="primary" size="large" @click="singleSetValue">单选赋值</van-button>
    <van-button class="btn" type="primary" size="large" @click="singleGetValue">单选取值</van-button>
  </div>

  <div class="tree-form" @click="singleToggleShow">
    <div class="tree-form-l">人员单选：</div>
    <div class="tree-form-r">
      <wxworksuite-opendata v-if="singleNode" :openid="singleNode.name" type="expression" />
      <div v-else>
        请选择
      </div>
    </div>
  </div>

  <van-popup v-model:show="singleShow" position="bottom" :style="{ height: '85%', zIndex: 9999 }" :lazy-render="false">
    <div class="tree-popup">
      <wxworksuite-memberpick-mobile ref="singleRef" :userule="true" :issearch="true" @select="singleHandleSelect" />
    </div>
  </van-popup>









  <div class="demo-btn">
    <van-button class="btn" type="primary" size="large" @click="mulSetValue">多选赋值</van-button>
    <van-button class="btn" type="primary" size="large" @click="mulGetValue">多选取值</van-button>
  </div>

  <div class="tree-form" @click="mulToggleShow">
    <div class="tree-form-l">人员多选：</div>
    <div class="tree-form-r">
      <template v-if="mulNode && mulNode.length">
        <van-tag v-for="(item, index) in mulNode" :key="index" plain type="primary" closeable @close="mulRemove(item)">
          <wxworksuite-opendata :openid="item.name" type="expression" />
        </van-tag>
      </template>
      <div v-else>
        请选择
      </div>
    </div>
  </div>

  <van-popup v-model:show="mulShow" position="bottom" :style="{ height: '85%', zIndex: 9999 }" :lazy-render="false">
    <div class="tree-popup" style="height: calc(100% - 80px)">
      <wxworksuite-memberpick-mobile ref="mulRef" :userule="false" :issearch="false" ismulselect="{{ true }}" />
    </div>
    <div class="tree-popup-btn">
      <van-button class="btn" type="primary" size="large" @click="mulCancel">取消</van-button>
      <van-button class="btn" type="primary" size="large" @click="mulComfirm">确定</van-button>
    </div>
  </van-popup>

</template>

<script setup>
import { ref } from 'vue'

const singleRef = ref(null)
const singleShow = ref(false)
const singleNode = ref(null)

const singleToggleShow = () => {
  singleShow.value = !singleShow.value
}

const singleHandleSelect = () => {
  singleSyncValue()
  singleToggleShow()
}

const singleSetValue = () => {
  singleRef.value.setValue('1806591895317917696')
  singleSyncValue()
}

const singleGetValue = () => {
  const id = singleRef.value.getValue()
  const name = singleRef.value.getValue('name')
  const fullvalue = singleRef.value.getValue('fullvalue')
  console.log(id)
  console.log(name)
  console.log(fullvalue)
}

const singleSyncValue = () => {
  const fullvalue = singleRef.value.getValue('fullvalue')
  console.log(fullvalue)
  singleNode.value = fullvalue
}










const mulRef = ref(null)
const mulShow = ref(false)
const mulNode = ref([])

const mulToggleShow = () => {
  mulShow.value = !mulShow.value
}

const mulGetValue = () => {
  const id = mulRef.value.getValue()
  const name = mulRef.value.getValue('name')
  const fullvalue = mulRef.value.getValue('fullvalue')
  console.log(id)
  console.log(name)
  console.log(fullvalue)
}

const mulSyncValue = () => {
  const fullvalue = mulRef.value.getValue('fullvalue')
  console.log(fullvalue)
  mulNode.value = fullvalue
}

const mulSetValue = () => {
  mulRef.value.setValue(['1806591895317917696', '1806591879895461888'])
  mulSyncValue()
}

const mulRemove = (item) => {
  console.log('mulRemove')
  console.log(item)
  mulRef.value.setCheck(item.id, false)
  mulSyncValue()
}

const mulCancel = () => {
  console.log('取消')
  const oldValue = mulNode.value.map((item) => {
    return item.id
  })
  mulRef.value.setValue(oldValue)
  mulToggleShow()
}

const mulComfirm = () => {
  console.log('确定')
  mulGetValue()
  mulToggleShow()
}
</script>

<style lang="less" scoped>
.demo-btn {
  margin: 16px;
}
.demo-btn button {
  margin: 8px 0;
}


.tree-form {
  margin: 16px;
  display: flex;
  justify-content: space-between;
}


.tree-popup {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  background-color: #F6F6F6;
  padding: 12px;
}
.tree-popup-btn {
  display: flex;
  margin: 12px;
}
.tree-popup-btn button {
  margin: 0px 8px;
}
</style>
