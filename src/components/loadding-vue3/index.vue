<template>
  <div class="loadding">
    <div class="loadding-icon">
      <img src="./img/loading.gif" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    msg: String
  },
  setup () {
    const show = ref(true)
    return { show }
  }
})
</script>

<style scoped>
.loadding {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.2);
}
.loadding-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.loadding-icon img {
  display: block;
  width: 24px;
  height: 24px;
}
</style>
