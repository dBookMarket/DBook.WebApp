<!-- list -->
<template>
  <div class="list-container">
    <van-pull-refresh
      :finished-text="finishedText"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
    <ul>
      <li v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="item.user.avatar_url" alt=""/>
          <div class="identify">
            <p class="code">{{ encate(item.user.address) }}</p>
            <p class="time">{{ item.updated_at }}</p>
          </div>
        </div>
        <div class="right">
          <p class="price">{{ item.price }}{{ currency }}</p>
          <p class="btn-buy" @click="showBuyTips(2, item)">Buy</p>
        </div>
      </li>
    </ul>
    <empty-data v-if="showEmpty && !list.length" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {bookTrades} from '@/api/books'
export default {
  name: 'List',
  mixins: [],
  components: {},
  props: {
    id:{
      type:[Number,String],
    },
    currency:{
      type:String,
      default:'USDC'
    },
    showBuyTips:{
      type:Function,
    }
  },
  data() {
    return {
      list:  [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1, //当前页数
      totalPage: 0, //总页数
      showEmpty: false
    };
  },
  computed: {
    finishedText() {
      if (this.list.length) {
        return "no more";
      }
      return "";
    }
  },
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {},
  destroy() {},
  methods: {
    async onLoad() {
      try {
        //下拉刷新 参数重置
        if (this.refreshing) {
          this.page = 1;
          this.list = [];
          this.refreshing = false;
        }
        const params = {
          page: this.page,
          issue: this.id
        };
        const res = await bookTrades(params);
        if (res) {
          this.page++;
          const results = res.results || [];
          !results.length && (this.showEmpty = true)
          this.list.push(...results);
        }
        this.loading = false;

        if (this.page >= this.totalPage) {
          this.finished = true;
        }
      } catch (error) {
        this.page = 1;
        this.list = [];
        this.finished = true
        this.showEmpty = true
        console.log(error)
      }
    },
    onRefresh() {
      // 清空列表数据
      this.page = 1;
      this.list = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    encate(addr){
      if (addr) {
        return addr.substr(0, 6) + "****" + addr.substr(-4, 4)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .list-container{
    text-align: center;
    ul{
      li{
        display:flex;
        align-items: center;
        justify-content: space-between;
        padding:22px;
        border-bottom: 1PX solid #F3F3F3;
        .left{
          display: flex;
          align-items: center;
          img{
            width:38px;
            height:38px;
            margin-right:27px;
          }
          .identify{
            font-size: 18px;
            p:first-child{
              color:#000;
              margin-bottom:13px;
            }
            p:last-child{
              color:#999;
            }
          }
        }
        .right{
          p:first-child{
            font-size: 18px;
            color:#42392B;
            margin-bottom: 9px;
          }
          p:last-child{
            width:71px;
            height:26px;
            line-height: 26px;
            text-align: center;
            font-size: 18px;
            color:#fff;
            background-color:#39D172;
          }
        }
      }
    }
  }
</style>
