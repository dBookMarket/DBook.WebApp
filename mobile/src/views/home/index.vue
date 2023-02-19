<!-- 首页 -->
<template>
  <div class="home-container">
    <div class="search-wrapper" :class="{active:list.length>0}">
      <van-field
        ref="searchRef"
        class="search-books"
        v-model="formData.search"
        placeholder="Search for author, book title..."
        clearable
        @keyup.enter="handleSearch"
      />
    </div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      v-if="list.length"
    >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="no more"
          :immediate-check="false"
          @load="onLoad"
        >
        <ul class="books-wrapper">
          <li v-for="item  in list" :key="item.id" @click="goAuthorDetail(item)">
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
        </van-list>
    </van-pull-refresh>
    <empty-data v-if="showEmpty && !list.length"></empty-data>
  </div>
</template>

<script>
import {searchBooks} from '@/api/home'
export default {
  name: 'Home',
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      formData:{
        search:''
      },
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page:1,//当前页数
      totalPage:0,//总页数
      showEmpty:false
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {
  },
  destroy() {},
  methods: {
    async handleSearch(){
      const params = {
        ...this.formData,
        page:1,
      }
      const res = await searchBooks(params)
      if(res){
        this.totalPage = res.page_count || 0
        this.list = res.results || []
        res.results&&!res.results.length && (this.showEmpty = true)
        this.$refs.searchRef.blur()
      }
      console.log('res',res)
    },
    async onLoad() {
      //下拉刷新 参数重置
        if (this.refreshing) {
          this.page = 1
          this.list = []
          this.refreshing = false;
        }
        const params = {
          ...this.formData,
          page:this.page
        }
        const res = await searchBooks(params)
        if(res){
          this.page++
          const results = res.results || []
          this.list.push(...results)
        }
        this.loading = false;

        if (this.page >= this.totalPage) {
          this.finished = true;
        }
    },
    onRefresh() {
      // 清空列表数据
      this.page = 1
      this.list = []
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    //跳转到详情页
    goAuthorDetail(item){
      this.$router.push({
        path:'/author-detail',
        query:{
          id:item.book.author.id
        }
      })
    }

  }
};
</script>
<style lang="scss" scoped>
  .home-container{
    min-height: calc(100vh - 566px);
    overflow: hidden;
    .search-wrapper{
      width:673px;
      margin:200px auto;
      &.active{
        margin:59px auto 95px auto;
      }
    }
    .search-books{
      width:673px;
      height:80px;
      padding-left:105px;
      box-sizing: border-box;
      border:1PX solid #000000;
      border-radius: 10px;
      background-image:url('~@/assets/img/search.svg');
      background-size:32px 32px;
      background-repeat: no-repeat;
      background-position: 33px 24px;
    }
    .books-wrapper{
      padding:0 0 0 39px;
      box-sizing: border-box;
      & > li{
        display: flex;
        margin-bottom: 52px;
        img.cover{
          width:140px;
          height:180px;
          object-fit: cover;
          margin-right:23px;
        }
        .book-info{
          height: 180px;
          .avtar{
            display: flex;
            align-items: center;
            margin-bottom: 18px;
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
            width:500px;
            height: 63px;
            font-size: 22px;
            color:#000;
            text-align: left;
            margin-bottom: 22px;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            line-clamp: 2;
            -webkit-line-clamp: 2;
          }
          ol{
            display: flex;
            align-items: center;
            li{
              &:not(:last-child){
                margin-right: 57px;
              }
              text-align: left;
              p.label{
                font-size: 18px;
                color:#999999;
                margin-bottom: 8px;
              }
              p.value{
                font-size: 18px;
                color:#000;
              }
            }
          }
        }
      }
    }
  }
</style>
