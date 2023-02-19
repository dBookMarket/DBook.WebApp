<!-- 挂单 -->
<template>
  <div class="pend-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <ul class="pend-items" v-if="list.length">
          <li class="item" v-for="item in list" :key="item.id">
            <div class="img-container">
              <div class="img-wrap">
                <img src="@/assets/img/example.png" alt="" />
                <!-- <span class="nums">x2</span> -->
              </div>
              <p class="name">
                Harry Potter and the Order of the Phoenix Collector's Editio
              </p>
            </div>
            <div class="operate">
              <p class="price">Modify the price</p>
              <p class="cancel">Cancel an order</p>
            </div>
          </li>
        </ul>
        <empty-data v-if="showEmpty && !list.length"></empty-data>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { queryPendingOrders } from "@/api/collect";
export default {
  name: "Pending",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      list:[],
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
      //下拉刷新 参数重置
      if (this.refreshing) {
        this.page = 1;
        this.list = [];
        this.refreshing = false;
      }
      const params = {
        page: this.page
      };
      const res = await queryPendingOrders(params);
      if (res) {
        this.page++;
        const results = res.results || [];
        res.results && !res.results.length && (this.showEmpty = true);
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
.pend-container {
  .pend-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 40px;
    li {
      display: flex;
      .img-container {
        margin-right: 28px;
        .img-wrap {
          position: relative;
          .nums {
            position: absolute;
            right: -56px;
            bottom: 0;
          }
        }
        img {
          width: 140px;
          height: 180px;
        }
        p.name {
          width: 140px;
          line-height: 20px;
          font-size: 18px;
          color: #000;
          text-align: justify;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          line-clamp: 2;
          -webkit-line-clamp: 2;
        }
      }
      .operate {
        p {
          font-size: 18px;
          color: #000;
          text-align: left;
          margin-bottom: 23px;
        }
        p.price {
          padding-left: 22px;
          background-image: url("~@/assets/img/edit.svg");
          background-repeat: no-repeat;
          background-size: 18px 16px;
          background-position: 0;
        }
        p.cancel {
          padding-left: 22px;
          background-image: url("~@/assets/img/cancel.svg");
          background-repeat: no-repeat;
          background-size: 18px 18px;
          background-position: 0;
        }
      }
    }
  }
}
</style>
