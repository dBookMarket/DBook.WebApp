<!-- 头部组件 -->
<template>
  <div class="header-container">
    <div class="menu"></div>
    <div class="right">
      <p class="title">Publish books</p>
      <p class="wallet" v-if="!isLogin" @click="handleLogin">Link wallet</p>
      <div class="username" v-else>
        <img src="@/assets/img/example.png" class="avatar" alt=""/>
        <span class="name">J.K Rowling</span>
        <span :class="{arrow:true,active:isOpen}" @click="openMenu"></span>
        <ul :class="{'down-menu':true,active:isOpen}">
          <li>
            <a href="/editBook" class="writing">
              <img src="@/assets/img/writing.svg" alt=""/>
              <span>Writing</span>
            </a>
          </li>
          <li>
            <a href="/publish-manage" class="publication_manage">
              <img src="@/assets/img/publication_manage.svg" alt=""/>
              <span>Publication management</span>
            </a>
          </li>
          <li>
            <a href="/collect-manage" class="earnings">
              <img src="@/assets/img/earnings.svg" alt=""/>
              <span>Earnings</span>
            </a>
          </li>
          <li>
            <a href="/collect-manage" class="collection">
              <img src="@/assets/img/collection.svg" alt=""/>
              <span>My collection</span>
            </a>
          </li>
          <li>
            <a href="/concern" class="concern">
              <img src="@/assets/img/concern.svg" alt=""/>
              <span>Concern</span>
            </a>
          </li>
          <li>
            <a href="/userSet" class="personal_setting">
              <img src="@/assets/img/personal_setting.svg" alt=""/>
              <span>Personal settings</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" class="quit" @click="handleLogout">
              <img src="@/assets/img/quit.svg" alt=""/>
              <span>Quit</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import{logout,login}from '@/api/home'
import {get,set,clear} from '@/utils/storage'
export default {
  name: 'Header',
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      isLogin:get('token') || '',
      isOpen:false,
      token:'Bearer 1f918133593af4d014dbbae4c86dff48c0199456',//临时token
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {},
  destroy() {},
  methods: {
    openMenu(){
      this.isOpen = !this.isOpen
    },
    async handleLogin(){
      this.$toast({
        type:'loading',
        message:'logining...',
        duration:0
      })
      const res = await this.loginApi()
      if(res){
        this.$toast.clear()
        const {token} = res
        this.isLogin = true
        set('token',token)
      }
    },
    //TODO:此为登录假接口
    loginApi(){
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          resolve({
            token:this.token
          })
        },3000)
      })
    },
    //退出登录
    handleLogout(){
      this.$dialog.confirm({
        message:'exit account ?',
        confirmButtonText:'confirm',
        cancelButtonText:'cancel'
      }).then(async()=>{
        //const res = await logout()
        clear()
        location.reload()
      }).catch(()=>{

      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .header-container{
    position:fixed;
    z-index: 999;
    top:0;
    left:0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height:98px;
    padding:29px 39px 23px 39px;
    box-sizing: border-box;
    background:#FFE1B4;
    z-index:9999;
    .menu{
      width:45px;
      height:45px;
      border-radius: 50%;
      background:#7D5321;
    }
    .right{
      display: flex;
      align-items: center;
      .title{
        font-size: 26px;
        color:#7D5321;
        margin-right: 46px;
      }
      .wallet{
        width:163px;
        height:46px;
        line-height:46px;
        text-align: center;
        color:#FFE1B4;
        font-size: 26px;
        background:#7D5321;
        border-radius: 23px;
      }
      .username{
        position: relative;
        display: flex;
        align-items: center;
        & > img{
          width:33px;
          height:33px;
          border-radius: 50%;
          margin-right:22px;
        }
        .name{
          font-size: 18px;
          color:#7D5321;
          margin-right: 22px;
        }
        .arrow{
          display: inline-block;
          width: 0px;
          height: 0px;
          border: 8px solid #42392B; //白色
          border-top-color: transparent;
          border-bottom-color: transparent;
          border-left-color:#42392B;
          border-right-color: transparent;
          &.active{
            transform: translateY(5px) rotate(90deg);
          }
        }
        .down-menu{
          min-width:184px;
          position: absolute;
          z-index: 99;
          top:60px;
          right:0;
          background:#fff;
          padding:20px 7px 20px 16px;
          box-sizing: border-box;
          box-shadow: 0px 0px 18px 0px rgba(208,208,208,0.54);
          display: none;
          &.active{
            display: block;
            z-index: 99;
          }
          li{
            &:not(:last-child){
              margin-bottom: 26px;
            }
            a{
              display: flex;
              align-items: center;
              img{
                margin-right: 15px;
              }
              &.writing{
                img{
                  width:10px;
                  height:14px;
                }
              }
              &.publication_manage{
                img{
                  width:11px;
                  height:11px;
                }
              }
              &.earnings{
                img{
                  width:12px;
                  height:10px;
                }
              }
              &.collection{
                img{
                  width:12px;
                  height:12px;
                }
              }
              &.concern{
                img{
                  width:13px;
                  height:11px;
                }
              }
              &.personal_setting{
                img{
                  width:10px;
                  height:13px;
                }
              }
              &.quit{
                img{
                  width:12px;
                  height:10px;
                }
              }
            }
            span{
              font-size: 12px;
              font-weight: 400;
              color:#000000;
              white-space: nowrap;;
            }
          }
        }
      }
    }
  }
</style>
