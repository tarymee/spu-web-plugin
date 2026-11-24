<template>
  <div class="demo">
    <div class="demo-tit">lit-photo</div>
    <div class="demo-comp">
      <!-- @onload="onload" -->
      <!-- @onbeforeupload="onbeforeupload" -->
      <!-- @onafterupload="onafterupload" -->
      <!-- @ondetectioncomplete="ondetectioncomplete" -->
      <lit-photo
        ref="viewRef"
        :disabled="viewRule.disabled"
        :defaultvalue="viewRule.defaultvalue"
        :slots="viewRule.slots"
        :source="viewRule.source"
        :watermark="viewRule.watermark"
        :watermarkcomposite="viewRule.watermarkcomposite"
        :compression="viewRule.compression"
        :maxnumber="viewRule.maxnumber"
        :minnumber="viewRule.minnumber"
        :blurcheck="viewRule.blurcheck"
        :fakecheck="viewRule.fakecheck"
        @onvaluechange="onvaluechange"
      />
    </div>
    <div class="demo-btn">
      <button @click="getValue">取值</button>
      <button @click="setValue">赋值</button>
      <button @click="validata">校验</button>
      <button @click="toggleReadonly">切换只读</button>
      <button @click="test">test</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const viewRule = reactive<any>({
  disabled: true,
  source: '0',
  watermark: '{date}\n喜乐多终端\n{address}',
  watermarkcomposite: 'attached',
  compression: '1',
  maxnumber: '',
  minnumber: '0',
  blurcheck: '2',
  fakecheck: '2',
  defaultvalue: [],
  slots: [
    {
      code: '正面',
      required: '1',
      title: '正面'
    },
    {
      code: '背景面',
      required: '0',
      title: '背景面'
    },
    {
      code: '背景面',
      required: '1',
      title: '背景面'
    },
    {
      code: '背景面',
      required: '0',
      title: '背景面'
    }
  ]
})

if (viewRule.slots.length) {
  viewRule.defaultvalue = [
    {
      source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
      datetime: '1791724631817',
      storage: 'storage',
      watermark: '2026-10-11 21:17:11\n喜乐多终端\n广东省广州市天河区迎龙路477号雨虹防水(富民路店)',
      latitude: '23.202814',
      longitude: '113.36823',
      isblur: '2',
      isfake: '2',
      title: '陈列架',
      address: '广东省广州市天河区迎龙路477号雨虹防水(富民路店)'
    },
    {
      source: '571be5d2-5915-46f7-b118-64666b56c58d.png',
      datetime: '1791724642218',
      storage: 'storage',
      watermark: '2026-10-11 21:17:22\n喜乐多终端\n广东省广州市天河区迎龙路477号雨虹防水(富民路店)',
      latitude: '23.202814',
      longitude: '113.36823',
      isblur: '0',
      isfake: '2',
      title: '陈列架',
      address: '广东省广州市天河区迎龙路477号雨虹防水(富民路店)'
    },
    // {
    //   source: '94886a28-13c5-4162-85a2-83ea8afcafef.png',
    //   datetime: '1791724649031',
    //   storage: 'storage',
    //   watermark: '2026-10-11 21:17:29\n喜乐多终端\n广东省广州市天河区迎龙路477号雨虹防水(富民路店)',
    //   latitude: '23.202814',
    //   longitude: '113.36823',
    //   isblur: '2',
    //   isfake: '0',
    //   title: '正面',
    //   address: '广东省广州市天河区迎龙路477号雨虹防水(富民路店)'
    // },
    '',
    {
      source: '51c6fc1b-3955-4c88-aa18-55beffcefe08.jpg',
      datetime: '1791724653290',
      storage: 'storage',
      watermark: '2026-10-11 21:17:33\n喜乐多终端\n广东省广州市天河区迎龙路477号雨虹防水(富民路店)',
      latitude: '23.202814',
      longitude: '113.36823',
      title: '陈列架',
      address: '广东省广州市天河区迎龙路477号雨虹防水(富民路店)'
    }
  ]
} else {
  viewRule.defaultvalue = [
    {
      source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
      datetime: '1791724631817',
      storage: 'storage',
      watermark: '2026-10-11 21:17:11\n喜乐多终端\n广东省广州市天河区迎龙路477号雨虹防水(富民路店)',
      latitude: '23.202814',
      longitude: '113.36823',
      isblur: '2',
      isfake: '2',
      title:
        '陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架',
      address: '广东省广州市天河区迎龙路477号雨虹防水(富民路店)'
    },
    {
      source: '571be5d2-5915-46f7-b118-64666b56c58d.png',
      datetime: '1791724642218',
      storage: 'storage',
      watermark: '2026-10-11 21:17:22\n喜乐多终端\n广东省广州市天河区迎龙路477号雨虹防水(富民路店)',
      latitude: '23.202814',
      longitude: '113.36823',
      isblur: '0',
      isfake: '2',
      title:
        '陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架',
      address: '广东省广州市天河区迎龙路477号雨虹防水(富民路店)'
    }
  ]
}

const viewRef = ref()

const getValue = () => {
  const value = viewRef.value.getValue()
  console.log(value)
}

const setValue = () => {
  viewRef.value.setValue(viewRule.defaultvalue)
}

const validata = () => {
  const res = viewRef.value.validata()
  console.log(res)
}

const toggleReadonly = () => {
  viewRule.disabled = !viewRule.disabled
}

const test = () => {}

const onload = (e: any) => {
  console.log('onload', e)
}

const onbeforeupload = (e: any) => {
  console.log('onbeforeupload', e)
}

const onafterupload = (e: any) => {
  console.log('onafterupload', e)
}

const onvaluechange = (e: any) => {
  console.log('onvaluechange', e)
}

const ondetectioncomplete = (e: any) => {
  console.log('ondetectioncomplete', e)
}
</script>

<style scoped>
.demo {
  overflow: hidden;
}
.demo-tit {
  margin: 32px 16px 0;
  font-size: 20px;
  font-weight: bold;
  /* display: none; */
}
.demo-comp {
  margin: 16px;
}
.demo-btn {
  margin: 16px;
}
.demo-btn button {
  /* display: block; */
  margin: 4px;
}
aaa {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
