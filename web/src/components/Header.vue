<script setup>
import { nextTick, onMounted, ref, defineEmits } from "vue"
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
const walletSelectedAddress = ref('')
const userInfo = ref({})
// 唤起钱包 并 签名
const walletInstance = new Wallet()
const getWallet = async () => {
  cache.clear()
  const address = await walletInstance.getAddress()
  if (address) {
    const res = await post("nonce", { address })
    const signature = await walletInstance.getSignature(res.data.nonce, address)
    const loginRes = await post("login", { address, signature })
    if (loginRes.ready) {
      cache.set("address", address, 10, 'day')
      cache.set("nonce", res.data.nonce, 10, 'day')
      cache.set("token", loginRes.data.token, 10, 'day')
      checkWallet()
    }
  } else {
    message.warning("address error")
  }
}
const rightConKey = ref(0)
const logout = async () => {
  const res = await post("logout")
  if (res.ready) {
    cache.clear()
    message.success("Logout success ！")
    router.push({ path: '/index' })
    checkWallet()
    rightConKey.value++
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
        cache.set("userInfo", res.data)
        userInfo.value = res.data
      }
    }
    console.log(userInfo.value.address,encate(userInfo.value.address))
        userInfo.value.name = encate(userInfo.value.address)
    if (!userInfo.value.avatar_url) {
      const avatar = await get("https://api.uomg.com/api/rand.avatar?sort=动漫男&format=json")
      if (avatar.data.imgurl) {
        // const formData = new FormData()
        // formData.set('avatar', avatar.data)
        // const res = await put(`users/${userInfo.value.id}`, formData)
        // if (res.ready) {
        //   message.success("update success !")
        //   cache.set("userInfo", res.data)
        // }
          userInfo.value.avatar_url = avatar.data.imgurl
        
          cache.set("userInfo", userInfo.value)
      }
    }
  } else {
    walletSelectedAddress.value = ''
  }
}
// 检查到token变化 则更新
window.addEventListener("setItemEvent", async function (e) {
  if (e.key === "token") {
    checkWallet()
  } else if (e.key === "userInfo") {
    await nextTick()
    userInfo.value = JSON.parse(e.newValue);
    // console.log(userInfo.value)

  }
})
checkWallet()
const emit = defineEmits(['verify'])
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
      <span class="public" @click="goPublish">Publish books</span>
      <span class="rightTopIcon" @click="getWallet" v-if="!walletSelectedAddress">Link wallet</span>
      <el-popover placement="bottom-start" :width="200" trigger="hover" :show-arrow="false">
        <template #reference>
          <div class="personInfo" v-show="walletSelectedAddress">
            <el-image :src="userInfo.avatar_url" class="avatar"></el-image>
            <div class="name">{{ userInfo.name || 'anonymous' }}</div>
            <el-icon>
              <CaretBottom />
            </el-icon>
          </div>
        </template>
        <ul class="operList">
          <li @click="goPath('/writePublishManagement/draft')">
            <el-image :src="person_icon_1"></el-image>
            <span>Writing</span>
          </li>
          <li @click="goPath('/writePublishManagement/listed')">
            <el-image :src="person_icon_2"></el-image>
            <span>Publication management</span>
          </li>
          <li @click="goPath('/writePublishManagement/earnings')">
            <el-image :src="person_icon_3"></el-image>
            <span>Earnings</span>
          </li>
          <li @click="goPath('/mycollection')">
            <el-image :src="person_icon_4"></el-image>
            <span>My collection</span>
          </li>
          <li @click="goPath('/concern')">
            <el-image :src="person_icon_5"></el-image>
            <span>Concern</span>
          </li>
          <li @click="goPath('/personSettings')">
            <el-image :src="person_icon_6"></el-image>
            <span>Personal settings</span>
          </li>
          <li @click="logout">
            <el-image :src="person_icon_7"></el-image>
            <span>Quit</span>
          </li>
        </ul>
      </el-popover>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cusHeader {
  width: $contentWidth;
  min-width: $contentMinWidth;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  color: #7d5321;
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
      margin-right: 40px;
    }

    .rightTopIcon {
      width: 99px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background: #7d5321;
      border-radius: 10px;
      color: #ffe1b4;
      padding: 8px;
      cursor: pointer;
      font-size: 15px;
    }
  }

  .personInfo {
    width: 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .avatar {
      width: 33px;
      height: 33px;
      // background: #98866e;
      border: 1px solid #98866e;
      border-radius: 50%;
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