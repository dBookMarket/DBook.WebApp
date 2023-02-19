<!-- sell dialog -->
<template>
  <van-popup v-model="visible" round >
    <div class="sell-container">
      <p class="title">Sell</p>
      <ul>
        <li>
          <p class="label">Book title</p>
          <p class="value">Harry Potter and the Order of the Phoenix Collector's Edition</p>
        </li>
        <li>
          <p class="label">Current minimum/ maximum price</p>
          <p class="value">
            1000USDC/100USDC
            <a>Detail</a>
          </p>
        </li>
        <li>
          <p class="label">Selling Price</p>
          <p class="value">
            <input v-model="formData.price" type="number"/>
          </p>
        </li>
        <li>
          <p class="label">Purchase quantity</p>
          <p class="value no-box">
            <van-stepper v-model="formData.nums" disable-input button-size="18px" />
            <span class="possess">possess：2</span>
          </p>
        </li>
      </ul>
      <div class="tools">
        <p class="item cancel" @click="handleCancel">Cancel</p>
        <p class="item sell" @click="handleSell">Sell</p>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "SellDialog",
  mixins: [],
  components: {},
  props: {
    dialogVisible:{
      type:Boolean,
      default:false
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
    handleSell(){
      this.$emit('update:visible',false)
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
