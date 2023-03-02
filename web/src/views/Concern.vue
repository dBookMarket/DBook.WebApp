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
  console.log(fansList.value)
}
const changeType = (type) => {
  if (type === 'Opus') getWishlists()
  if (type === 'Author') getFans()
  currentType.value = type
}
changeType("Opus")
// 查看作者
const checkAuthor = (row) => {
  console.log(row)
  router.push({ path: 'authorCenter/' + row.author.id })
}
// 查看图书
const checkBook = (row) => {
  router.push({ path: `/issueInfo/${row.issue.id}/display` })
}
const calcText = (status) => {
  let text = ''
  switch (status) {
    //销售中 在售
    case 'on_sale': text = '在售'; break;
    //停止销售 销毁
    case 'off_sale': text = ''; break;
    //未售出的 流拍
    case 'unsold': text = '流拍'; break;
    //即将发售
    case 'pre_sale': text = '即将发售'; break;
  }
  return text
}
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
    <div class="cardList" v-show="currentType === 'Opus'">
      <div class="card" v-for="item in wishlists" :key="item.id">
        <div class="leftC">
          <el-image class="postImg" :src="item.issue.book.cover_url" @click="checkBook(item)"></el-image>
            <div :class="['tip', item.issue.status]" v-if="item.issue.status !== 'off_sale'">
              {{ calcText(item.issue.status) }}
            </div>
          </div>
          <div class="rightC">
            <div class="cTop">
              <el-image class="ava" :src="item.issue.book.author.avatar_url" @click="checkUser(item)"></el-image>
              <span class="name" @click="checkUser(item)">{{ item.issue.book.author.name }}</span>
            </div>
            <div class="cCon">
              {{ item.issue.book.title }}
            </div>
            <div class="presaleClock" v-if="item.status == 'pre_sale'">
              <img src="../assets/img/clock.svg" alt="">
              <span>{{ item.issue.published_at }}</span>
            </div>
            <div class="cBottom" v-if="item.status == 'pre_sale'">
              <div class="cBc">
                <div class="label">listed price</div>
                <div class="value">{{ item.issue.price }}</div>
              </div>
              <div class="cBc">
                <div class="label">RN</div>
                <div class="value">{{ item.issue.buy_limit }}</div>
              </div>
            </div>
            <div class="cBottom" v-else>
              <div class="cBc">
                <div class="label">Floor price</div>
                <div class="value">{{ item.issue.price }}</div>
              </div>
              <div class="cBc">
                <div class="label">owners/burn</div>
                <div class="value">{{ item.issue.n_circulations }}/{{ item.issue.quantity - item.issue.n_circulations }}</div>
              </div>
            </div>
          </div>
        </div>
        <NoData v-show="wishlists.length === 0"></NoData>
      </div>
      <!-- <div class="lists">
            <div class="item" v-for="item in wishlists" :key="item.id" @click="checkBook(item)">
              <img :src="item?.issue?.book.cover_url" alt="">
              <div class="name">{{ item?.issue?.author?.name }}</div>
            </div> -->
      <!-- </div> -->
      <!-- 关注作者 -->
      <div class="lists" v-show="currentType === 'Author'">
        <div class="item" v-for="item in fansList" :key="item.id" @click="checkAuthor(item)">
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
        cursor: pointer;

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

  .cardList {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    text-align: left;

    .card {
      width: 49%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 23px;

      .leftC {
        position: relative;

        .postImg {
          width: 140px;
          height: 180px;
          cursor: pointer;
        }

        .tip {
          width: 90px;
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
          color: #FFFFFF;

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



      .rightC {
        flex: 1;
        margin-left: 22px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding-right: 20px;

        .cTop {
          display: flex;
          cursor: pointer;

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
            color: #999999;
          }
        }

        .cCon {
          font-size: 18px;
          color: #000000;
          line-height: 26px;
          font-family: PingFang SC;
        }

        .presaleClock {
          display: flex;
          align-items: center;

          img {
            width: 13px;
            height: 13px;
            margin-right: 12px;
          }

          span {
            font-size: 12px;
            color: #8B5E28;
          }
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
            }

            .value {
              color: #000000;
              line-height: 27px;
            }
          }
        }
      }
    }
  }
}
</style>