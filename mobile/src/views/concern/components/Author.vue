<!-- 作者 -->
<template>
  <div class="author-container">
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
        <ul class="author-items" v-if="list.length">
          <li class="item" v-for="item in list" :key="item.id">
            <img :src="item.author.avatar_url" alt="" class="avatar" />
            <p class="name">{{ item.name }}</p>
          </li>
        </ul>
        <empty-data v-if="showEmpty && !list.length" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { queryConcernAuthor } from "@/api/concern";
export default {
  name: "Author",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
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
      const res = await queryConcernAuthor(params);
      if (res) {
        this.page++;
        const results = res.results || [];
        res.results &&
          !res.results.length &&
          (this.showEmpty = true) &&
          (this.showList = false);
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
.author-container {
  padding: 0 20px;
  .author-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    align-items: center;
    grid-row-gap: 40px;
    li {
      img {
        width: 117px;
        height: 117px;
        border-radius: 50%;
        margin-bottom: 14px;
      }
      .name {
        font-size: 15px;
        color: #42392b;
      }
    }
  }
}
</style>
