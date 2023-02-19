<!-- 出版管理 -->
<template>
  <div class="publish-container">
    <div class="header">
      <div class="user">
        <img :src="detail.avatar_url" alt="" class="avatar"/>
        <div class="info">
          <p>
            <span class="name">{{detail.name}}</span>
            <span class="idenity">0x1456...1234</span>
          </p>
          <p>
            {{detail.desc}}
            <!-- <a class="read-more">read more</a> -->
          </p>
        </div>
      </div>
    </div>
    <div class="operate-wrapper">
      <a :href="detail.website_url" class="site"></a>
      <a :href="detail.discord_url" class="discord"></a>
      <a :href="detail.twitter_url" class="twitter"></a>
      <div class="line"></div>
      <!-- <a href="javascript:;" class="shoucang"></a> -->
      <a href="javascript:;" class="share" @click="handleShare"></a>
    </div>
    <ul class="amount-wrapper">
      <li>
        <p class="nums">{{detail.statistic.total_volume || 0}}</p>
        <p class="desc">Total volume</p>
      </li>
      <li>
        <p class="nums">{{detail.statistic.min_price || 0}}</p>
        <p class="desc">Upset</p>
      </li>
      <li>
        <p class="nums">{{detail.statistic.max_price || 0}}</p>
        <p class="desc">Highest price</p>
      </li>
    </ul>
    <ul class="amount-wrapper">
      <li>
        <p class="nums">{{detail.statistic.total_books || 0}}</p>
        <p class="desc">Total number of books</p>
      </li>
      <li>
        <p class="nums">{{detail.statistic.sales || 0}}</p>
        <p class="desc">Sales</p>
      </li>
      <li>
        <p class="nums">{{detail.statistic.n_owners || 0}}</p>
        <p class="desc">Owner</p>
      </li>
    </ul>
    <div class="tab-wrapper">
      <ul class="item-wrapper">
        <li :class="{'active':cur==='Draft'}" @click="handleTab('Draft')">Draft</li>
        <li :class="{'active':cur==='TobeListed'}" @click="handleTab('TobeListed')">To be listed</li>
        <li :class="{'active':cur==='Available'}" @click="handleTab('Available')">Available</li>
        <li :class="{'active':cur==='Earnings'}" @click="handleTab('Earnings')">Earnings</li>
      </ul>
    </div>
    <div class="content-wrapper">
      <component :is="cur"></component>
    </div>
  </div>
</template>

<script>
import {queryUserInfo} from '@/api/publish'
export default {
  name: 'PublishManage',
  mixins: [],
  components: {
    Draft:()=>import('./components/Draft'),
    TobeListed:()=>import('./components/TobeListed'),
    Available:()=>import('./components/Available'),
    Earnings:()=>import('./components/Earnings'),
  },
  props: {},
  data() {
    return {
      cur:'Draft',
      detail:{
        statistic:{}
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {
    this.getUserInfo()
  },
  destroy() {},
  methods: {
    handleTab(val){
      this.cur = val;
    },
    async getUserInfo(){
      console.log(1111)
      const res = await queryUserInfo()
      if(res){
        this.detail = res
      }
    },
    //分享
    handleShare(){

    },
  }
};
</script>
<style lang="scss" scoped>
  .publish-container{
    .header{
      position: relative;
      z-index: -1;
      height:144px;
      background-color:#FFE1B4;
      background-image:url('~@/assets/img/bg_default.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: -110px 0px;
      .user{
        position: absolute;
        bottom: -60px;
        left:50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        img.avatar{
          width:117px;
          height:117px;
          border-radius: 50%;
          margin-right: 22px;
        }
        .info{
          min-width: 514px;
          text-align: left;
          p:nth-of-type(1){
            display: flex;
            align-items: center;
            margin-bottom: 36px;
            span.name{
              font-size: 22px;
              color:#42392B;
              margin-right: 25px;
            }
            span.idenity{
              display: inline-block;
              text-align: center;
              font-size: 15px;
              color:#FFE1B4;
              background-color:#42392B;
              border-radius: 10px;
              padding:4px 8px;
            }
          }
          p:nth-of-type(2){
            position: relative;
            font-size: 18px;
            color:#999999;
            line-height: 26px;
            text-align: justify;
            a{
              position: absolute;
              bottom:0;
              right:0;
              font-size: 15px;
              color:#7D5321;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .operate-wrapper{
      margin:96px auto 56px 178px;
      display: flex;
      align-items: center;
      .line{
        width:1PX;
        height:40px;
        background:#42392B;
        margin-right:36px;
      }
      a{
        width:40px;
        height:40px;
        margin-right: 36px;
      }
      .site{
        background-image:url('~@/assets/img/site_white.svg');
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .discord{
        background-image:url('~@/assets/img/discord_white.svg');
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .twitter{
        background-image:url('~@/assets/img/twitter_white.svg');
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .shoucang{
        background-image:url('~@/assets/img/shoucang_white.svg');
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .share{
        background-image:url('~@/assets/img/share_white.svg');
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .site{
        background-image:url('~@/assets/img/site.svg');
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
    .amount-wrapper{
      display: flex;
      align-items: center;
      padding:0 40px;
      margin-bottom: 47px;
      li{
        text-align: left;
        p.nums{
          font-size: 30px;
          color:#000;
          margin-bottom: 24px;
        }
        p.desc{
          font-size: 22px;
          color:#999;
        }
      }
      li:nth-of-type(1){
        flex-basis: 229px;
        margin-right: 66px;
      }
      li:nth-of-type(2){
        flex-basis: 244px;
      }
    }
    .tab-wrapper{
      margin: 21px 38px 0 38px;
      line-height: 65px;
      padding:0 25px;
      box-sizing: border-box;
      background:#FFF7EC;
      ul{
        display: flex;
        justify-content: space-between;
        align-items: center;
        li{
          font-size: 22px;
          color:#98866E;
          &.active{
            color:#42392B;
            border-bottom: 1PX solid #42392B;
          }
        }
      }
    }
    .content-wrapper{
      padding:40px 0 28px 39px;
    }
  }
</style>
