<!-- 我的收藏 -->
<template>
  <div class="collect-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <ul class="collect-items" v-if="list.length">
          <li class="item" v-for="(item,index) in list" :key="index">
            <div class="img-wrapper">
              <img :src="item.issue.book.cover_url" alt="" />
              <p class="name">
                {{item.issue.book.title}}
              </p>
            </div>
            <div class="operate">
              <p class="read" @click=trialReading(item)>Read</p>
              <p class="sell" @click="handleSell">Sell</p>
            </div>
          </li>
        </ul>
        <empty-data v-if="showEmpty && !list.length"></empty-data>
      </van-list>
    </van-pull-refresh>
    <!-- sell dialog -->
    <SellDialog
      :dialogVisible="visible"
      @update:visible="handleClose"
      @update:list="handleUpdate"
    />
  </div>
</template>

<script>
import { queryCollection } from "@/api/collect";
export default {
  name: "Collection",
  mixins: [],
  components: {
    SellDialog: () => import("./SellDialog")
  },
  props: {},
  data() {
    return {
      visible: false,
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
    //update list
    handleUpdate() {},
    //open dialog
    handleSell() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
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
      const res = await queryCollection(params);
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
    },
    trialReading(item){
      // pdf直接打开预览
      if (item.issue.book.preview.file_url) {
        if (item.issue.book.preview.file_url.indexOf('.pdf') > -1) {
          window.open(item.issue.book.preview.file_url)
        }
      } else {
        this.$toast("该图书，暂无试读")
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.collect-container {
  .collect-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 40px;
    li {
      display: flex;
      .img-wrapper {
        img {
          width: 140px;
          height: 180px;
          margin-right: 28px;
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
        p.read {
          padding-left: 22px;
          background-image: url("~@/assets/img/read.svg");
          background-repeat: no-repeat;
          background-size: 18px 16px;
          background-position: 0;
        }
        p.sell {
          padding-left: 22px;
          background-image: url("~@/assets/img/sell.svg");
          background-repeat: no-repeat;
          background-size: 18px 18px;
          background-position: 0;
        }
      }
    }
  }
}
</style>
