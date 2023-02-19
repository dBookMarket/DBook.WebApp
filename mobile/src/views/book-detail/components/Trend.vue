<!-- trend -->
<template>
  <div class="trend-container">
    <div id="trend"></div>
    <empty-data v-show="trendList && trendList.dates.length === 0" />
  </div>
</template>

<script>
import { bookTrend } from "@/api/books";
const echarts = require("echarts");
export default {
  name: "Trend",
  mixins: [],
  components: {},
  props: {
    id:{
      type:[String,Number]
    }
  },
  data() {
    return {
      myChart: null,
      trendList:{
        dates:[]
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  mounted() {
    let chartDom = document.getElementById("trend");
    this.myChart = echarts.init(chartDom);
    this.getTrend();
  },
  destroy() {},
  methods: {
    async getTrend() {
      const params = {
        issue:this.id
      }
      const res = await bookTrend(params)
      this.trendList = res;
      await this.$nextTick();
      const option = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: res.dates
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: res.quantities,
            type: "line",
            areaStyle: {}
          }
        ]
      };
      option && this.myChart.setOption(option);
      this.myChart.resize();
    }
  }
};
</script>
<style lang="scss" scoped>
  .trend-container{
    text-align: center;
    #trend{
      height:560px;
    }
  }
</style>
