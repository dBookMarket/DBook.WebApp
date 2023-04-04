<script setup>
import { ref, nextTick, onMounted } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { Search } from '@element-plus/icons-vue'
import router from "../router/index.js"
import { get } from "../service/http"
import TwitterCom from "../components/TwitterVerify.vue"
import BookListCom from "../components/BookList.vue"
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
const searchKey = ref('')
// 书籍列表
const bookList = ref([])
// 搜索列表
const issues = async () => {
  window.setLoading()
  if (searchKey.value) {
    isAds.value = false
    // if(isRequesting.value) return
    isRequesting.value = true
    const res = await get("issues", { search: searchKey.value })
    if (res && res.data && res.data.results) {
      bookList.value = res.data.results
      isRequesting.value = false
    } else {
      bookList.value = []
    }
    window.hideLoading()
  } else {
    advertisements()
  }
}
// 默认广告列表
const advertisements = async () => {
  isAds.value = true
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
            :prefix-icon="Search" @keydown.enter="issues" />
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
        <BookListCom :options="{ issueList: bookList, gridType: 'grid2' }"></BookListCom>
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
      width: 70%;
      max-width: 447px;
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
        background: #ffffff;
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
          background: #fff7e9;
          font-size: 15px;
          color: #50483b;
        }

        .continue {
          width: 150px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          background: #50483b;
          font-size: 15px;
          color: #ffe1b4;
        }
      }
    }
  }

  .headerWrap {
    background: #ffe1b4;
  }

  .content {
    display: flex;
    align-items: center;

    .searchContain {
      width: 100%;
      text-align: center;

      .logoImg {
        display: inline-block;
        margin: 0 auto 50px auto;
        // width: 350px;
        width: 40%;
        max-width: 400px;
        height: auto;
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
            color: #fff;
          }

          img {
            width: 60px;
            height: auto;
          }
        }
      }
    }
  }
}
</style>