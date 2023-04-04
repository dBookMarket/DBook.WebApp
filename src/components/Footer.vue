<script setup>
import { ref } from "vue"
import AppDownloadCom from "./AppDownload.vue"
<<<<<<< HEAD:src/components/Footer.vue
import { IsPC } from "../assets/lib/util"

=======
import qrcodeImg from "../assets/img/qrcode.jpeg"
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/Footer.vue
const downloadRef = ref(null)
const toTwitter = () => {
  window.location.href = 'https://twitter.com/ddid_io'
}
const openDownload = () => {
  downloadRef.value.openPopup()
}
</script>
<template>
  <div class="cusFooter">
    <div class="footerMain">
      <div class="ftLeft">
        <div class="ftLTop">
          <img src="../assets/img/twitter.svg" class="el-image" @click="toTwitter">
          <img src="../assets/img/discord.svg" class="el-image">
          <img src="../assets/img/youtube.svg" class="el-image">
          <img src="../assets/img/GitHub.svg" class="el-image">
        </div>
        <div class="ftContent">Developers：dev@ddid.io</div>
        <div class="ftContent_">Copyright DDID LTD.2022 - All Rights Reserved</div>
      </div>
      <div class="ftLine"></div>
      <div class="ftRight">
        <!-- <el-popover placement="top" :width="865" trigger="click"> -->
        <!-- <template #reference> -->
        <div class="ftRTop" @click="openDownload">Download the APP</div>
        <!-- </template> -->
        <!-- </el-popover> -->
        <div class="ftContent">Author consultation：dev@ddid.io</div>
        <div class="ftContent_">Powered by DDID Laboratories Limited</div>
      </div>
      <img src="../assets/img/footer/footer_left_1.png" alt="" class="footerImg footer_left_1" @click="">
      <img src="../assets/img/footer/footer_left_2.png" alt="" class="footerImg footer_left_2">
      <img src="../assets/img/footer/footer_right_1.png" alt="" class="footerImg footer_right_1">
      <img src="../assets/img/footer/footer_right_2.png" alt="" class="footerImg footer_right_2">
    </div>

    <AppDownloadCom ref="downloadRef"></AppDownloadCom>
  </div>
</template>
<style lang="scss" scoped>
.cusFooter {
  width: 100%;
  height: 170px;
  background: #ffe1b4;

  // position: absolute;
  // bottom: 0;
  .footerMain {
    max-width: 600px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    flex-wrap: wrap;

    .footerImg {
      position: absolute;
      bottom: 0;
    }

    .ftLeft {
      text-align: right;
      flex: 1;

      .ftLTop {
        .el-image {
          width: 25px;
          height: 25px;
          border-radius: 15px;
          margin-left: 8%;
        }
      }
    }

    .ftLine {
      width: 1px;
      height: 45px;
      background: #42392b;
      margin: 30px 24px 0 24px;
    }

    .ftRight {
      text-align: left;
      flex: 1;

      .ftRTop {
        width: 125px;
        height: 26px;
        line-height: 26px;
        background: #42392b;
        font-size: 12px;
        color: #ffe1b4;
        text-align: center;
        cursor: pointer;
      }
    }

    .ftContent {
      margin: 5px 0 0 0;
    }

    .ftContent,
    .ftContent_ {
      font-size: 12px;
      color: #000000;
    }
  }
}

.qrCode {
  width: 420px;
  display: flex;
  justify-content: space-between;

  .qr {
    width: 49%;
    text-align: center;

    .el-image {
      width: 90%;
    }
  }
}
</style>