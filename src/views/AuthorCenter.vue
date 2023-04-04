<script setup>
import { ref, onMounted, nextTick } from "vue"
import BannerHeader from "../components/BannerHeader.vue"
import Footer from "../components/Footer.vue"
import NoData from "../components/NoData.vue"
import router from "../router"
import { get, post } from "../service/http"
import BookListCom from "../components/BookList.vue"
const userInfo = ref({ desc: '', statistic: {} })
// 获取用户信息
const getUserInfo = async (id) => {
  window.setLoading()
  const res = await get(`users/${id}`)
  if (res.ready) {
    userInfo.value = res.data
  }
  window.hideLoading()
}
// 获取藏品 collection
let collections = []
const issueList = ref([])
const getCollection = async (id) => {
  const res = await get(`assets`, { user: id })
  collections = res.data.results
  console.log(collections)
  issueList.value = collections.map(el => el.issue)
}
// 获取交易活动 activity
const activities = ref([])
const getActivity = async (id) => {
  const res = await get(`transactions`, { author: id })
  activities.value = res.data.results
}
// 获取发布的书籍 published book
const publishedList = ref([])
const getPublished = async (id) => {
  const res = await get(`issues`, { author: id })
  publishedList.value = res.data.results
}
const userId = router.currentRoute.value.params.id
if (userId) {
  getUserInfo(userId)
  getPublished(userId)
} else {
  router.push({ path: "/" })
}
const cardIndex = ref(1)
const setCard = (index) => {
  cardIndex.value = index
  if (index == 1) {
    getPublished(userId)
  }
  if (index == 2) {
    getActivity(userId)
  }
  if (index == 3) {
    getCollection(userId)

  }
}
</script>
<template>
  <div class="main authorView">
    <BannerHeader :userData="userInfo"></BannerHeader>
    <div class="navigator">
      <span :class="{ actived: cardIndex === 1 }" @click="setCard(1)">Publish books</span>
      <span :class="{ actived: cardIndex === 2 }" @click="setCard(2)">Activity</span>
      <span :class="{ actived: cardIndex === 3 }" @click="setCard(3)">Collection </span>
    </div>
    <div class="content" v-if="cardIndex == 1">
      <BookListCom :options="{ issueList: publishedList, gridType: 'grid2' }"></BookListCom>
    </div>
    <div v-show="cardIndex === 2" class="fullContentWidth">
      <el-table :data="activities">
        <el-table-column label="Event" prop="type"></el-table-column>
        <el-table-column label="Book">
          <template #default="scope">
            {{ scope.row.issue.book.title }}
          </template>
        </el-table-column>
        <el-table-column label="Unit Price" prop="price"></el-table-column>
        <el-table-column label="Quantity" prop="quantity"></el-table-column>
        <el-table-column label="From" prop="from">
          <template #default="scope">
            {{ scope.row.buyer.name }}
          </template>
        </el-table-column>
        <el-table-column label="To" prop="to">
          <template #default="scope">
            {{ scope.row.seller.name }}
          </template>
        </el-table-column>
        <el-table-column label="Date" prop="created_at" show-overflow-tooltip></el-table-column>
      </el-table>
      <NoData v-show="activities.length === 0"></NoData>
    </div>
    <div v-show="cardIndex === 3" class="fullContentWidth">
      <BookListCom :options="{ issueList, gridType: 'grid3' }"></BookListCom>
      <NoData v-show="issueList.length === 0"></NoData>
    </div>
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.leftC {
  position: relative;

  .postImg {
    width: 140px;
    height: 180px;
    cursor: pointer;
  }

  .tip {
    width: 99px;
    height: 40px;
    line-height: 30px;
    padding-left: 8px;
    position: absolute;
    left: -8px;
    top: 5px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 10px;
    font-family: Alibaba PuHuiTi;
    color: #ffffff;

    //销售中 在售
    &.on_sale {
      background-image: url(../assets/img/tag_yellow.svg);
    }

    //停止销售 销毁
    &.off_sale {
      background-image: url(../assets/img/tag_red.svg);
    }

    //未售出的 流拍
    &.unsold {
      background-image: url(../assets/img/tag_red.svg);
    }

    //即将发售
    &.pre_sale {
      background-image: url(../assets/img/tag_red.svg);
    }
  }
}

.authorView {
  width: 100%;
  height: 100%;
  position: relative;

  .fullContentWidth {
    min-height: calc(100vh - 535px);
    margin: 0 auto;
    padding-bottom: 30px;
  }

  .content {
    .search {
      margin: 60px 0 66px 0;
      width: 100%;
      position: relative;

      .el-input {
        width: 100%;
        background: #ffffff;
        border: 1px solid #000000;
        border-radius: 0;

        .el-input__inner,
        .el-input__inner:hover {
          border: none;
        }
      }

      .tip {
        width: 100%;
        position: absolute;
        bottom: -44px;
        left: 0;
        height: 31px;
        font-size: 15px;
        color: #da4b4b;
      }
    }

    // 以发布的图书
    .cardList {
      width: 100%;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;

      .card {
        width: 33%;
        margin-bottom: 23px;
        display: flex;
        // justify-content: space-between;

        .postImg {
          width: 140px;
          height: 180px;
          cursor: pointer;
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