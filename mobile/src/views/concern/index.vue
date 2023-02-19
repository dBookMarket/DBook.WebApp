<!-- 关注 -->
<template>
  <div class="concern-container">
    <p class="title">Concern</p>
    <div class="tab-wrapper">
      <ul class="item-wrapper">
        <li :class="{'active':cur==='Opus'}" @click="handleTab('Opus')">Opus</li>
        <li :class="{'active':cur==='Author'}" @click="handleTab('Author')">Author</li>
      </ul>
    </div>
    <div class="content-wrapper">
      <component :is="cur"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Concern',
  mixins: [],
  components: {
    Author:()=>import('./components/Author'),
    Opus:()=>import('./components/Opus'),
  },
  props: {},
  data() {
    return {
      cur:'Author'
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
    handleTab(val){
      this.cur = val;
    }
  }
};
</script>
<style lang="scss" scoped>
  .concern-container{
    padding:59px 41px 0px;
    .title{
      font-size: 30px;
      color:#42392B;
      margin-bottom: 34px;
      text-align: left;
    }
    .tab-wrapper{
      line-height: 65px;
      padding:0 25px;
      box-sizing: border-box;
      background:#FFF7EC;
      ul{
        display: flex;
        align-items: center;
        li{
          width:139px;
          font-size: 22px;
          color:#98866E;
          margin-right: 142px;
          &.active{
            color:#42392B;
            border-bottom: 1PX solid #42392B;
          }
        }
      }
    }
    .content-wrapper{
      padding:40px 0 33px 0;
    }
  }
</style>
