<template>
    <div class="m-pdf">
      <div id="pdf"></div>
    </div>
  </template>
  <script>
  import Pdfh5 from "pdfh5";
  import "pdfh5/css/pdfh5.css";
  export default {
    name: "Pdfh5",
    data() {
      return {
        pdfh5: null,
        pdfUrl:''
      };
    },
    mounted() {
      // pdfh5实例化时传两个参数：selector选择器，options配置项参数，会返回一个pdfh5实例对象，可以用来操作pdf，监听相关事件
      // pdfh5 = new Pdfh5(selector, options) goto初始到第几页，logo设置每一页pdf上的水印
      this.pdfh5 = new Pdfh5("#pdf", {
        pdfurl: this.$route.query.pdfUrl,
        goto: 1
      });
      // 监听pdf准备开始渲染，此时可以拿到pdf总页数
      this.pdfh5.on("ready", function() {
        console.log("总页数:" + this.totalNum);
      });
      // 监听pdf加载完成事件，加载失败、渲染成功都会触发
      this.pdfh5.on("complete", (status, msg, time) => {
        console.log(
          "状态:" + status + "，信息:" + msg + "，耗时:" + time + "毫秒"
        );
      });
    }
  };
  </script>
  <style  lang="scss" scoped>
  .m-pdf {
    // 保证pdf区域铺满整个屏幕
    // 方法1：使用vw和vh视窗单位，1vw=视窗宽度的1%；1vh=视窗高度的1%
    width: 100vw;
    min-height:100vh;
  }  
  </style>
  