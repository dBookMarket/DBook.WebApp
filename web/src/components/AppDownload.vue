<script setup>
import { ref } from "vue"
import common from '../assets/lib/common';
const isqrcode = ref(true)
const downloadPopup = ref(false)
const toDownload = (type) => {
  common.toWeb(type);
}
/**
 * 下载弹框
 */
const openPopup = () => {
  downloadPopup.value = true
}
/**
 * 关闭弹框
 */
const closePopup = () => {
  downloadPopup.value = false
}
defineExpose({ openPopup, closePopup })
</script>
<template>
  <div class="downloadapp" v-show="downloadPopup">
    <div class="download">
      <img class="closeimg" @click="closePopup()" src="../assets/img/close.svg" />
      <img src="../assets/img/download.png" class="_download" />
      <div class="_butflex">
        <div class="_butitem">
          <img src="../assets/img/apple.svg" class="_apple" />
          <div>
            <div class="_toptext">Download on the</div>
            <div class="_bottomtext">App Store</div>
          </div>
        </div>
        <div class="_butitem" @click="toDownload('google')">
          <img src="../assets/img/google.svg" class="_google" />
          <div>
            <div class="_toptext">GET IT ON</div>
            <div class="_bottomtext">Google Play</div>
          </div>
        </div>
        <div class="_qrcode" @mouseover="isqrcode = true" @mouseout="isqrcode = false">
          <img src="../assets/img/qrcode.svg" class="_qrcodeimg" />
          <div class="_bigqrcode" :class="{ 'isqrcode': isqrcode }">
            <img src="../assets/img/qrcode.png" class="_qrcodepng" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.downloadapp {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .download {
    width: 827px;
    height: 302px;
    border-radius: 20px;
    background-image: url("../assets/img/juxing.png");
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: cover;
    border-radius: 0.2rem;
    text-align: center;
    position: relative;

    .closeimg {
      position: absolute;
      width: 33px;
      height: 33px;
      top: 15px;
      right: 1.8%;
      z-index: 10;
      cursor: pointer;
    }

    ._download {
      // width: 80%;
      height: 50px;
      margin-top: 25px;
      margin-bottom: 20px;
    }

    ._butflex {
      display: flex;
      justify-content: space-evenly;

      ._butitem {
        width: 270px;
        height: 90px;
        cursor: pointer;
        background: #ffffff;
        border-radius: 0.15rem;
        font-family: Alibaba PuHuiTi;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        text-align: left;

        >div {
          height: 90%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        }

        ._apple {
          width: 43px;
          height: 47px;
        }

        ._google {
          width: 40px;
          height: 45rem;
        }

        ._toptext {
          font-size: 15px;
          font-weight: 300;
          color: #000000;
          line-height: 0.25rem;
        }

        ._bottomtext {
          font-size: 26px;
          font-weight: 500;
          color: #000000;
          line-height: 0.3rem;
        }
      }

      ._qrcode {
        width: 90px;
        height: 90px;
        background: #ffffff;
        border-radius: 0.15rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;

        ._qrcodeimg {
          width: 65px;
          height: 65px;
          vertical-align: middle;
        }

        ._bigqrcode {
          position: absolute;
          display: none;
          top: 95px;
          left: 50%;
          margin-left: -85px;
          z-index: 10000;

          ._qrcodepng {
            border-radius: 10px;
            width: 150px;
            height: 150px;
            padding: 10px;
            background-color: #ffffff;
          }
        }

        .isqrcode {
          display: block;
        }
      }
    }
  }
}
</style>
