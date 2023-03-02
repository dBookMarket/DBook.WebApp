<script setup>
import { ref, nextTick, onMounted } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { Search } from '@element-plus/icons-vue'
import router from "../router/index.js"
import { get } from "../service/http"
import TwitterCom from "../components/TwitterVerify.vue"
const twitterVerifyShow = ref(false)
const routerQuery = router.currentRoute.value.query || {}
const twitterComRef = ref(null)
const isRequesting = ref(true)
const isAds = ref(true)
onMounted(() => {
  if (routerQuery.oauth_verifier) {
    const { oauth_token, oauth_verifier } = routerQuery
    twitterVerifyShow.value = true
    // 发送tweet弹窗
    twitterComRef.value.updateAuth(oauth_token, oauth_verifier)
  }
})
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
const searchKey = ref('')
const viewAuthor = (item) => {
  router.push({ path: `/authorCenter/${item.issue.book.author.id}` })
}
const viewBook = (row) => {
  router.push({ path: `/issueInfo/${row.id}/display` })
}
// 书籍列表
const bookList = ref([])
// 搜索列表
const issues = async () => {
  if (searchKey.value) {
    isAds.value  = false
    // if(isRequesting.value) return
    isRequesting.value = true
    const res = await get("issues", { search: searchKey.value })
    if (res && res.data && res.data.results) {
      bookList.value = res.data.results
      isRequesting.value = false
    } else {
      bookList.value = []
    }
  } else {
    advertisements()
  }
}
// 默认广告列表
const advertisements = async () => {
  isAds.value  = true
  window.setLoading()
  const res = await get("advertisements")
  if (res.data && res.data.results) {
    res.data.results.map(el => {
      const issue = el.issue
      const keys = Object.keys(issue)
      keys.map(key => {
        el[key] = issue[key]
      })
    })
    bookList.value = res.data.results
  } else {
    bookList.value = []
  }
  window.hideLoading()
}
advertisements()
const showVerifyPop = () => {
  twitterVerifyShow.value = true
  twitterComRef.value.show()
}
const checkUser = (row) => {
  router.push({ path: '/authorCenter/' + row.book.author.id })
}
</script>
<template>
  <div class="main">
    <div class="headerWrap">
      <Header @verify="showVerifyPop"></Header>
    </div>
    <div class="content">
      <div class="searchContain" :class="{ 'moreData': bookList.length > 2 ? true : false }">
        <img class="logoImg" src="../assets/img/dbook.svg" alt="" v-show="!searchKey || bookList.length == 0">
        <div class="search">
          <el-input class="noBorder" v-model="searchKey" clearable placeholder="Search for author, book title..."
            :prefix-icon="Search" @change="issues" />
          <div class="tip" v-show="searchKey && bookList.length > 0">The search does not guarantee the authenticity of the
            author's identity,
            please check the author's Twitter identity before purchasing
            the collection</div>
          <div class="tip" v-show="searchKey && bookList.length == 0 && isRequesting === false">未搜索到内容</div>
          <div class="tip ads" v-show="!searchKey && bookList.length && isAds">
            <span>Ads</span>
            <img src="../assets/img/252.svg" alt="">
          </div>
        </div>
        <div class="cardList" v-if="bookList.length">
          <div class="card" v-for="item in bookList" :key="item.id">
            <div class="leftC">
              <el-image class="postImg" :src="item.book.cover_url" @click="viewBook(item)"></el-image>
              <div :class="['tip', item.status]" v-if="item.status !== 'off_sale'">
                {{ calcText(item.status) }}
              </div>
            </div>
            <div class="rightC">
              <div class="cTop">
                <el-image class="ava" :src="item.book.author.avatar_url" @click="checkUser(item)"></el-image>
                <span class="name" @click="checkUser(item)">{{ item.book.author.name }}</span>
              </div>
              <div class="cCon">
                {{ item.book.title }}
              </div>
              <div class="presaleClock" v-if="item.status == 'pre_sale'">
                <img src="../assets/img/clock.svg" alt="">
                <span>{{ item.published_at }}</span>
              </div>
              <div class="cBottom" v-if="item.status == 'pre_sale'">
                <div class="cBc">
                  <div class="label">listed price</div>
                  <div class="value">{{ item.price }}</div>
                </div>
                <div class="cBc">
                  <div class="label">RN</div>
                  <div class="value">{{ item.buy_limit }}</div>
                </div>
              </div>
              <div class="cBottom" v-else>
                <div class="cBc">
                  <div class="label">Floor price</div>
                  <div class="value">{{ item.price }}</div>
                </div>
                <div class="cBc">
                  <div class="label">owners/burn</div>
                  <div class="value">{{ item.n_circulations }}/{{ item.quantity - item.n_circulations }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TwitterCom v-show="twitterVerifyShow" ref="twitterComRef"></TwitterCom>
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .authorVerify {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);

    .inner {
      width: 447px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 24px 32px 33px 29px;


      .i_title {
        font-size: 18px;
        color: #000000;
        text-align: center;
      }

      .i_content {
        font-size: 15px;
        color: #999999;
        line-height: 27px;
        margin: 43px 0 37px 0;
        background: #FFFFFF;
        border-radius: 10px;
      }

      &.send {
        .i_content {
          margin: 23px 0 37px 0;
        }
      }

      .operaIcon {
        display: flex;
        justify-content: space-between;

        span {
          cursor: pointer;
        }

        .cancel {
          width: 150px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          background: #FFF7E9;
          font-size: 15px;
          color: #50483B;
        }


        .continue {
          width: 150px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          background: #50483B;
          font-size: 15px;
          color: #FFE1B4;
        }
      }
    }
  }

  // .content {
  //  
  // }

  .headerWrap {
    background: #ffe1b4;
  }

  .content {
    width: $contentWidth;
    min-width: $contentMinWidth;
    // min-height: calc(100vh - 61px - 260px);
    min-height: 72.5vh;
    // flex: 1;
    margin: 0 auto;
    display: flex;
    align-items: center;


    .searchContain {
      width: 100%;
      text-align: center;
      margin-top: -100px;

      .logoImg {
        display: inline-block;
        margin: 0 auto 50px auto;
        width: 350px;
        height: auto;
      }

      &.moreData {
        margin: 70px 0 0 0;
      }
    }

    .search {
      // margin: 50px 0 0 0;
      width: 100%;
      position: relative;
      text-align: left;

      .el-input {
        width: 100%;
        background: #ffffff;
        border: 1px solid #000000;
        border-radius: 0;
      }

      .tip {
        width: 100%;
        font-size: 15px;
        color: #da4b4b;
        position: relative;
        margin: 22px 0 15px 0;

        &.ads {
          span {
            position: absolute;
            left: 0;
            top: 0;
            line-height: 25px;
            text-align: center;
            width: 40px;
            font-size: 16px;
            color: #FFF;
          }

          img {
            width: 60px;
            height: auto;
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
}</style>