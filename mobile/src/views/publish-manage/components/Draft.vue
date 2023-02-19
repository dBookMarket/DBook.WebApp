<!-- 草稿箱 -->
<template>
  <div class="draft-container">
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
        <ul class="draft-items" v-if="list.length">
          <li class="item" v-for="(item,key) in list" :key="item.id">
            <div class="cover">
              <img src="@/assets/img/draft.svg" alt="" />
              <span>Draft{{ key+1 }}</span>
            </div>
            <div class="operate">
              <p class="edit" @click="editDraft(item.id)">Edit</p>
              <p class="publication" @click="handlePub(item)">Publication</p>
              <p class="delete" @click="handleDelete(item)">Delete</p>
            </div>
          </li>
        </ul>
        <empty-data v-if="showEmpty && !list.length" />
      </van-list>
    </van-pull-refresh>
    <div class="write-books" @click="addDraft">Write books</div>
  </div>
</template>

<script>
import { queryDraftList,deleteDraft } from "@/api/publish";
export default {
  name: "Draft",
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
      const res = await queryDraftList(params);
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
    //删除
    async handleDelete(val){
      this.$dialog.confirm({
        message:'delete this draft?',
        confirmButtonText:'confirm',
        cancelButtonText:'cancel'
      }).then(async()=>{
        const {id} = val
        const res = await deleteDraft(id)
        if(res){
          this.$toast.success('delete success!')
          this.onRefresh()
        }
        clear()
      }).catch((err)=>{
        console.log(err)
      })
    },
    //创建草稿
    addDraft(){
      this.$router.push({
        path:'/draftEditor'
      })
    },
    //编辑草稿
    editDraft(id){
      this.$router.push({
        path:'/draftEditor',
        query:{
          id
        }
      })
    },
    //上架
    handlePub(item){
      this.$router.push({
        path:'/editBook',
        query:{
          id:item.id,
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.draft-container {
  .draft-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 40px;
    li {
      display: flex;
      .cover {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 140px;
        height: 180px;
        margin-right: 28px;
        background-color: #f4ce96;
        overflow: hidden;
        img {
          display: block;
          width: 35px;
          height: 35px;
          margin: 87px 0 14px;
        }
        span {
          font-size: 15px;
          color: #ad8141;
        }
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
  }
  .write-books {
    width: 670px;
    line-height: 70px;
    font-size: 22px;
    color: #fff7ec;
    background: #42392b;
    margin-top: 169px;
  }
}
</style>
