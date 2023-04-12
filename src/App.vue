<script setup>
import { ref, defineComponent, onMounted, provide } from 'vue'
import DevicePixelRatio from './assets/lib/devicePixelRatio'
import Loading from "./components/Loading.vue"
import ChainTip from "./components/ChainTip.vue"
console.log("APP VUE -----------------")
const scrollbarRef_ = ref(null)
function isMobile() {
  var userAgentInfo = navigator.userAgent;

  var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

  var mobile_flag = false;

  //根据userAgent判断是否是手机
  for (var v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  var screen_width = window.screen.width;
  var screen_height = window.screen.height;
  //根据屏幕分辨率判断是否是手机
  if (screen_width > 325 && screen_height < 750) {
    mobile_flag = true;
  }
  return mobile_flag;
}
onMounted(() => {
  // router.beforeEach((to, from) => {
  //   if (to.matched[0]?.path != from.matched[0]?.path) {
  //     setLoading()
  //   }
  // })
  // router.afterEach((to, from, nex) => {
  //   setTimeout(() => {
  //     hideLoading()
  //   }, 500)
  // })
  // if (isMobile()) {
  //   document.getElementsByTagName('body')[0].style.zoom = 1
  //   document.getElementById("app").style.height = `${100 * 1}vh`
  //   document.getElementsByTagName('body')[0].style.setProperty('--scrollHeight', `${100 * 1}vh`)
  // } else {
  //   new DevicePixelRatio().init()
  // }
  // hideLoading()
  // 向子组件注入 scrollbarRef_，方便子组件使用
  provide("scrollbarRef_", scrollbarRef_)
})

</script>
<template>
  <div class="appContaner">
    <Loading></Loading>
    <!-- <ChainTip></ChainTip> -->
    <el-scrollbar style="height: 100vh" ref="scrollbarRef_">
      <router-view></router-view>
    </el-scrollbar>
  </div>
</template>
<style >
.appContaner {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>