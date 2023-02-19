<script setup>
import { ref, onMounted, nextTick } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import NoData from "../components/NoData.vue"
import { Search } from '@element-plus/icons-vue'
import testImg from "../assets/img/test.jpg"
import { get, post } from "../service/http"
import router from "../router/index"
import cache from "../assets/lib/cache"
import AssetCom from "../components/MyCollection/asset.vue"
import TradesCom from "../components/MyCollection/trades.vue"
import ShouyiCom from "../components/MyCollection/transactions.vue"
const searchKey = ref('')
const cardIndex = ref(1)
const headerWrapRef = ref(null)
const userInfo = ref({ statistic: {} })
onMounted(() => {
  userInfo.value = cache.get("userInfo") || {}
  headerWrapRef.value.style.backgroundImage = `url(${userInfo.value.banner_url})`
  // 检查到token变化 则更新
  window.addEventListener("setItemEvent", async function (e) {
    if (e.key === "userInfo") {
      await nextTick()
      userInfo.value = JSON.parse(e.newValue);
      headerWrapRef.value.style.backgroundImage = `url(${userInfo.value.banner_url})`
    }
  })
})
const setCard = (index) => {
  cardIndex.value = index
}
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "****" + addr.substr(-4, 4)
  }
}
const goLink = (key) => {
  if (userInfo.value[key]) {
    window.open(userInfo.value[key])
  } else {
    message.warning("no " + key)
  }
}
</script>
<template>
  <div class="main">
    <div class="headerWrapImg" ref="headerWrapRef">
      <Header></Header>
      <div class="authorHeader">
        <div>
          <span class="authoreName">{{ userInfo.name || 'anonymous' }}</span>
          <span class="address">{{ encate(userInfo.address) || '' }}</span>
        </div>
        <div class="iconBulk">
          <img src="../assets/img/site.svg" class="el-image" @click="goLink('website_url')">
          <img src="../assets/img/discord.svg" class="el-image" @click="goLink('discord_url')">
          <img src="../assets/img/twitter.svg" class="el-image">
          <span class="stepLine"></span>
          <img src="../assets/img/setting.svg" class="el-image">
        </div>
      </div>
    </div>
    <div class="authorDescription">
      <el-tooltip placement="bottom">
        <template #content> {{ userInfo.desc || '什么也没有留下' }}</template>
        <div class="description">{{ userInfo.desc || '什么也没有留下' }}</div>
      </el-tooltip>
      <div class="numbersList">
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.total_volume || 0 }}</div>
          <div class="label">Total volume</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.min_price || 0 }}</div>
          <div class="label">Min price</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.max_price || 0 }}</div>
          <div class="label">Max price</div>
        </div>
        <div class="stepLine"></div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.total_books || 0 }}</div>
          <div class="label">Total number of books</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.sales || 0 }}</div>
          <div class="label">Sales</div>
        </div>
        <div class="numberCard">
          <div class="value">{{ userInfo.statistic?.n_owners || 0 }}</div>
          <div class="label">Owner</div>
        </div>
      </div>
      <el-image :src="testImg" class="autorAvatar"></el-image>
    </div>
    <div class="navigator">
      <span :class="{ actived: cardIndex === 1 }" @click="setCard(1)">My Collection</span>
      <span :class="{ actived: cardIndex === 2 }" @click="setCard(2)">Pending orders</span>
      <span :class="{ actived: cardIndex === 3 }" @click="setCard(3)">Earnings</span>
    </div>
    <div class="content">
      <AssetCom v-show="cardIndex === 1"></AssetCom>
      <TradesCom v-show="cardIndex === 2"></TradesCom>
      <ShouyiCom v-show="cardIndex === 3"></ShouyiCom>
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
    background-repeat: no-repeat;
    background-size: cover;

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
    min-width: 1200px;
    height: 43px;
    line-height: 43px;
    background: #fff7ec;
    margin: 20px auto 30px auto;
    // padding-left: 24px;

    span {
      display: inline-block;
      font-size: 15px;
      color: #42392b;
      margin-right: 27px;
      margin-left: 24px;
      cursor: pointer;
    }

    span.actived {
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        content: "";
        width: 94px;
        height: 2px;
        background: #42392b;
        border-radius: 1px;
      }
    }
  }

  .content {
    width: $navigatorWidth;
    min-width: 1200px;
    min-height: calc(100vh - 536px);
    flex: 1;
    margin: 0 auto;

    .cardList {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .card {
        width: 49%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 23px;

        .postImg {
          width: 140px;
          height: 180px;
        }

        .rightC {
          flex: 1;
          margin-left: 22px;
          display: flex;
          justify-content: space-between;
          flex-direction: column;

          .cTop {
            display: flex;

            .ava {
              width: 24px;
              height: 24px;
              // background: #4c9b85;
              border-radius: 50%;
              margin-right: 15px;
            }

            .name {
              height: 16px;
              font-size: 15px;
              font-family: Alibaba PuHuiTi;
              color: #999999;
            }
          }

          .cCon {
            font-size: 18px;
            font-family: PingFang SC;
            color: #000000;
            line-height: 26px;
          }

          .cBottom {
            display: flex;
            height: 50px;
            justify-content: space-between;

            .cBc {
              height: 39px;
              display: flex;
              flex-direction: column;
              width: 33%;

              .label {
                color: #999999;
                line-height: 27px;
                font-size: 12px;
              }

              .value {
                color: #000000;
                line-height: 27px;
                font-size: 15px;
              }
            }
          }
        }
      }
    }

  }
}
</style>