<script setup>
import { ref } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import router from "../router/index"
import { get } from "../service/http"
import NoData from "../components/NoData.vue"
const goAuthor = () => {
  router.push({ path: '/authorCenter' })
}
const currentType = ref("")
const wishlists = ref([])
// 获取收藏的图书
const getWishlists = async () => {
  const res = await get('wishlists/current')
  if (res.ready) {
    console.log(res.data)
    wishlists.value = res.data.results
  }
}
// 获取关注的作者
const fansList = ref([])
const getFans = async () => {
  const res = await get('fans/current')
  if (res.ready) {
    fansList.value = res.data.results
  }
}
const changeType = (type) => {
  if (type === 'Opus') getWishlists()
  if (type === 'Author') getFans()
  currentType.value = type
}
changeType("Opus")
</script>
<template>
  <div class="main">
    <div class="headerWrap">
      <Header></Header>
    </div>
    <div class="content">
      <div class="title">Concern</div>
      <div class="navigator">
        <span :class="currentType === 'Opus' ? 'actived' : ''" @click="changeType('Opus')">Opus</span>
        <span :class="currentType === 'Author' ? 'actived' : ''" @click="changeType('Author')">Author</span>
      </div>
      <!-- 收藏图书 -->
      <div class="lists" v-show="currentType === 'Opus'">
        <div class="item" v-for="item in wishlists" :key="item.id">
          <img :src="item?.issue?.cover_url" alt="">
          <div class="name">{{ item?.issue?.author?.name }}</div>
        </div>
        <NoData v-show="wishlists.length === 0"></NoData>
      </div>
      <!-- 关注作者 -->
      <div class="lists" v-show="currentType === 'Author'">
        <div class="item" v-for="item in fansList" :key="item.id">
          <img :src="item?.author?.avatar_url" alt="">
          <div class="name">{{ item?.author?.name }}</div>
        </div>
        <NoData v-show="fansList.length === 0"></NoData>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .headerWrap {
    background: #ffe1b4;
  }

  .content {
    width: $contentWidth;
    min-width: $contentMinWidth;
    min-height: calc(100vh - 61px - 170px - 30px - 91px) !important;
    flex: 1;
    margin: 0 auto;
    position: relative;
    padding-top: 91px;
    min-height: 63.5vh;

    .title {
      font-size: 22px;
      font-family: Alibaba PuHuiTi;
      color: #42392b;
      margin-bottom: 40px;
    }

    .navigator {
      height: 43px;
      line-height: 43px;
      background: #fff7ec;
      padding-left: 54px;
      margin-bottom: 40px;

      span {
        display: inline-block;
        font-size: 15px;
        font-family: PingFang SC;
        color: #a08f79;
        margin-right: 80px;
        cursor: pointer;

        &.actived {
          font-family: PingFang SC;
          color: #42392b;
        }
      }

      span.actived {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 200%;
          height: 2px;
          background: #42392b;
          border-radius: 1px;
        }
      }
    }

    .lists {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 117px;
        text-align: center;
        margin-right: 30px;
        margin-bottom: 25px;

        img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
        }

        div {
          font-size: 15px;
          font-family: Alibaba PuHuiTi;
          color: #42392b;
          margin-top: 18px;
        }
      }
    }
  }
}
</style>