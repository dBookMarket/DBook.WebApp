<script setup>
import { ref, onMounted } from "vue"
const videoRef = ref(null)
const showLoading = ref(false)
window.setLoading = () => {
  videoRef.value.play();  //视频播放
  showLoading.value = true
}
window.hideLoading = () => {
  showLoading.value = false
}
onMounted(() => {
  setLoading()
})
</script>
<template>
  <div class="cusLoading" v-show="showLoading">
    <video ref="videoRef" src="../assets/video/loading.mp4" muted></video>
  </div>
</template>
<style lang="scss" scoped>
.cusLoading {
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 99;
  opacity: 0.9;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>