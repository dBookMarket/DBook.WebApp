<script setup>
import { ref, onMounted, nextTick } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import NoData from "../components/NoData.vue"
// import { Search } from '@element-plus/icons-vue'
import router from "../router"
import { get, post } from "../service/http"
import message from "../assets/lib/resetMessage"
const userInfo = ref({ desc: '', statistic: {} })
const headerWrapRef = ref()
// 获取用户信息
const getUserInfo = async (id) => {
  window.setLoading()
  const res = await get(`users/${id}`)
  if (res.ready) {
    userInfo.value = res.data
    await nextTick()
    headerWrapRef.value.style.backgroundImage = `url(${userInfo.value.banner_url})`
  }
  window.hideLoading()
}
// 获取藏品 collection
const collections = ref([])
const getCollection = async (id) => {
  const res = await get(`assets`, { user: id })
  collections.value = res.data.results
}
// 获取交易活动 activity
const activities = ref([])
const getActivity = async (id) => {
  const res = await get(`transactions`, { user: id })
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
  setTimeout(() => {
    getCollection(userId)
    getActivity(userId)
  }, 1000)
} else {
  router.push({ path: "/" })
}

const searchKey = ref('')
const cardIndex = ref(1)
const setCard = (index) => {
  cardIndex.value = index
}
const goLink = (key) => {
  console.log(userInfo.value)
  if (userInfo.value[key]) {
    window.open(userInfo.value[key])
  } else {
    message.warning("no " + key)
  }
}
const setBanner = () => {

}
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "..." + addr.substr(-4, 4)
  }
}
const checkBook = (row) => {
  router.push({ path: `/issueInfo/${row.id}/display` })
}
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
const isMoreDesription = ref(false)
</script>
<template>
  <div class="main">
    <div class="headerWrapImg" ref="headerWrapRef">
      <Header></Header>
      <div class="authorHeader">
        <div>
          <span class="authoreName">{{ userInfo.name || 'anonymous' }}</span>
          <span class="address" v-show="userInfo.address">{{ encate(userInfo.address) || '' }}</span>
        </div>
        <div class="iconBulk">
          <img src="../assets/img/site.svg" class="el-image" @click="goLink('website_url')">
          <img src="../assets/img/discord.svg" class="el-image" @click="goLink('discord_url')">
          <img src="../assets/img/twitter.svg" class="el-image" @click="goLink('twitter_url')"
            v-show="userInfo.twitter_url">
          <span class="stepLine"></span>
          <img src="../assets/img/isFan.svg" class="el-image" v-if="userInfo.is_fans" @click="cancelFans">
          <img src="../assets/img/shoucang_.svg" class="el-image" v-else @click="createFans">
        </div>
      </div>
    </div>
    <div class="authorDescription" >
      <div class="description"  :class="{ 'isMoreDesription': isMoreDesription ? true : false }">{{ userInfo.desc || '什么也没有留下' }}</div>
      <div class="moreBtn" @click="isMoreDesription = !isMoreDesription" v-if="userInfo.desc.length > 200">
        {{ isMoreDesription ? '收起' : " read more" }}
      </div>
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
      <el-image :src="userInfo.avatar_url" class="autorAvatar"></el-image>
    </div>
    <div class="navigator">
      <span :class="{ actived: cardIndex === 1 }" @click="setCard(1)">Publish books</span>
      <span :class="{ actived: cardIndex === 2 }" @click="setCard(2)">Activity</span>
      <span :class="{ actived: cardIndex === 3 }" @click="setCard(3)">Collectibles</span>
    </div>
    <div class="content" v-if="cardIndex == 1 || cardIndex == 3">
      <div class="cardList" v-show="cardIndex === 1">
        <div class="card" v-for="(issue, index) in publishedList" :key="index">
          <el-image class="postImg" :src="issue.book.cover_url" @click="checkBook(issue)" fit="cover"></el-image>
          <div class="rightC">
            <div class="cTop">
              <el-image class="ava" :src="issue.book.author.avatar_url"></el-image>
              <span class="name">{{ issue.book.author.name || '-' }}</span>
            </div>
            <div class="cCon">
              {{ issue.book.title }}
            </div>
            <div class="cBottom">
              <div class="cBc">
                <div class="label">Floor price</div>
                <div class="value">{{ issue.price_range.min_price }}USDC</div>
              </div>
              <div class="cBc">
                <div class="label">FCirculation </div>
                <div class="value">{{ issue.n_circulations }}</div>
              </div>
              <div class="cBc">
                <div class="label">Destruction</div>
                <div class="value">{{ issue.destroy_log || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
        <NoData v-show="publishedList.length === 0"></NoData>
      </div>
      <div v-show="cardIndex === 3">
        <NoData v-show="collections.length === 0"></NoData>
      </div>
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
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .content {
    min-height: calc(100vh - 535px);
  }

  .fullContentWidth {
    width: $navigatorWidth;
    min-width: 1200px;
    min-height: calc(100vh - 535px);
    margin: 0 auto;
    padding-bottom: 30px;
  }

  .headerWrapImg {
    background: #ffe1b4;
    background-repeat: no-repeat;
    background-size: cover;

    .authorHeader {
      display: flex;
      justify-content: space-between;
      width: $contentWidth;
      min-width: $contentMinWidth;
      margin: 82px auto 0 auto;
      padding-bottom: 10px;
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
      color: #7D5321;
      border-bottom: 1px solid #7D5321;
      padding-bottom: 4px;
      cursor: pointer;
      margin: 5px 0 20px 0;
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
    padding-left: 24px;

    span {
      display: inline-block;
      font-size: 15px;
      color: #42392b;
      margin-right: 51px;
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
    margin: 0 auto;

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