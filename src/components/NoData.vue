<script setup>
import { onMounted, ref } from "vue"
</script>
<template>
  <div class="noDataWrap">
    <img src="../assets/img/noData.svg" alt="">
    <div>No data available</div>
  </div>
</template>
<style lang="scss" scoped>
.noDataWrap {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 60px 0;
  img {
    height: 86px;
    margin-bottom: 23px;
  }
  div {
    font-size: 15px;
    color: #999999;
  }
}
</style>