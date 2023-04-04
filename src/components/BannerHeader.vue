<!-- 带banner的通用头部 -->
<script setup>
import { ref, watch, onMounted } from "vue"
import message from "../assets/lib/resetMessage"
import defaultBg from "../assets/img/defaultBg.png"
import Statistic from "../components/Statistic.vue"
import Header from "../components/Header.vue"
import router from "../router/index"
import { get, post } from "../service/http"
import { imageUrlToBase64, IsPC } from "../assets/lib/util"
const goLink = (key) => {
  if (userInfo.value[key]) {
    window.open(userInfo.value[key])
  } else {
    message.warning("no " + key)
  }
}
const goPath = (path) => {
  router.push({ path })
}
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "..." + addr.substr(-4, 4)
  }
}
const props = defineProps({
  userData: {
    type: Object,
    required: true,
    default: {}
  }
})
const isMoreDesription = ref(false)
const userInfo = ref({ desc: '', statistic: {} })
const headerWrapRef = ref(null)
const calcBackgroundImg = () => {
  if (!headerWrapRef.value) return
  const banner_url = userInfo.value.banner_url
  if (banner_url) {
    headerWrapRef.value.style.backgroundImage = `url(${banner_url})`
  } else
    headerWrapRef.value.style.backgroundImage = `url(${defaultBg})`
}
onMounted(async () => {
  userInfo.value = props.userData
  calcBackgroundImg()
})
watch(() => props.userData, (newVal, oldVal) => {
  userInfo.value = props.userData
  calcBackgroundImg()
})

// 关注
const createFans = async () => {
  const res = await post('fans', {
    author: userInfo.value.id
  })
  if (res.ready) {
    message.success("success")
    userInfo.value.is_fans = true
  }
}
// 取消关注
const cancelFans = async () => {
  const res = await post('fans/remove', {
    author: userInfo.value.id
  })
  if (res.ready) {
    message.success("success")
    userInfo.value.is_fans = false
  }
}
const share = () => {
  console.log("share")
}
</script>
<template>
  <div class="bannerHeader">
    <div class="headerWrapImg" ref="headerWrapRef">
      <Header></Header>
      <div class="authorHeader">
        <div>
          <span class="authoreName">{{ userInfo.name || 'anonymous' }}</span>
          <span class="address" v-show="userInfo.address">{{ encate(userInfo.address) || '' }}</span>
        </div>
        <div class="iconBulk web">
          <img src="../assets/img/site.svg" class="el-image" @click="goLink('website_url')">
          <img src="../assets/img/discord.svg" class="el-image" @click="goLink('discord_url')">
          <img src="../assets/img/twitter.svg" class="el-image" @click="goLink('twitter_url')"
            v-show="userInfo.twitter_url">
          <span class="stepLine"></span>
          <img src="../assets/img/shoucang_.svg" class="el-image" v-if="userInfo.is_fans" @click="cancelFans">
          <img src="../assets/img/shoucang.svg" class="el-image" v-else @click="createFans">
        </div>
      </div>
    </div>
    <div class="authorDescription">
      <div class="description" :class="{ 'isMoreDesription': isMoreDesription ? true : false }">{{ userInfo.desc ||
        'The author left no description.' }}</div>
      <div class="moreBtn" @click="isMoreDesription = !isMoreDesription" v-if="userInfo.desc.length > 200">
        {{ isMoreDesription ? 'expansion folding' : " read more" }}
      </div>
      <div class="iconBulk mobile">
        <img src="../assets/img/site.svg" class="el-image" @click="goLink('website_url')">
        <img src="../assets/img/discord.svg" class="el-image" @click="goLink('discord_url')">
        <img src="../assets/img/twitter.svg" class="el-image" @click="goLink('twitter_url')"
          v-show="userInfo.twitter_url">
        <span class="stepLine"></span>
        <img src="../assets/img/shoucang_.svg" class="el-image" v-if="userInfo.is_fans" @click="cancelFans">
        <img src="../assets/img/shoucang.svg" class="el-image" v-else @click="createFans">
      </div>
      <Statistic :options="{ statistic: userInfo.statistic }"></Statistic>
      <img :src="userInfo.avatar_url" class="autorAvatar" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.iconBulk {
  .el-image {
    width: 25px;
    height: 25px;
    border-radius: 25px;
    cursor: pointer;
  }

  .stepLine {
    display: inline-block;
    width: 1px;
    height: 25px;
    background: #42392b;
  }
}

.headerWrapImg {
  background: #ffe1b4;
  background-repeat: no-repeat;
  background-size: cover;

  .authorHeader {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;

    .authoreName {
      font-size: 22px;
      color: #42392b;
      margin-right: 33px;
    }

    .address {
      background: #42392b;
      border-radius: 10px;
      font-size: 15px;
      color: #ffe1b4;
      padding: 4px 8px;
    }
  }
}

.authorDescription {
  margin: 0 auto;
  position: relative;
  padding-top: 10px;

  .description {
    width: 1031px;
    height: 45px;
    font-size: 15px;
    color: #999999;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 2; //行数
    line-clamp: 2;
    -webkit-box-orient: vertical; //盒子中内容竖直排列

    &.isMoreDesription {
      height: 120px;
      -webkit-line-clamp: 5; //行数
      line-clamp: 5;
    }
  }

  .moreBtn {
    display: inline-block;
    letter-spacing: 1px;
    font-size: 15px;
    font-family: PingFang SC;
    color: #7d5321;
    border-bottom: 1px solid #7d5321;
    padding-bottom: 4px;
    cursor: pointer;
    margin: 5px 0 20px 0;
  }

  .autorAvatar {
    position: absolute;
    border-radius: 117px;
  }
}
</style>