<script setup>
import { ref, watch, nextTick, onMounted } from "vue"
import Footer from "../components/Footer.vue"
import cache from "../assets/lib/cache"
import router from "../router"
import DRAFT from "../components/WritePublish/draft.vue"
import LISTED from "../components/WritePublish/listed.vue"
import BookList from "../components/BookList.vue"
import SHOUYI from "../components/WritePublish/shouyi.vue"
import BannerHeader from "../components/BannerHeader.vue"
const cardType = ref('')
cardType.value = router.currentRoute.value.params.type
console.log(cardType.value)
// 右上角切换的时候再次触发
watch(() => router.currentRoute.value.params, (newValue, oldValue) => {
  cardType.value = newValue.type
}, { immediate: true }
)
const userInfo = ref({ desc: "" })
userInfo.value = cache.get("userInfo") || {}
const setCard = (type) => {
  router.push({ path: `/writePublishManagement/${type}` })
}
const draftEdit = (row) => {
  if (row && row.id) {
    router.push({ path: `/draftEdit/${row.id}` })
  } else {
    router.push({ path: `/draftEdit/-1` })
  }
}
</script>
<template>
  <div class="main writePublishManage">
    <BannerHeader :user-data="userInfo"></BannerHeader>
    <div class="navigator">
      <span :class="{ actived: cardType === 'draft' }" @click="setCard('draft')">Draft</span>
      <span :class="{ actived: cardType === 'listed' }" @click="setCard('listed')">Unlisted</span>
      <span :class="{ actived: cardType === 'available' }" @click="setCard('available')">Listed</span>
      <span :class="{ actived: cardType === 'earnings' }" @click="setCard('earnings')">Earnings</span>
      <span class="writingBookBtn" @click="draftEdit({ id: -1 })">write</span>
    </div>
    <div class="content">
      <!-- 草稿 -->
      <DRAFT v-if="cardType === 'draft'"></DRAFT>
      <!-- 即将上架 -->
      <LISTED v-if="cardType === 'listed'"></LISTED>
      <!-- 已上架 -->
      <BookList v-if="cardType === 'available'" :options="{ api: '/issues/current', operaIcon: true }"></BookList>
      <!-- 收益 -->
      <SHOUYI v-if="cardType === 'earnings'"></SHOUYI>
    </div>
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .content {
    .fradtWrap {
      display: flex;
      flex-wrap: wrap;

      .card {
        width: 140px;
        height: 100px;
        flex-shrink: 0;
        background: #f4ce96;
        border: 1px solid #000000;
        margin-right: 50px;
        position: relative;
        text-align: center;
        padding-top: 80px;
        margin-bottom: 20px;
        cursor: pointer;

        .el-icon {
          position: absolute;
          top: 11px;
          right: 12px;
          color: #fff;
          font-size: 20px;
        }

        img {
          width: 34px;
          height: 35px;
          margin: 0 auto;
        }

        >div {
          font-size: 15px;
          font-family: Alibaba PuHuiTi;
          color: #ad8141;
          text-align: center;
        }
      }

      .card.active {
        .el-icon {
          color: #000;
        }
      }
    }

    .cardOperaList {
      .cardOperaItem {
        display: inline-flex;
        margin-right: 60px;
        margin-bottom: 20px;
      }

      .cardOperaItem.draftCard {
        .card_left {
          width: 138px;
          height: 100px;
          background: #f4ce96;
          border: 1px solid #000000;
          position: relative;
          text-align: center;
          padding-top: 80px;
          margin-bottom: 20x;
          margin-right: 24px;
          cursor: pointer;

          .el-icon {
            position: absolute;
            top: 11px;
            right: 12px;
            color: #fff;
            font-size: 20px;
          }

          img {
            width: 34px;
            height: 35px;
            margin: 0 auto;
          }

          >div {
            font-size: 15px;
            font-family: Alibaba PuHuiTi;
            color: #ad8141;
            text-align: center;
            height: 43px;
            overflow: hidden;
          }
        }
      }

      .card_left {
        .imgCover {
          padding-right: 14px;

          img {
            width: 140px;
            height: 180px;
          }
        }

        .bookName {
          width: 164px;
          font-size: 12px;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .card_right {
        .opList {
          .opItem {
            margin-bottom: 25px;
            cursor: pointer;
            align-items: center;
            display: flex;

            img {
              width: 12px;
              height: 14px;
              margin-right: 9px;
            }

            span {
              font-size: 15px;
              color: #000000;
            }
          }

          .opItem.delWrap {
            span {
              color: red;
            }
          }
        }
      }
    }
  }
}
</style>