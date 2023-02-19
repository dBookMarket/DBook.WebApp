<!-- 空组件 -->
<template>
  <div class="empty-container">
    <img src="@/assets/img/noData.svg" alt=""/>
    <p>No data available</p>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  mixins: [],
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {},
  destroy() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
  .empty-container{
    margin:60px auto;
    img{
      width:70px;
      object-fit: contain;
    }
    p{
      font-size: 18px;
      color:#42392B;
      margin-top:22px;
    }
  }
</style>
