<!-- no data components -->
<template>
  <div class="pre-sale">
    <img src="@/assets/img/state_2.svg" alt=""/>
    <p>Opens after the end of the initial supply</p>
  </div>
</template>

<script>
export default {
  name: 'PreSale',
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
  .pre-sale{
    display:flex;
    align-items: center;
    flex-direction: column;
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
