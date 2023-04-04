<script setup>
import { ref } from "vue"
import common from '../assets/lib/common';
const isqrcode = ref(true)
const downloadPopup = ref(false)
const toDownload = (type) => {
  if (type === 'google') {
    window.open('https://play.google.com/store/apps/details?id=com.ddid.dbook_market_testnet')
  } else {
    common.toWeb(type);
  }
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
          <img src="../assets/img/qrcode.svg" class="_qrcodeimg" @click.native="isqrcode = true" />
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
  height: 35%;
  max-width: 817px;
  max-height: 302px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .download {
    // width: 100%;
    height: 100%;
    border-radius: 20px;
    background-image: url("../assets/img/juxing.png");
    background-repeat: no-repeat;
    // background-position: center 0;
    border-radius: 0.2rem;
    background-size: 100% 100%;
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

      ._butitem {

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
        width: 20%;
        // width: 90px;
        // height: 90px;
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
          left: 0%;
          z-index: 10000;

          ._qrcodepng {
            border-radius: 10px;
            width: 100%;
            // width: 150px;
            // height: 150px;
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
