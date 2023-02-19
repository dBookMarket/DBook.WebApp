<!-- 待上架 -->
<template>
  <div class="shelf-container">
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
        <ul class="shelf-items" v-if="list.length">
          <li class="item" v-for="item in list" :key="item.id">
            <div class="item-wrapper">
              <img :src="item.cover_url" alt="" />
              <div class="operate">
                <p class="edit" @click="editBook(item)">Edit</p>
                <p class="publication" @click="handlePub(item)">Publication</p>
                <p class="delete" @click="handleDelete(item)">Delete</p>
              </div>
            </div>
            <p class="book-name">
              {{item.title}}
            </p>
          </li>
        </ul>
        <empty-data v-if="showEmpty && !list.length" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { queryTobeList,deleteTobeList } from "@/api/publish";
export default {
  name: "TobeList",
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
      try {
        //下拉刷新 参数重置
        if (this.refreshing) {
          this.page = 1;
          this.list = [];
          this.refreshing = false;
        }
        const params = {
          page: this.page
        };
        const res = await queryTobeList(params);
        if (res) {
          this.page++;
          const results = res.results || [];
          res.results &&
            !res.results.length &&
            (this.showEmpty = true)
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
    //删除
    async handleDelete(val){
      this.$dialog.confirm({
        message:'delete this book?',
        confirmButtonText:'confirm',
        cancelButtonText:'cancel'
      }).then(async()=>{
        const {id} = val
        const res = await deleteTobeList(id)
        if(res){
          this.$toast.success('delete success!')
          this.onRefresh()
        }
        clear()
      }).catch((err)=>{
        console.log(err)
      })
    },
    //编辑书籍
    editBook(val){
      const {id} = val
      this.$router.push({
        path:'/editBook',
        query:{
          id
        }
      })
    },
    //出版
    handlePub(item){
      this.$router.push({
        path:'/shelfSet',
        query:{
          id:item.id,
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.shelf-container {
  .shelf-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 40px;
    li {
      .item-wrapper {
        display: flex;
        img {
          width: 140px;
          height: 180px;
          margin-right: 28px;
        }
        .operate {
          p {
            font-size: 18px;
            color: #000;
            text-align: left;
            margin-bottom: 23px;
          }
          p.edit {
            padding-left: 22px;
            background-image: url("~@/assets/img/edit_file.svg");
            background-repeat: no-repeat;
            background-size: 12px 13px;
            background-position: 0;
          }
          p.publication {
            padding-left: 22px;
            background-image: url("~@/assets/img/publication.svg");
            background-repeat: no-repeat;
            background-size: 10px 12px;
            background-position: 0;
          }
          p.delete {
            padding-left: 22px;
            color: #ff0000;
            background-image: url("~@/assets/img/delete.svg");
            background-repeat: no-repeat;
            background-size: 12px 11px;
            background-position: 0;
          }
        }
      }
      .book-name {
        width: 230px;
        line-height: 20px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        text-align: left;
        font-size: 15px;
        color: #000;
        margin-top: 11px;
      }
    }
  }
  .write-books {
    width: 670px;
    line-height: 70px;
    font-size: 22px;
    color: #fff7ec;
    background: #42392b;
  }
}
</style>
