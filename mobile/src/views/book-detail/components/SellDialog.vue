<!-- sell dialog -->
<template>
  <van-popup v-model="visible" round >
    <div class="sell-container">
      <p class="title">Buy</p>
      <ul>
        <li>
          <p class="label">Selling Price</p>
          <p class="value">
            {{ bookInfo.price }}{{ bookInfo.token?bookInfo.token.currency:'' }}
          </p>
        </li>
        <li>
          <p class="label">Purchase quantity</p>
          <p class="value no-box">
            <van-stepper v-model="formData.nums" disable-input button-size="18px" :max="maxQuantity"/>
          </p>
        </li>
      </ul>
      <div class="tools">
        <p class="item cancel" @click="handleCancel">Cancel</p>
        <p class="item sell" @click="handleBuy">Buy</p>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {buyBook} from '@/api/books'
import Wallet from "@/utils/wallet";

export default {
  name: "BuyDialog",
  mixins: [],
  components: {},
  props: {
    dialogVisible:{
      type:Boolean,
      default:false
    },
    bookInfo:{
      type:Object
    },
    currentBuyInfo:{
      type:Object
    },
    level:{
      type:Number,
      default:1,
    },
    maxQuantity:{
      type:Number,
      default:1
    }
  },
  data() {
    return {
      visible: false,
      formData:{
        price:'',
        nums:1
      }
    };
  },
  computed: {},
  watch: {
    'dialogVisible':{
      handler(newVal,oldVal){
        this.visible = newVal
      },
      immediate:true
    }
  },
  filters: {},
  directives: {},
  created() {},
  mounted() {},
  destroy() {},
  methods: {
    handleCancel(){
      this.$emit('update:visible',false)
    },

    async handleBuy(){
      
      const params = {
        trade: this.bookInfo.trade.id,
        quantity: this.formData.nums,
      }
      let walletOk = false
      // 唤起钱包 并 签名
      let bookInfo = this.bookInfo
      let currentBuyInfo = this.currentBuyInfo

      
      const block_chain = bookInfo.token.block_chain
      const currency = bookInfo.token.currency
      const walletInstance = new Wallet(block_chain)
      console.log(walletInstance)
      const provider = await walletInstance.connectWeb3()
      const price = bookInfo.trade.price
      const amount = this.formData.nums

      if (this.level === 1) { 
        if (provider) {
          const signer = walletInstance.getSigner(provider)
          const res = await walletInstance.payFirstTrade(amount, price,signer)
          console.log(res)
          walletOk = true

        } else {
          this.$toast("the provider is empty")
        }
      }
      if (this.level === 2) {
        params.status = ''//一级市场不需要, 二级市场根据链上交易状态定
        params.hash = ''//一级市场不需要, 二级市场根据链上交易状态定
        if (provider) {
          const signer = walletInstance.getSigner(provider)
          console.log("is_approve--currency",currency)
          let free = await walletInstance.getFee(signer, bookInfo.token.block_chain)
          console.log("free",free)
          const is_approve = await walletInstance.allowance(signer, bookInfo.token.block_chain, currency.toLowerCase())
          console.log("is_approve",is_approve == 0)
          console.log("is_approve",is_approve)
          if(is_approve == 0) {
            const transactions = await walletInstance.approve(signer, bookInfo.token.block_chain, currency.toLowerCase())
            console.log(transactions)

          }

          const transaction = await walletInstance.trade(signer, bookInfo.token.block_chain, currentBuyInfo.user.address, currentBuyInfo.issue.book.id, amount, "0x1234", price)
          console.log(transaction)
          params.status = transaction.status
          params.hash = transaction.transactionHash
          walletOk = true
      
        } else {
          this.$toast("the provider is empty")
        }
      }
      const res = await buyBook(params)
      console.log(res)
      if (res) {
        // 购买成功，刷新数据
        this.$emit('update:visible',false)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .sell-container{
    width:680px;
    padding:40px 60px;
    box-sizing: border-box;
    .title{
      color:#000;
      font-size: 28px;
      margin-bottom: 30px;
    }
    ul{
      li{
        display: flex;
        justify-content: space-between;
        font-size: 22px;
        text-align: left;
        margin-bottom: 40px;
        .label{
          color:#999;
          width:200px;
        }
        .value:not(.no-box){
          width:300px;
          text-align: justify;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          line-clamp: 2;
          -webkit-line-clamp: 2;
        }
      }
      li:nth-of-type(2){
        .value{
          text-align: right;
          a{
            display: block;
            color:#927252;
            text-decoration: underline;;
          }
        }
      }
      li:nth-of-type(3){
        align-items: center;
        .value{
          input{
            width:300px;
            height:40px;
            padding:20px 40px;
            border:1px solid #000;
            box-sizing: border-box;
            border-radius: 10px;
          }
        }
      }
      li:nth-of-type(4){
      span{
        width:100%;
        display: inline-block;
        margin-top:20px;
        font-size: 24px;
        text-align: justify;
      }
    }
    }
    .tools{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding:0 30px;
      p{
        width:160px;
        line-height: 50px;
        text-align: center;
      }
      .cancel{
        color:#50483B;
        background:#FFF7E9;
      }
      .sell{
        color:#FFE1B4;
        background:#50483B;

      }
    }
  }
</style>
