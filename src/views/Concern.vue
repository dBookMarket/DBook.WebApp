<script setup>
import { ref } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import router from "../router/index"
import { get } from "../service/http"
import NoData from "../components/NoData.vue"
import BookList from "../components/BookList.vue"
const goAuthor = () => {
  router.push({ path: '/authorCenter' })
}
const currentType = ref("")
const wishlists = ref([])
const issueList = ref([])
// 获取收藏的图书
const getWishlists = async () => {
  window.setLoading()
  const res = await get('wishlists/current')
  if (res.ready) {
    wishlists.value = res.data.results
    issueList.value = res.data.results.map(el => el.issue)
  }
  window.hideLoading()
}
// 获取关注的作者
const fansList = ref([])
const getFans = async () => {
  window.setLoading()
  const res = await get('fans/current')
  if (res.ready) {
    fansList.value = res.data.results
  }
  window.hideLoading()
}
const changeType = (type) => {
  if (type === 'Opus') getWishlists()
  if (type === 'Author') getFans()
  currentType.value = type
}
changeType("Opus")
// 查看作者
const checkAuthor = (userId) => {
  if (userId) {
    router.push({ path: 'authorCenter/' + userId })
  }
}
// 查看图书
const checkBook = (row) => {
  router.push({ path: `/issueInfo/${row.issue.id}/display` })
}
const calcText = (status) => {
  let text = ''
  switch (status) {
    //销售中 在售
    case 'on_sale': text = 'IPO'; break;
    //停止销售 销毁
    case 'off_sale': text = 'Burned'; break;
    //未售出的 流拍
    case 'unsold': text = 'Bought-In'; break;
    //即将发售
    case 'pre_sale': text = 'Comming soon'; break;
  }
  return text
}
</script>
<template>
  <div class="main concern">
    <div class="headerWrap">
      <Header></Header>
    </div>
    <div class="title">Watchlist</div>
    <div class="navigator">
      <span :class="currentType === 'Opus' ? 'actived' : ''" @click="changeType('Opus')">Book</span>
      <span :class="currentType === 'Author' ? 'actived' : ''" @click="changeType('Author')">Author</span>
    </div>
    <div class="content">
      <!-- 收藏图书 -->
      <div v-show="currentType !== 'Author'">
        <BookList v-show="currentType === 'Opus'" :options="{ issueList }"></BookList>
        <NoData v-show="issueList.length === 0"></NoData>
      </div>
      <!-- 关注作者 -->
      <div class="lists" v-show="currentType === 'Author'">
        <div class="item" v-for="item in fansList" :key="item.id" @click="checkAuthor(item.author.id)">
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

  .title {
    font-size: 22px;
    font-family: Alibaba PuHuiTi;
    color: #42392b;
    margin: 40px auto 40px auto;
  }

  .content {
    flex: 1;
    position: relative;

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

        .desContainer {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          padding: 10px 0;
          flex: 1;
        }

        .cCon {
          font-size: 19px;
          color: #000000;
          line-height: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          /* 超出部分省略号 */
          word-break: break-all;
          /* break-all(允许在单词内换行。) */
          display: -webkit-box;
          /* 对象作为伸缩盒子模型显示 */
          -webkit-box-orient: vertical;
          /* 设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-line-clamp: 2;
          /* 显示的行数 */
          max-height: 50px;
          /* 设置最大高度，根据行高，要几行乘以几倍 */
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
            color: #8b5e28;
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