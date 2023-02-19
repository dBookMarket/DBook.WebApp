<!-- 待上架 -->
<template>
  <div class="available-container">
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
    <ul class="books-wrapper" v-if="list.length">
      <li v-for="item in list" :key="item.id" @click="goBookdetail(item)">
        <div class="info-wrapper">
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
        </div>
        <div class="operate">
            <p class="relist" @click="handleRelist(item)">Re-listing</p>
            <p class="take-down" @click="handleDelete(item)">Takedown</p>
            <p class="revise" @click="handleRevise(item)">Revise</p>
            <p class="delete" @click="handleDelete(item)">Delete</p>
          </div>
      </li>
    </ul>
    <empty-data v-if="showEmpty && !list.length" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {queryAvalibableList,DeleteAvalibable,relistAvalibable} from '@/api/publish'
export default {
  name: 'Available',
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
  mounted() {
  },
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
        const res = await queryAvalibableList(params);
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
    //重新上架
    async handleReList(val){
      const {
        price=0,
        quantity=0,
        royalty=0,
        buy_limit=0,
        published_at=0,
        duration=0,
      } = val
      const params = {
        price,
        quantity,
        royalty,
        buy_limit,
        published_at,
        duration,
      }
      const res = await relistAvalibable(params)
      if(res){
        this.$toast.success('list success!')
        this.onRefresh()
      }
    },
    //编辑
    handleRevise(val){

    },
    //删除、下架
    async handleDelete(val){
      this.$dialog.confirm({
        message:'delete this book?',
        confirmButtonText:'confirm',
        cancelButtonText:'cancel'
      }).then(async()=>{
        const {book:{id}} = val
        const res = await DeleteAvalibable(id)
        if(res){
          this.$toast.success('delete success!')
          this.onRefresh()
        }
        clear()
      }).catch((err)=>{
        console.log(err)
      })
    },
    //去书籍详情
    goBookdetail(item){
      this.$router.push({
        path:'/book-detail',
        query:{
          id:item.id
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .available-container{
    .books-wrapper{
      box-sizing: border-box;
      & > li{
        &:not(:last-child){
          margin-bottom: 52px;
        }
        .info-wrapper{
          display: flex;
          img.cover{
          width:140px;
          height:180px;
          object-fit: cover;
          margin-right:23px;
        }
        .book-info{
          .avtar{
            display: flex;
            align-items: center;
            margin-bottom: 21px;
            img{
              width:24px;
              height:24px;
              object-fit: cover;
              border-radius: 50%;
              margin-right: 15px;
            }
            span{
              font-size: 18px;
              color:#999999;
            }
          }
          p.intro{
            width:425px;
            font-size: 22px;
            color:#000;
            text-align: left;
            margin-bottom: 42px;
          }
          ol{
            display: flex;
            align-items: center;
            li{
              margin-right: 57px;
              text-align: left;
              p.label{
                font-size: 18px;
                color:#999999;
                margin-bottom: 14px;
              }
              p.value{
                font-size: 18px;
                color:#000;
              }
            }
          }
          }
        }
        .operate{
            text-align: left;
            display: flex;
            align-items: center;
            margin-top:23px;
            p{
              position:relative;
              font-size: 18px;
              color:#42392B;
              &:not(:first-child){
                padding-left:16px;
              }
              &:not(:last-child){
                padding-right: 17px;
                &::after{
                  content:'';
                  position: absolute;
                  top:50%;
                  transform: translateY(-50%);
                  right:0;
                  width:1PX;
                  height:10px;
                  background:#BEBEBE;
                }
              }
            }
          }
      }
    }
  }
</style>
