<!-- 尾部组件 -->
<template>
  <div class="footer-container">
    <div class="address">
      <a href="https://twitter.com/ddid_io">
        <img src="@/assets/img/twitter.svg" alt="" />
      </a>
      <img src="@/assets/img/discord.svg" alt="" />
      <a href="https://www.youtube.com/watch?v=IL5l2r7GaYk">
        <img src="@/assets/img/youtube.svg" alt="" />
      </a>
      <a href="https://github.com/dBookMarket">
        <img src="@/assets/img/github.svg" alt="" />
      </a>
    </div>
    <p class="download">Download the App</p>
    <a href="" class="email">
      <img src="@/assets/img/email.svg" alt=""/>
    </a>
    <ul>
      <li>Developers：dev@ddid.io</li>
      <li>Author consultation：dev@ddid.io</li>
      <li>Powered by DDID Laboratories Limited</li>
      <li>Copyright DDID LTD.2022 - All Rights Reserved</li>
    </ul>
    <img src="@/assets/img/footer_left.png" class="left" alt=""/>
    <img src="@/assets/img/footer_right.png" class="right" alt=""/>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  mixins: [],
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {},
  destroy() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
  .footer-container{
    position:relative;
    width:100%;
    padding:36px 0 24px 0;
    box-sizing: border-box;
    min-height:468px;
    background:#FFE1B4;
    overflow: hidden;
  }
  .address{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width:372px;
    margin:0 auto;
    img{
      width:52px;
      height: 52px;
    }
    img:nth-of-type(1){
      width:60px;
      height:60px;
    }
    img:nth-of-type(2){
      width:62px;
      height:62px;
    }
  }
  .download{
    width:370px;
    height:64px;
    line-height: 70px;
    text-align: center;
    border-radius: 35px;
    background:#000;
    color:#FFE1B4;
    margin:40px auto 33px auto;
    font-size: 26px;
  }
  a.email{
    margin: 0 auto 18px auto;
    img{
      width:37px;
      height:37px;
    }
  }
  ul{
    margin:0 auto;
    li:nth-of-type(1){
      font-size: 20px;
      color:#000;
      margin-bottom: 18px;
    }
    li:nth-of-type(2){
      font-size: 20px;
      color:#000;
      margin-bottom: 57px;
    }
    li:nth-of-type(3){
      font-size: 15px;
      color:#000;
      margin-bottom: 18px;
    }
    li:nth-of-type(4){
      font-size: 15px;
      color:#000;
    }

  }
  img.left{
    width:180px;
    position:absolute;
    left:20px;
    bottom:-1px;
  }
  img.right{
    width:164px;
    position:absolute;
    right:20px;
    bottom:-1px;
  }
</style>
