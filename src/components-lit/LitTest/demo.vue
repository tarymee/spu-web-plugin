<template>
  <div class="test">
    <div class="test-tit">vue页面</div>
    <div class="">
      <button class="btn" size="large" @click="test">test</button>
      <button class="btn" size="large" @click="getValue">getValue</button>
    </div>
    <div class="test-con">flag: {{ flag }}</div>
    <div class="test-con">count: {{ count }}</div>
    <div class="test-con">arr: {{ arr }}</div>
    <div class="test-con">obj: {{ obj }}</div>
    <div class="test-con">obj1: {{ obj1 }}</div>

    <!-- <button class="btn" size="large" @click="setValue">setValue</button> -->
  </div>

  <div class="test">
    <div class="test-tit">lit组件</div>
    <lit-test
      ref="litTestRef"
      :flag="flag"
      :count="count"
      :classes="{ lithhh: true }"
      _active="外部属性传入"
      :obj="obj"
      :obj1="obj1"
      :arr="arr"
      @change="handleChange"
      name1="外部属性传入"
    >
    </lit-test>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

const litTestRef = ref<any>(null)

const flag = ref(true)
const count = ref(8)
const name1 = ref('外部属性传入')
const obj = ref({
  bbb: 'aaa'
})
const obj1 = reactive({
  bbb: 'aaa'
})
const arr = ref([
  {
    id: '111',
    name: 'vvv'
  },
  {
    id: '222',
    name: 'vvv'
  },
  {
    id: '333',
    name: 'vvv'
  }
])

const test = () => {
  // console.log(litTestRef.value)
  // litTestRef.value.change()
  console.log(count.value)
  count.value++
  flag.value = !flag.value
  obj.value.bbb = obj.value.bbb + 'a'
  obj1.bbb = obj1.bbb + 'a'
}

const handleChange = (e: any) => {
  console.log('handleChange')
  console.log(e)
  count.value = e.detail.count
  name1.value = e.detail.name1
}

const getValue = () => {
  console.log(litTestRef.value)
  // debugger
  const value = litTestRef.value.getValue()
  console.log(value)
}

// const setValue = () => {
//   console.log(litTestRef.value)
//   // debugger
//   litTestRef.value.setValue({
//     type: type.value === 'departmentName' ? 'userName' : 'departmentName',
//     openid: openid.value === '6' ? 'woOUQJEAAATELkAo5cgbkznEdBjmtgcA' : '6'
//   })
// }
</script>

<style lang="less" scoped>
.test {
  margin: 16px;
}
.test button {
  margin: 0 8px 8px 0;
}
.test-tit,
.test-con {
  margin: 4px;
}
</style>
