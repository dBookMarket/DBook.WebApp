<script setup>
import { ref, watch, nextTick } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import NoData from "../components/NoData.vue"
import { Search, InfoFilled, SuccessFilled } from '@element-plus/icons-vue'
import testImg from "../assets/img/test.jpg"
import { get, post, del } from "../service/http"
import message from "../assets/lib/resetMessage"
import cache from "../assets/lib/cache"
import router from "../router"
import DRAFT from "../components/WritePublish/draft.vue"
import LISTED from "../components/WritePublish/listed.vue"
import AVAILABEL from "../components/WritePublish/available.vue"
import SHOUYI from "../components/WritePublish/shouyi.vue"
const searchKey = ref('')
const cardType = ref('')
cardType.value = router.currentRoute.value.params.type
// 右上角切换的时候再次触发
watch(() => router.currentRoute.value.params, (newValue, oldValue) => {
  cardType.value = newValue.type
}, { immediate: true }
)
const userInfo = ref({})
userInfo.value = cache.get("userInfo") || {}
window.addEventListener("setItemEvent", async function (e) {
  if (e.key === "userInfo") {
    await nextTick()
    userInfo.value = JSON.parse(e.newValue);
  }
})
const draftIndex = ref()
const setCard = (type) => {
  router.push({ path: `/writePublishManagement/${type}` })
}
const goLink = (key) => {
  if (userInfo.value[key]) {
    window.open(userInfo.value[key])
  } else {
    message.warning("no " + key)
  }
}
// 收藏
const shoucang = () => {

}
// 分享
const share = () => {

}
const draftEdit = (row) => {
  if (row && row.id) {
    router.push({ path: `/draftEdit/${row.id}` })
  } else {
    router.push({ path: `/draftEdit/-1` })
  }
}
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "****" + addr.substr(-4, 4)
  }
}
</script>
<template>
  <div class="main">
    <div class="headerWrapImg">
      <Header></Header>
      <div class="authorHeader">
        <div>
          <span class="authoreName">{{ userInfo.name || 'anonymous' }}</span>
          <span class="address">{{ encate(userInfo.address) || '' }}</span>
        </div>
        <div class="iconBulk">
          <img src="../assets/img/site.svg" title="website url" class="el-image" @click="goLink('website_url')">
          <img src="../assets/img/discord.svg" title="discord url" class="el-image" @click="goLink('discord_url')">
          <img src="../assets/img/twitter.svg" class="el-image" @click="goLink('twitter_url')">
          <span class="stepLine"></span>
          <!-- <img src="../assets/img/shoucang_.svg" class="el-image" @click="shoucang"> -->
          <img src="../assets/img/share_.svg" class="el-image" @click="share">
        </div>
      </div>
    </div>
    <div class="authorDescription">
      <el-tooltip placement="bottom">
        <template #content> {{ userInfo.desc }}</template>
        <div class="description">{{ userInfo.desc || 'no description' }}</div>
      </el-tooltip>
      <div class="numbersList">
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.total_volume || 0 }}</div>
          <div class="label">总体积</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.min_price || 0 }}</div>
          <div class="label">底价</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.max_price || 0 }}</div>
          <div class="label">最高价</div>
        </div>
        <div class="stepLine"></div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.total_books || 0 }}</div>
          <div class="label">图书总量</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.n_destroyed || 0 }}</div>
          <div class="label">burn</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.n_owners || 0 }}</div>
          <div class="label">owners</div>
        </div>
      </div>
      <el-image :src="userInfo.avatar_url" class="autorAvatar"></el-image>
    </div>
    <div class="navigator">
      <span :class="{ actived: cardType === 'draft' }" @click="setCard('draft')">草稿</span>
      <span :class="{ actived: cardType === 'listed' }" @click="setCard('listed')">待上架</span>
      <span :class="{ actived: cardType === 'available' }" @click="setCard('available')">已上架</span>
      <span :class="{ actived: cardType === 'earnings' }" @click="setCard('earnings')">收益</span>
      <span class="writingBookBtn" @click="draftEdit({ id: -1 })">撰写书籍</span>
    </div>
    <div class="content">
      <!-- 草稿 -->
      <DRAFT v-show="cardType === 'draft'"></DRAFT>
      <!-- 即将上架 -->
      <LISTED v-show="cardType === 'listed'"></LISTED>
      <!-- 已上架 -->
      <AVAILABEL v-show="cardType === 'available'"></AVAILABEL>
      <!-- 收益 -->
      <SHOUYI v-show="cardType === 'earnings'"></SHOUYI>

    </div>
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;


  .headerWrapImg {
    background: #ffe1b4;

    .authorHeader {
      display: flex;
      justify-content: space-between;
      width: $contentWidth;
      min-width: $contentMinWidth;
      margin: 10px auto 0 auto;

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

      .iconBulk {
        .el-image {
          width: 25px;
          height: 25px;
          border-radius: 25px;
          margin-left: 25px;
          cursor: pointer;
        }

        .stepLine {
          display: inline-block;
          width: 1px;
          height: 25px;
          background: #42392b;
          margin-left: 25px;
        }
      }
    }
  }

  .authorDescription {
    width: $contentWidth;
    min-width: $contentMinWidth;
    margin: 0 auto;
    position: relative;
    padding-top: 10px;

    .description {
      width: 1031px;
      height: 45px;
      font-size: 15px;
      color: #999999;
      margin-bottom: 30px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 2; //行数
      line-clamp: 2;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }

    .numbersList {
      display: flex;
      justify-content: space-between;

      .numberCard {
        line-height: 26px;

        .value {
          font-size: 18px;
          color: #000000;
        }

        .label {
          font-size: 12px;
          color: #999999;
        }
      }

      .stepLine {
        display: inline-block;
        width: 1px;
        height: 48px;
        background: #999999;
      }
    }

    .autorAvatar {
      position: absolute;
      left: -142px;
      top: -48px;
      width: 117px;
      height: 117px;
      border-radius: 117px;
    }
  }

  .navigator {
    width: $navigatorWidth;
    min-width: $minNavigatorWidth;
    height: 43px;
    line-height: 43px;
    background: #fff7ec;
    margin: 20px auto 30px auto;
    position: relative;

    span {
      display: inline-block;
      font-size: 15px;
      color: #42392b;
      margin-right: 51px;
      cursor: pointer;
    }

    span:first-child {
      margin-left: 24px;
    }

    span.actived {
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        content: "";
        width: 110%;
        height: 2px;
        background: #42392b;
        border-radius: 1px;
      }
    }

    .writingBookBtn {
      position: absolute;
      right: 0;
      top: 0;
      width: 115px;
      height: 43px;
      background: #42392B;
      font-size: 15px;
      font-family: PingFang SC;
      color: #FFF7EC;
      text-align: center;
      margin-right: 0;
    }
  }

  .content {
    // width: $contentWidth ;
    width: $navigatorWidth;
    min-width: $minNavigatorWidth;
    min-height: calc(100vh - 535px);
    margin: 0 auto;

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