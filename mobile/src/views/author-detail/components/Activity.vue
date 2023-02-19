<!-- 活动 -->
<template>
  <div class="activity-container-container">
    <div class="activity-container">
      <ul class="table-header">
        <li class="event">Event</li>
        <li class="book">Book</li>
        <li class="price">Unit Price</li>
        <li class="quantity">Quantity</li>
        <li class="from">From</li>
        <li class="to">To</li>
        <li class="date">Date</li>
      </ul>
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="finishedText"
          @load="onLoad"
        >
          <template v-if="list.length">
            <ul class="rows" v-for="item in list" :key="item.id">
            <li class="col col-event">
              <img :src="item.id % 2 > 0 ? startingPic : tradingPic" alt="" />
              <span>
                {{ item.id % 2 > 0 ? "Starting" : "Second-hand trading" }}
              </span>
            </li>
            <li class="col col-book">
              <img :src="item.issue.book.cover_url" alt="" />
              <span>{{item.issue.book.title}}</span>
            </li>
            <li class="col col-price">
              <img src="@/assets/img/coins.svg" />
              <span>{{item.price}}</span>
            </li>
            <li class="col col-quantity">
              <span>{{item.quantity}}</span>
            </li>
            <li class="col col-from">
              <span>{{item.seller.name}}</span>
            </li>
            <li class="col col-to">
              <span>{{item.buyer.name}}</span>
            </li>
            <li class="col col-date">
              <span>{{item.created_at}}</span>
            </li>
          </ul>
          </template>
          <empty-data v-if="showEmpty && !list.length" />
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { queryActivity } from "@/api/author";
export default {
  name: "Activity",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      startingPic: require("@/assets/img/starting.svg"),
      tradingPic: require("@/assets/img/trading.svg"),
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1, //当前页数
      totalPage: 0, //总页数
      showEmpty: false
    };
  },
  computed: {
    finishedText(){
      if(this.list.length){
        return 'no more'
      }
      return ''
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
      //下拉刷新 参数重置
      if (this.refreshing) {
        this.page = 1;
        this.list = [];
        this.refreshing = false;
      }
      const params = {
        user: this.$route.query.id,
        page: this.page
      };
      const res = await queryActivity(params);
      if (res) {
        this.page++;
        const results = res.results || [];
        res.results&&!res.results.length && (this.showEmpty = true)
        this.list.push(...results);
      }
      this.loading = false;

      if (this.page >= this.totalPage) {
        this.finished = true;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.van-pull-refresh{
  overflow:visible;
}
.activity-container-container {
  padding: 0 39px;
  overflow: hidden;
}
.activity-container {
  position: relative;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .table-header {
    display: flex;
    align-items: center;
    padding: 0 25px 0 20px;
    font-size: 18px;
    color: #999;
    li {
      text-align: left;
      flex-shrink: 0;
    }
    .event {
      width: 200px;
      padding: 0 45px 20px 0;
      border-bottom: 1px solid #f3f3f3;
    }
    .book {
      width: 127px;
      padding: 0 55px 20px 0;
      border-bottom: 1px solid #f3f3f3;
    }
    .price {
      width: 120px;
      padding: 0 60px 20px 0;
      border-bottom: 1px solid #f3f3f3;
    }
    .quantity {
      position: relative;
      width: 70px;
      padding: 0 60px 20px 0;
      border-bottom: 1px solid #f3f3f3;
      &::after {
        position: absolute;
        top:4px;
        right: 10px;
        content: "";
        width: 0px;
        height: 0px;
        border: 9px solid #42392b;
        border-top-color: transparent;
        border-bottom-color: transparent;
        border-left-color: #42392b;
        border-right-color: transparent;
      }
    }
    .from {
      width: 100px;
      padding: 0 60px 20px 0;
      border-bottom: 1px solid #f3f3f3;
    }
    .to {
      width: 100px;
      padding: 0 60px 20px 0;
      border-bottom: 1px solid #f3f3f3;
    }
    .date {
      width: 160px;
      padding: 0 60px 20px 0;
      border-bottom: 1px solid #f3f3f3;
    }
  }
  .rows {
    display: flex;
    align-items: center;
    padding: 0 25px 0 20px;
    li {
      text-align: left;
      flex-shrink: 0;
      height: 24px;
      padding: 22px 0;
      border-bottom: 1px solid #f3f3f3;
      span {
        font-size: 15px;
        color: #000;
      }
    }
    .col-event {
      width: 200px;
      display: flex;
      align-items: center;
      padding-right: 45px;
      font-size: 15px;
      img {
        width: 12px;
        height: 12px;
        margin-right: 10px;
      }
    }
    .col-book {
      width: 127px;
      display: flex;
      align-items: center;
      padding-right: 55px;
      img {
        width: 18px;
        height: 22px;
        margin-right: 14px;
      }
      span {
        display: inline-block;
        width: 95px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .col-price {
      width: 120px;
      display: flex;
      align-items: center;
      padding-right: 60px;
      img {
        width: 11px;
        height: 13px;
        margin-right: 11px;
      }
    }
    .col-quantity {
      width: 70px;
      padding-right: 60px;
    }
    .col-from {
      width: 100px;
      padding-right: 60px;
    }
    .col-to {
      width: 100px;
      padding-right: 60px;
    }
    .col-date {
      width: 160px;
      padding-right: 60px;
      span{
        white-space: nowrap;
      }
    }
  }
}
</style>
