<script setup>
import { ref, onMounted } from "vue"
const videoRef = ref(null)
const showLoading = ref(false)
window.setLoading = () => {
  // videoRef.value.play();  //视频播放
  showLoading.value = true
}
window.hideLoading = () => {
  setTimeout(() => {
    showLoading.value = false
  }, 200)
}
</script>
<template>
  <div class="cusLoading" v-show="showLoading">
    <img src="../assets/gif/dbook.gif" alt="">
    <!-- <video ref="videoRef" src="../assets/video/loading.mp4" muted loop></video> -->
  </div>
</template>
<style lang="scss" scoped>
.cusLoading {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 9999;
  opacity: 1;
  // background: rgba(58, 46, 38, 1);
  background: rgba(0, 0, 0, 1);

  video,
  img {
    width: 60%;
    max-width: 1225px;
    height: 60%;
    max-height: 1125px;
    object-fit: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>