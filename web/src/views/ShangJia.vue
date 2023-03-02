<script setup>
import { ref, onMounted, inject } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { SuccessFilled } from '@element-plus/icons-vue'
import { get, post, patch } from "../service/http"
import message from "../assets/lib/resetMessage"
import router from "../router"
import Wallet from '../service/wallet'
import common from "../assets/lib/common"
import { number } from "echarts"
const scrollbar = ref(null)
const form = ref({
  book: "",
  price: "", quantity: "", royalty: "", buy_limit: "", published_at: '',
  duration: "",
  token: {
    block_chain: "polygon",
    currency: "USDC"
  }
})
const issueId = router.currentRoute.value.params.issueId
let bookId = router.currentRoute.value.params.bookId
const bookInfo = ref({})
const getBookDetail = async (id) => {
  window.setLoading()
  const res = await get(`books/${id}`)
  form.value.book = id
  bookInfo.value = res.data
  setTimeout(() => {
    window.hideLoading()
  }, 1000)
}
const issueInfo = ref({})
const getIssueDetail = async (id) => {
  window.setLoading()
  const res = await get(`issues/${id}`)
  issueInfo.value = res.data
  form.value.quantity = issueInfo.value.quantity
  form.value.price = issueInfo.value.price
  form.value.royalty = issueInfo.value.royalty
  form.value.buy_limit = issueInfo.value.buy_limit
  form.value.duration = issueInfo.value.duration
  form.value.published_at = issueInfo.value.published_at
  form.value.token = issueInfo.value.token
  setTimeout(() => {
    window.hideLoading()
  }, 1000)
}
if (bookId != -1) {
  form.value.book = Number(bookId)
  getBookDetail(bookId)
}
if (issueId != -1) {
  getIssueDetail(issueId)
}
const disabledDate = (date) => {
  const nowDate = new Date()
  if (date >= nowDate) {
    return false
  } else {
    return true
  }
}
// 上架接口
const createBook = async () => {
  window.setLoading()
  let msg = ''
  const { price, quantity, royalty, buy_limit, duration, published_at } = form.value
  if (!duration || Number(duration) < 0 || (duration+"").indexOf(".") !== -1) {
    msg = 'duration 必须是大于0的整数'
  }
  // 预售时间
  if (!published_at ) {
    msg = '请选择published_at'
  }
  if (!royalty || Number(royalty) < 0 || Number(royalty) > 100) {
    msg = 'royalty 必须是大于0小于100的数字'
  }
  if (!price || Number(price) < 0) {
    msg = 'price 必须大于0'
  } else {
    const endPoint = (price + "").split('.')[1]
    if (endPoint && endPoint.length > 6) {
      msg = 'price 小数点后边最多6位'
    }
  }
  if (!quantity || Number(quantity) < 0 || (quantity+"").indexOf(".") !== -1) {
    console.log(quantity)
    msg = 'quantity 必须是大于0的整数'
  } else {
    if (Number(buy_limit) < 0 || (buy_limit+"").indexOf(".") !== -1 || Number(buy_limit) > Number(quantity)) {
      msg = `buy_limit 必须是大于0 小于${quantity}的整数`
    }
  }
  console.log(msg)
  if (msg) {
    message.warning(msg)
    window.hideLoading()
    return
  }
  let res = {};
  const promotedDate = form.value.published_at
  const params = Object.assign({}, form.value)
  params.royalty =  Number(royalty)
  params.published_at = common.localToUtc(promotedDate)
  // Step 1，添加授权操作,调用NFT合约setApprovalForAll()进行授权给platform合约，若成功，转step 2；
  const walletInstance = new Wallet(form.value.token.block_chain)
  const provider = await walletInstance.connectWeb3()
  if (provider) {
    const signer = walletInstance.getSigner(provider)
    console.log(provider, signer)
    // 先查看是否授权过
    const isApprovedForAll = await walletInstance.isApprovedForAll(signer, form.value.token.block_chain)
    // 为false，则调用授权
    if (!isApprovedForAll) {
      const transaction = await walletInstance.approveIssue(signer, form.value.token.block_chain)
      console.log(transaction)
      if (transaction == null || transaction.status != 1) {
        message.warning("Set approval failed, please try again.")
        window.hideLoading()
        return
      }
    }
    if (issueId == -1) {
      // 新增
      bookId = new Date().getTime()
    }
    // Step 2，调用issue接口发布书籍。
    const issue = await walletInstance.issue(signer, form.value.token.block_chain, bookId, form.value.quantity, "0x1234", form.value.price, form.value.royalty)
  } else {
    message.warning("the provider is empty")
  }
  // 重新上架
  if (issueId != -1) {
    // 编辑
    res = await patch(`/issues/${issueId}/resale`, params)
  } else {
    // 新增
    res = await post("/issues", params)
  }
  window.hideLoading()
  if (res.ready) {
    message.success("上架成功")
    const scrollbarRef_ = inject("scrollbarRef_")
    if (scrollbarRef_) {
      scrollbarRef_.setScrollTop(0)
    }
    router.push({ path: `/issueInfo/${res.data.id}/new` })
  }
}
const props = defineProps(['scrollbarRef'])
</script>
<template>
  <div class="main" id="main">
    <div class="headerWrapImg">
      <Header></Header>
    </div>
    <div class="content">
      <div class="title">上架设置</div>
      <div class="postWrap">
        <el-image :src="bookInfo.cover_url" fit="cover"></el-image>
        <div class="desc">
          <div class="title">{{ bookInfo.title }}</div>
          <div class="desc_text" :title="bookInfo.desc">{{ bookInfo.desc }}</div>
        </div>
      </div>
      <div class="title_">出版数量</div>
      <el-input v-model="form.quantity"></el-input>
      <div class="title_">公链</div>
      <el-select v-model="form.token.block_chain">
        <el-option value="polygon"></el-option>
        <el-option value="bnb"></el-option>
        <!-- <el-option value="mumbai"></el-option> -->
        <!-- <el-option value="bsc testnet"></el-option> -->
      </el-select>
      <div class="title_">货币</div>
      <el-select v-model="form.token.currency">
        <el-option value="USDC"></el-option>
      </el-select>
      <div class="title_">单价</div>
      <el-input v-model="form.price"></el-input>
      <div class="title_">版税(%)</div>
      <el-input v-model="form.royalty" placeholder="1-100"></el-input>
      <div class="title_">预售时间</div>
      <el-date-picker v-model="form.published_at" type="datetime" placeholder="Select date and time"
        value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" style="width:100%" />
      <div class="title_">供应周期/分钟</div>
      <el-input v-model="form.duration"></el-input>
      <div class="title_">购买限制</div>
      <el-input v-model="form.buy_limit"></el-input>
      <div class="tips _1">供应结束后未购买的书将全部销毁</div>
      <div class="tips">上架过程无需支付铸造费，铸造费将在完成第一笔交易时自动扣除</div>
      <div class="operaBtn" @click="createBook">上架</div>
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
  }

  .content {
    width: $contentWidth;
    min-width: $contentMinWidth;
    margin: 0 auto;
    padding: 40px 0;

    .el-select,
    .el-date-picker {
      width: 100% !important;
    }

    .postWrap {
      margin-top: 35px;
      display: flex;

      .el-image {
        width: 141px;
        height: 181px;
      }

      .desc {
        flex: 1;
        margin-left: 27px;

        .title {
          font-size: 22px;
          font-weight: bold;
          color: #000000;
        }

        .desc_text {
          margin-top: 20px;
          font-size: 15px;
          color: #999999;
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
          -webkit-line-clamp: 5;
          /* 显示的行数 */
          max-height: 130px;
          /* 设置最大高度，根据行高，要几行乘以几倍 */
        }
      }
    }

    .title {
      font-size: 22px;
      font-weight: bold;
      color: #000000;
    }

    .title_ {
      font-size: 18px;
      color: #000000;
      margin: 49px 0 25px 0;
    }



    .cusInput {
      width: 100%;
      height: 46px;
      background: #ffffff;
      border: 1px solid #000000;
    }

    .cusArea {
      background: #ffffff;
      border: 1px solid #000000;
    }

    .operaBtn {
      width: 130px;
      font-size: 15px;
      color: #ffe1b4;
      background: #42392b;
      padding: 11px 11px;
      margin-top: 70px;
      text-align: center;
      cursor: pointer;
    }

    .tips {
      font-size: 15px;
      color: #999999;
      line-height: 27px;

      &._1 {
        margin-top: 21px;
      }
    }
  }
}
</style>
<style lang="scss">
.cusInput,
.cusArea {
  width: 99% !important;

  .el-textarea__inner {
    border: none;
  }

  .el-textarea__inner:hover {
    border: none;
  }
}
</style>