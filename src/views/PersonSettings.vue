<script setup>
import { ref } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { Plus } from '@element-plus/icons-vue'
import cache from "../assets/lib/cache"
import message from "../assets/lib/resetMessage"
import { get, put } from "../service/http"
import TwitterCom from "../components/TwitterVerify.vue"
import router from "../router"
const twitterVerifyShow = ref(false)
const form = ref({})
const userData = cache.get("userInfo")
console.log(userData)
if (!userData) {
  router.push({ path: '/' })
}
form.value = userData
const formData = new FormData()
const changeAvatar = (file) => {
  formData.set('avatar', file.raw)
  form.value['avatar_url'] = URL.createObjectURL(file.raw);
}
const changeBanner = (file) => {
  formData.set('banner', file.raw)
  form.value['banner_url'] = URL.createObjectURL(file.raw);
}
const updateUser = async () => {
  window.setLoading()
  formData.set("name", form.value.name)
  formData.set("desc", form.value.desc)
  formData.set("website_url", form.value.website_url)
  formData.set("discord_url", form.value.discord_url)
  const res = await put(`users/${form.value.id}`, formData)
  if (res.ready) {
    message.success("update success !")
    cache.set("userInfo", res.data)
    form.value = res.data
    window.hideLoading()
  }
}
const copyAddress = (text) => {
  const input = document.getElementById('input')// 承载复制内容
  input.value = text; // 修改文本框的内容
  input.select(); // 选中文本
  document.execCommand('copy')
  message.success("copy success !")
}
const twitterAuth = async () => {
  twitterVerifyShow.value = true
}
</script>
<template>
  <div class="main personSetting">
    <div class="headerWrapImg">
      <Header></Header>
    </div>
    <div class="content ">
      <div class="title">Settings</div>
      <div class="typeWrap">
        <div class="typeLeft">
          <div class="tit">Profile picture</div>
          <el-upload action="#" :show-fileList="false" :auto-upload="false" :on-change="changeAvatar">
            <img v-show="form.avatar_url" :src="form.avatar_url" alt="">
            <img v-show="!form.avatar_url" src="../assets/img/avatar.svg" alt="">
          </el-upload>
        </div>
        <div class="typeRight">
          <div class="tit">Banners</div>
          <el-upload action="#" :show-fileList="false" :auto-upload="false" :on-change="changeBanner" class="fullUpload">
            <div class="plusIcon">
              <img v-show="form.banner_url" :src="form.banner_url" alt="">
              <el-icon v-show="!form.banner_url">
                <Plus />
              </el-icon>
            </div>
          </el-upload>
        </div>
      </div>
      <div class="title_">Name</div>
      <el-input class="cusInput" v-model="form.name"></el-input>
      <div class="title_">Description</div>
      <el-input v-model="form.desc" type="textarea" class="cusAreaBorder" placeholder="Introduce yourself..." show-word-limit maxlength="500" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
      <div class="twitterWrap">
        <div class="desWrap">
          <span>Social accounts</span>
          <img src="../assets/img/twitter.svg" alt="">
          <span>Twitter</span>
        </div>
        <div class="authBtn" @click="twitterAuth">
          {{ form.is_verified ? 'reverify' : 'verify' }}
        </div>
      </div>
      <div class="copyWrap">
        <el-input v-model="form.twitter_url" class="cusInput addressInput" readonly></el-input>
        <img src="../assets/img/copy.svg" alt="" @click="copyAddress(form.twitter_url)">
      </div>
      <div class="title_">Website</div>
      <el-input v-model="form.website_url" class="cusInput" placeholder="https://"></el-input>
      <div class="title_">Discord</div>
      <el-input v-model="form.discord_url" class="cusInput" placeholder="https://"></el-input>
      <div class="title_">Wallet address</div>
      <div class="copyWrap">
        <el-input v-model="form.address" class="cusInput addressInput" readonly></el-input>
        <img src="../assets/img/copy.svg" alt="" @click="copyAddress(form.address)">
      </div>
      <div class="operaBtn" @click="updateUser">Save</div>
    </div>
    <TwitterCom v-show="twitterVerifyShow"></TwitterCom>
    <Footer></Footer>
    <input id="input" value="" style="opacity:0;position:fixed;" />
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .headerWrapImg {
    background: #ffe1b4;
  }

  .content {
    padding: 40px 0;

    .title {
      font-size: 22px;
      font-weight: bold;
      color: #000000;
    }

    .title_ {
      font-size: 18px;
      color: #000000;
    }

    .typeWrap {
      display: flex;
      margin: 38px 0 29px 0;
      font-size: 18px;
      color: #000000;

      .typeLeft {
        width: 189px;

        .tit {
          height: 34px;
          padding-left: 11px;
        }

        img {
          width: 77px;
          height: 77px;
          background: #ffffff;
          border-radius: 50%;
        }
      }

      .typeRight {
        flex: 1;

        .tit {
          height: 34px;
        }

        .plusIcon {
          width: 100%;
          height: 70px;
          text-align: center;
          border: 1px solid #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          .el-icon {
            font-size: 35px;
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .uploadWrap {
      display: flex;

      .bookPost {
        width: 140px;
        height: 180px;
        background: #ffffff;
        border: 1px solid #000000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
          width: 26px;
          height: 32px;
          margin-bottom: 16px;
        }

        div {
          font-size: 12px;
          color: #999999;
        }
      }

      .tip {
        align-self: flex-end;
        margin-left: 23px;

        > div {
          font-size: 12px;
          color: #999999;
          line-height: 27px;
        }
      }
    }

    .twitterWrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 49px 0 25px 0;

      .desWrap {
        flex: 1;

        span {
          color: #000000;
          vertical-align: top;
        }

        img {
          width: 25px;
          height: 25px;
        }
      }

      .authBtn {
        width: 125px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: #50483b;
        font-size: 15px;
        font-family: PingFang SC;
        color: #ffe1b4;
        pointer-events: all;
        cursor: pointer;
      }
    }

    .cusInput {
      width: 100%;
      height: 46px;
      line-height: 46px;
      background: #ffffff;
      border: 1px solid #000000;
    }

    .cusArea {
      height: 154px;
      background: #ffffff;
      border: 1px solid #000000;
    }

    .copyWrap {
      position: relative;

      .addressInput {
        .el-input__inner {
          background: #fff7ec;
        }
      }

      img {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 20px;
        top: 15px;
        cursor: pointer;
      }
    }

    .operaBtn {
      width: 151px;
      font-size: 15px;
      color: #ffe1b4;
      background: #42392b;
      padding: 11px 11px;
      margin-top: 70px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
