<script setup>
import { ref, onMounted, nextTick } from "vue"
import Footer from "../components/Footer.vue"
import NoData from "../components/NoData.vue"
import { Search } from '@element-plus/icons-vue'
import { get, post } from "../service/http"
import cache from "../assets/lib/cache"
import AssetCom from "../components/MyCollection/asset.vue"
import TradesCom from "../components/MyCollection/trades.vue"
import ShouyiCom from "../components/MyCollection/transactions.vue"
import message from "../assets/lib/resetMessage"
import BannerHeader from "../components/BannerHeader.vue"
const searchKey = ref('')
const cardIndex = ref(1)
const headerWrapRef = ref(null)
const userInfo = ref({ desc: '', statistic: {} })
onMounted(() => {
  userInfo.value = cache.get("userInfo")
  console.log(userInfo.value)
})
const setCard = (index) => {
  cardIndex.value = index
}
</script>
<template>
  <div class="main myCollection">
    <BannerHeader :userData="userInfo"></BannerHeader>
    <div class="navigator">
      <span :class="{ actived: cardIndex === 1 }" @click="setCard(1)">My Collection</span>
      <span :class="{ actived: cardIndex === 2 }" @click="setCard(2)">Pending orders</span>
      <span :class="{ actived: cardIndex === 3 }" @click="setCard(3)">Earnings</span>
    </div>
    <div class="content">
      <AssetCom v-if="cardIndex === 1"></AssetCom>
      <TradesCom v-if="cardIndex === 2"></TradesCom>
      <ShouyiCom v-if="cardIndex === 3"></ShouyiCom>
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
    flex: 1;

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