<!-- 出版书籍 -->
<template>
  <div class="publish-container">
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
        <ul class="books-wrapper" v-if="list.length">
          <li v-for="item in list" :key="item.id">
            <img :src="item.book.cover_url" alt="" class="cover"/>
            <div class="book-info">
              <div class="avtar">
                <img :src="item.book.author.avatar_url" alt=""/>
                <span>{{item.book.author.name}}</span>
              </div>
              <p class="intro">{{item.book.title}}</p>
              <ol class="price">
                <li>
                  <p class="label">Floor price</p>
                  <p class="value">{{item.price}}USDC</p>
                </li>
                <li>
                  <p class="label">Circulation </p>
                  <p class="value">{{item.quantity}}</p>
                </li>
                <li>
                  <p class="label">Destruction</p>
                  <p class="value">{{item.buy_limit}}</p>
                </li>
              </ol>
            </div>
          </li>
        </ul>
      <empty-data v-if="showEmpty && !list.length" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { queryPublishedBooks } from "@/api/author";
export default {
  name: "PublishBooks",
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
      showEmpty: false,
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
      const res = await queryPublishedBooks(params);
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
.publish-container {
  .books-wrapper {
    padding: 0  0 0 39px;
    box-sizing: border-box;
    & > li {
      display: flex;
      &:not(:last-child) {
        margin-bottom: 52px;
      }
      img.cover {
        width: 140px;
        height: 180px;
        object-fit: cover;
        margin-right: 23px;
      }
      .book-info {
        .avtar {
          display: flex;
          align-items: center;
          margin-bottom: 21px;
          img {
            width: 24px;
            height: 24px;
            object-fit: cover;
            border-radius: 50%;
            margin-right: 15px;
          }
          span {
            font-size: 18px;
            color: #999999;
          }
        }
        p.intro {
          width: 425px;
          font-size: 22px;
          color: #000;
          text-align: left;
          margin-bottom: 42px;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          line-clamp: 2;
          -webkit-line-clamp: 2;
        }
        ol {
          display: flex;
          align-items: center;
          li {
            margin-right: 57px;
            text-align: left;
            p.label {
              font-size: 18px;
              color: #999999;
              margin-bottom: 14px;
            }
            p.value {
              font-size: 18px;
              color: #000;
            }
          }
        }
      }
    }
  }
}
</style>
