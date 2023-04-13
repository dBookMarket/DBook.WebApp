<!-- 即将上架 -->
<script setup>
import { ref, watch, nextTick } from "vue"
import { get, post, del } from "../../service/http"
import NoData from "@/components/NoData.vue"
import message from "../../assets/lib/resetMessage"
import router from "../../router"
import ePub from "epubjs"
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import Wallet from "../../service/wallet"
import WalletMobile from "../../service/walletMobile"
import { IsPC } from "../../assets/lib/util"
// 个人藏品collection
const collectionsList = ref([])
const getCollection = async () => {
  const res = await get("assets/current")
  collectionsList.value = res.data.results
  window.hideLoading()
}
// 阅读
const areaKey = ref(0)
const pdfUrl = ref('')
const bookReading = ref(false)
const bookTitle = ref('')
const pageNumber = ref(0)
let rendition
const readBook = async (row) => {
  window.setLoading()
  const res = await get(`assets/${row.id}/read`)
  if (res) {
    window.hideLoading()
    bookTitle.value = row.issue.book.title
    const file_url = res.data.file_url
    const suffix = file_url.substring(file_url.lastIndexOf("."));//.txt
    if (suffix === '.epub') {
      pdfUrl.value = ''
      var book = ePub(file_url);
      rendition = book.renderTo("area", {
        width: '100%',   //也可以是'980px'这样的
        height: '100%',
        flow: 'paginated'   //默认是'paginated'，是分页模式,'scrolled-doc'是滚动式
      });
      var displayed = rendition.display();
      pageNumber.value = 1
    } else {
      pdfUrl.value = file_url
    }
    await nextTick()
    bookReading.value = true
    ++areaKey.value;
  }
}

const prevPage = () => {
  rendition.prev()//上一页 
  pageNumber.value--
}
const nextPage = () => {
  rendition.next() //下一页
  pageNumber.value++
}
// 售卖
const currentBook = ref({ issue: { book: {} } })
const tradeForm = ref({ price: 0, quantity: 0, price_range: {} })
const tradeVisible = ref(false)
// 刷新issue
const freshIssues = async (close = true) => {
  window.setLoading()
  const res = await get(`issues/${currentBook.value.issue.id}/`)
  window.hideLoading()
  if (res.ready) {
    console.log(res)
    tradeForm.value.issue = res.data.id
    tradeForm.value.price = 0
    tradeForm.value.quantity = 0 //数量
    tradeForm.value.n_owned = res.data.n_owned //拥有
    tradeForm.value.price_range = res.data.price_range
    tradeForm.value.token = res.data.token
    tradeForm.value.royalty = res.data.royalty
    tradeVisible.value = close
  }
}
const sellBook = async (row) => {
  currentBook.value = row
  // 获取issue详情页
  freshIssues()
}

// 售卖
const createTrade = async () => {
  window.setLoading()
  console.log(tradeForm.value)
  if (tradeForm.value.quantity == 0) {
    message.warning("Purchase quantity must be greater than 1")
    window.hideLoading()
    return
  }
  let provider, walletInstance, isApprovedForAll, transaction = true, issue;
  if (IsPC()) {
    walletInstance = new Wallet(tradeForm.value.token.block_chain)
    provider = await walletInstance.connectWeb3()
    const signer = walletInstance.getSigner(provider)
    isApprovedForAll = await walletInstance.isApprovedForAll(signer, tradeForm.value.token.block_chain)
    if (!isApprovedForAll) {
      transaction = await walletInstance.approveIssue(signer, tradeForm.value.token.block_chain)
    }
  } else {
    walletInstance = new WalletMobile(tradeForm.value.token.block_chain);
    provider = walletInstance.provider
    isApprovedForAll = await walletInstance.isApprovedForAll(tradeForm.value.token.block_chain)
    // 为false，则调用授权
    if (!isApprovedForAll) {
      transaction = await walletInstance.approveIssue(tradeForm.value.token.block_chain)
    }
  }
  if (!transaction) {
    message.warning("Set approval failed, please try again.")
    window.hideLoading()
    return
  }
  if (transaction) {
    const res = await post('trades', {
      //   user: '',
      issue: tradeForm.value.issue,
      quantity: tradeForm.value.quantity,
      price: tradeForm.value.price,
    })
    if (res.ready) {
      message.success(" success !")
      freshIssues(false)
    }
    window.hideLoading()
  }
}
// 查看最低价/最高价交易详情
const checkDetail = () => {
  console.log(tradeForm.value)
  const origin = window.location.origin + "/#"
  const path = `/issueInfo/${tradeForm.value.issue}/display`
  window.open(origin + path)
}
const checkBook = (row) => {
  router.push({ path: `/issueInfo/${row.issue.id}/display` })
}
getCollection()
</script>
<template>
  <div class="cardOperaListed">
    <el-dialog v-model="bookReading" :title="bookTitle" width="99%" top="1vh">
      <el-scrollbar style="height:90vh;">
        <div class="readContainer">
          <iframe :src="pdfUrl" frameborder="0" v-if="pdfUrl"></iframe>
          <div id="area" v-else :key="areaKey">
            <el-icon class="leftIcon" @click="prevPage" v-if="pageNumber > 0">
              <ArrowLeftBold />
            </el-icon>
            <el-icon class="rightIcon" @click="nextPage">
              <ArrowRightBold />
            </el-icon>
            <div class="pageNum" v-if="pageNumber > 1">{{ pageNumber }}</div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
    <div class="cardWrap">
      <div class="cardOperaItem" v-for="item in collectionsList" :key="item.id">
        <div class="card_left">
          <div class="imgCover" @click="checkBook(item)">
            <img :src="item.issue.book.cover_url" />
          </div>
          <el-tooltip class="box-item" effect="light" :content="item.issue.book.title" placement="top-start">
            <div class="bookName">{{ item.issue.book.title }}</div>
          </el-tooltip>
        </div>
        <div class="card_right">
          <div class="opList">
            <div class="opItem" @click="readBook(item)">
              <img src="../../assets/img/read.svg" alt="">
              <span>Read</span>
            </div>
            <div class="opItem" @click="sellBook(item)" v-if="item.issue.status !== 'on_sale'">
              <img src="../../assets/img/sell.svg" alt="">
              <span>Sell</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NoData v-show="collectionsList.length === 0"></NoData>
    <!-- sell售卖交易弹窗 -->
    <div class="sellTips" v-show="tradeVisible">
      <div class="inner">
        <div class="i_title">Sell</div>
        <div class="formWrap">
          <div class="form_item">
            <div class="form_label">Book Title</div>
            <div class="form_value">{{ currentBook.issue.book.title }}
              <!-- {{ currentBook.token?.currency }} -->
            </div>
          </div>
          <div class="form_item">
            <div class="form_label">Current floor price/best price</div>
            <div class="form_value">
              {{ tradeForm.price_range.min_price || 0 }}/{{ tradeForm.price_range.max_price || 0 }}
              <div class="detail" @click="checkDetail">Detail</div>
            </div>
          </div>
          <div class="form_item">
            <div class="form_label"> Selling Price</div>
            <div class="form_value">
              <el-input-number size="mini" v-model="tradeForm.price" :min="0"></el-input-number>
            </div>
          </div>
          <div class="form_item">
            <div class="form_label">Purchase quantity</div>
            <div class="form_value">
              <el-input-number size="mini" v-model="tradeForm.quantity" :min="0"
                :max="tradeForm.n_owned"></el-input-number>
              <div class="owerCounts">You own:{{ tradeForm.n_owned }}</div>
            </div>
          </div>
          <div class="shuiWrap">
            <div class="banshuiWrap">
              <span class="banshui">royalty : </span><span class="shuiValue">{{ tradeForm.royalty }}</span>
            </div>
            <div class="pingtaishuiWrap">
              <span class="pingtaishui">Platform tax : </span><span class="shuiValue">3%</span>
            </div>
          </div>
        </div>
        <div class="operaIcon">
          <span class="cancel" @click="tradeVisible = false">Cancel</span>
          <span class="continue" @click="createTrade">Sell</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.el-dialog {
  margin-bottom: 0;

  .el-dialog__body {
    padding: 10px;
  }

  .el-scrollbar__view {
    width: 100%;
    height: 100%;
  }

  .readContainer {
    width: 100%;
    height: 100%;

    // position: fixed;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // width: 99vw;
    // height: 99vh;
    // background-color: #FFF;
    // z-index: 999;
    iframe {
      width: 100%;
      height: 100%;
    }

    #area {
      width: 100%;
      height: 100%;
      position: relative;

      .el-icon {
        font-size: 30px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        z-index: 999;
      }

      .pageNum {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        cursor: pointer;
        z-index: 999;
        user-select: none;
      }

      .leftIcon {
        left: 0%;
      }

      .rightIcon {
        right: 0%;
      }
    }

    iframe {
      width: 100%;
      height: 99%;
    }
  }
}
</style>
<style lang="scss" scoped>
.cardOperaListed {
  display: flex;
  flex-wrap: wrap;



  .cardWrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .cardOperaItem {
      width: 31%;
      margin-bottom: 20px;
      margin-right: 2%;
      display: flex;
    }
  }



  .card_left {

    // margin-right: 20px;
    .imgCover {
      width: 140px;
      height: 180px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
      }
    }

    .bookName {
      width: 100%;
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

.sellTips {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);

  .inner {
    width: 90%;
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

    .formWrap {
      .form_item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 35px;

        .form_label {
          width: 250px;
          font-size: 15px;
          color: #999999;
        }

        .form_value {
          font-size: 15px;
          color: #000000;

          .detail {
            width: 31px;
            font-size: 12px;
            color: #927252;
            border-bottom: 1px solid #927252;
          }

          .owerCounts {
            font-size: 12px;
            color: #000000;
            text-align: right;
          }
        }
      }

      .shuiWrap {
        display: flex;
        justify-content: flex-end;
        font-size: 15px;
        color: #999999;
        margin-bottom: 35px;

        .banshuiWrap {
          position: relative;
          padding: 0 10px;
          margin-right: 10px;

          .banshui {}

          &::after {
            content: "";
            height: 60%;
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            background-color: gray;
            transform: translateY(-50%);
          }
        }

        .pingtaishuiWrap {
          .pingtaishui {}

        }



        .shuiValue {}
      }
    }

    .operaIcon {
      display: flex;
      justify-content: space-between;

      span {
        cursor: pointer;
        width: 45%;
        max-width: 150px;
      }

      .cancel {
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: #fff7e9;
        font-size: 15px;
        color: #50483b;
      }

      .continue {
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
</style>