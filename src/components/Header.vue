<script setup>
<<<<<<< HEAD:src/components/Header.vue
import { nextTick, onMounted, ref, computed } from "vue"
=======
import { nextTick, onMounted, ref } from "vue"
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/Header.vue
import person_icon_1 from "../assets/img/person_icon_1.svg"
import person_icon_2 from "../assets/img/person_icon_2.svg"
import person_icon_3 from "../assets/img/person_icon_3.svg"
import person_icon_4 from "../assets/img/person_icon_4.svg"
import person_icon_5 from "../assets/img/person_icon_5.svg"
import person_icon_6 from "../assets/img/person_icon_6.svg"
import person_icon_7 from "../assets/img/person_icon_7.svg"
import { CaretBottom } from '@element-plus/icons-vue'
import router from "../router/index"
import message from "../assets/lib/resetMessage"
import cache from "../assets/lib/cache"
import { get, post, put } from "../service/http"
import Wallet from '../service/wallet'
<<<<<<< HEAD:src/components/Header.vue
import Wallet_Mobile from '../service/walletMobile'
import { imageUrlToBase64, IsPC } from "../assets/lib/util"
import config from "../service/url"
import SocketService from "../service/websocket";
import { ElNotification } from 'element-plus'
=======
import { imageUrlToBase64 } from "../assets/lib/util"
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/Header.vue
const emit = defineEmits(['verify'])
const walletSelectedAddress = ref('')
const userInfo = ref({ avatar_url: '' })
const getWallet = async () => {
  window.setLoading()
  cache.clear()
  let address, walletInstance;
  if (IsPC()) {
    // web端
    // 唤起钱包 并 签名
    walletInstance = new Wallet()
    address = await walletInstance.getAddress()
  } else {
    // 移动端
    walletInstance = new Wallet_Mobile()
    await walletInstance.provider.enable()
    address = walletInstance.provider.accounts[0]
  }
  if (address) {
    const res = await post("nonce", { address })
    let signature;
    try {
      signature = await walletInstance.getSignature(res.data.nonce, address)
    } catch (e) {
      message.warning("error!")
      window.hideLoading()
      return
    }
    window.setLoading()
    const loginRes = await post("login", { address, signature })
    if (loginRes.ready) {
      cache.set("address", address, 10, 'day')
      cache.set("nonce", res.data.nonce, 10, 'day')
      cache.set("token", loginRes.data.token, 10, 'day')
      checkWallet()
      setTimeout(() => {
        window.hideLoading()
      }, 500)
    }
  } else {
    message.warning("address error")
  }
  window.hideLoading()
}
const rightConKey = ref(0)
const logout = async () => {
  userInfo.value = {}
  walletSelectedAddress.value = ''
  const res = await post("logout")
  if (res.ready) {
    cache.clear()
    message.success("Logout success ！")
    router.push({ path: '/index' })
    rightConKey.value++
  }
}
const goPath = (path, checkIsAuthor) => {
  if (checkIsAuthor) {
    if (userInfo.value.is_verified) {
      router.push({ path })
    } else {
      emit('verify')
    }
  } else {
    router.push({ path })
  }
}
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "..." + addr.substr(-4, 4)
  }
}
// 检测登录状态
const checkWallet = async () => {
  const token = cache.get('token')
  const address = cache.get('address')
  const userInfoCache = cache.get('userInfo')
  if (token && address) {
    walletSelectedAddress.value = address
    if (userInfoCache) {
      userInfo.value = userInfoCache
    } else {
      const res = await get("users/current")
      if (res.ready) {
        userInfo.value = res.data
<<<<<<< HEAD:src/components/Header.vue
        // 有头像的才缓存数据
        if (userInfo.value.avatar_url) {
          cache.set('userInfo', res.data)
        }
      }
    }
    const formData = new FormData()
    // 新用户没有头像、名字
    if (!userInfo.value.name || !userInfo.value.avatar_url) {
      userInfo.value.name = encate(userInfo.value.address)
      formData.set("name", userInfo.value.name)
      const randomImgIndex = Math.floor(Math.random() * 20 + 1)
      const avatar_url = computed(() => new URL(`../assets/img/avatar/${randomImgIndex}.svg`, import.meta.url).href);
      userInfo.value.avatar_url = avatar_url
      imageUrlToBase64(avatar_url.value, async (file) => {
        formData.set('avatar', file)
        const res = await put(`users/${userInfo.value.id}`, formData)
        cache.set('userInfo', res.data)
      })
    }
    if (!window.socketInstance) {
      window.socketInstance = SocketService.Instance;
      window.socketInstance.connect(config.websocketUrl(token), (res) => {
        const webscoketData = JSON.parse(res.data)
        const message = webscoketData.message
        // 成功
        ElNotification({
          title: message.title,
          message: message.message,
          type: 'info',
          duration: 0
        })
      });
=======
        cache.set("userInfo", res.data)
      }
    }
    if (!userInfo.value.name && !userInfo.value.avatar_url) {
      // 新用户没有头像 和 名字
      const formData = new FormData()
      formData.set("name", encate(userInfo.value.address))
      const randomImgIndex = Math.floor(Math.random() * 20 + 1)
      const avatar_url = '/src/assets/img/avatar/' + randomImgIndex + '.svg'
      imageUrlToBase64(avatar_url, async (file) => {
        formData.set('avatar', file)
        const res = await put(`users/${userInfo.value.id}`, formData)
        cache.set("userInfo", res.data)
      })
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/Header.vue
    }
  } else {
    walletSelectedAddress.value = ''
  }
}
// 检查到token变化 则更新
window.addEventListener("setItemEvent", async function (e) {
<<<<<<< HEAD:src/components/Header.vue
  if (e.key === "userInfo") {
    const data = JSON.parse(e.newValue);
    userInfo.value = data;
=======
  if (e.key === "token") {
    checkWallet()
  } else if (e.key === "userInfo") {
    userInfo.value = JSON.parse(e.newValue);
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/Header.vue
    console.log("cache")
  }
})
checkWallet()
const goPublish = () => {
  if (userInfo.value.is_verified) {
    goPath("/publishBook/-1/book")
  } else {
    emit('verify')
  }
}
</script>
<template>
  <div class="cusHeader">
    <div class="iconWrap" @click="goPath('/index')"> <img src="../assets/img/icon.png" alt=""> Bbook</div>
    <div class="rightCon" :key="rightConKey">
      <span class="public" @click="goPublish">create</span>
      <span class="rightTopIcon" @click="getWallet" v-if="!walletSelectedAddress">connect wallet</span>
      <el-popover placement="bottom-start" :width="200" trigger="hover" :show-arrow="false">
        <template #reference>
          <div class="personInfo" v-show="userInfo.avatar_url">
            <img :src="userInfo.avatar_url" class="avatar" />
            <div class="name">{{ userInfo.name || 'anonymous' }}</div>
            <el-icon>
              <CaretBottom />
            </el-icon>
          </div>
        </template>
        <ul class="operList">
          <li @click="goPath('/writePublishManagement/draft', 'checkIsAuthor')">
            <el-image :src="person_icon_1"></el-image>
            <span>Writing</span>
          </li>
          <li @click="goPath('/writePublishManagement/listed', 'checkIsAuthor')">
            <el-image :src="person_icon_2"></el-image>
            <span>Unlisted</span>
          </li>
          <li @click="goPath('/writePublishManagement/earnings', 'checkIsAuthor')">
            <el-image :src="person_icon_3"></el-image>
            <span>Earnings</span>
          </li>
          <li @click="goPath('/mycollection')">
            <el-image :src="person_icon_4"></el-image>
            <span>My collection</span>
          </li>
          <li @click="goPath('/concern')">
            <el-image :src="person_icon_5"></el-image>
            <span>Watchlist</span>
          </li>
          <li @click="goPath('/personSettings')">
            <el-image :src="person_icon_6"></el-image>
            <span>Settings</span>
          </li>
          <li @click="logout">
            <el-image :src="person_icon_7"></el-image>
            <span>Sign out</span>
          </li>
        </ul>
      </el-popover>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cusHeader {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  color: #7d5321;
  height: 65px;
  padding: 14px 0;

  .iconWrap {
    display: flex;
    align-items: center;
    font-size: 15px;
    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }

  .rightCon {
    // width: 290px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .public {
      cursor: pointer;
      font-size: 15px;
    }

    .rightTopIcon {
      line-height: 20px;
      text-align: center;
      background: #7d5321;
      border-radius: 10px;
      color: #ffe1b4;
      padding: 8px 10px;
      cursor: pointer;
      font-size: 15px;
      margin-left: 20px;
    }
  }

  .personInfo {
    // width: 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .avatar {
      width: 33px;
      height: 33px;
      // background: #98866e;
      border: 1px solid #98866e;
      border-radius: 50%;
      margin: 0 30px;
    }

    .name {
      font-size: 15px;
      font-family: PingFang SC;
      color: #7d5321;
    }

    .el-icon {
      width: 9px;
      height: 8px;
      color: #42392b;
      margin-top: -5px;
    }
  }
}

.operList {
  width: 100%;

  li {
    width: 100%;
    padding: 14px 0;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    .el-image {
      width: 15px;
      // height: 14px;
      margin: 0 14px 0 17px;
    }

    span {
      display: inline-block;
      flex: 1;
      font-size: 12px;
      color: #000000;
    }

    &:hover {
      background-color: #ffe1b4;
    }
  }
}
</style>