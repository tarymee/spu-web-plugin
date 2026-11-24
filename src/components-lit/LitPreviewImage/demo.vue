<template>
  <div class="demo">
    <div class="demo-tit">lit-preview-image</div>
    <div class="demo-btn">
      <button @click="previewUrl">URL 数组预览</button>
      <button @click="previewStorage">存储对象预览（含标题）</button>
      <button @click="previewErrUrl">错误 URL 预览</button>
      <button @click="previewErrStorage">错误对象预览</button>
      <button @click="previewType">指定 type=web</button>
      <button @click="previewTypeMobile">指定 type=mobile</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { litPreviewImage } from '@smart100/spu-web-plugin'

const urlImages = [
  'https://dummyimage.com/600x400/5b8def/fff&text=1',
  {
    source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
    datetime: '1791724631817',
    storage: 'storage',
    watermark: '2026-10-11 21:17:11\n喜乐多终端\n广东省广州市天河区迎龙路477号',
    watermarkcomposite: 'attached',
    title:
      '陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架'
  },
  {
    source: '571be5d2-5915-46f7-b118-64666b56c58d.png',
    datetime: '1791724642218',
    storage: 'storage',
    title: '正面'
  },
  'https://dummyimage.com/900x600/2aa198/fff&text=3'
]

const storageImages = [
  {
    source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
    datetime: '1791724631817',
    storage: 'storage',
    watermark: '2026-10-11 21:17:11\n喜乐多终端\n广东省广州市天河区迎龙路477号',
    watermarkcomposite: 'attached',
    title:
      '陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架陈列架'
  },
  {
    source: '571be5d2-5915-46f7-b118-64666b56c58d.png',
    datetime: '1791724642218',
    storage: 'storage',
    title: '正面'
  }
]

// 错误 URL：加载失败触发 error 占位
const errUrlImages = [
  'https://dum发11myimage.com/600x400/5b8def/fff&text=ok',
  'https://example.com/nonexistent-image-404.jpg',
  'https://dummyimage.com/900x600/2aa198/fff&text=ok2'
]

// 错误对象：无效 source/datetime，downloadService 取不到 URL
const errStorageImages = [
  {
    source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
    datetime: '1791724631817',
    storage: 'storage',
    title:
      '正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图正常图'
  },
  {
    source: 'nonexistent-xxxxxxxx.png',
    datetime: '1',
    storage: 'storage',
    title: '错误图'
  },
  {
    source: 'nonexistent-xxxxxxxx.png',
    datetime: '1',
    storage: 'storage',
    title: '错误图'
  },
  {
    source: '95ca8573-89c2-4d49-a70c-29b2d0e34cc6.png',
    datetime: '1791724631817',
    storage: 'storage',
    title: '正常图'
  }
]

const previewUrl = () => litPreviewImage({ images: urlImages })
const previewStorage = () => litPreviewImage({ images: storageImages, index: 1 })
const previewErrUrl = () => litPreviewImage({ images: errUrlImages })
const previewErrStorage = () => litPreviewImage({ images: errStorageImages })
const previewType = () => litPreviewImage({ images: urlImages, type: 'web' })
const previewTypeMobile = () => litPreviewImage({ images: urlImages, type: 'mobile' })
</script>

<style scoped>
.demo {
  overflow: hidden;
}
.demo-tit {
  margin: 32px 16px 0;
  font-size: 20px;
  font-weight: bold;
}
.demo-btn {
  margin: 16px;
}
.demo-btn button {
  margin: 4px;
}
</style>
