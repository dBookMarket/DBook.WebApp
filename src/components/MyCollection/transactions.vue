<!-- 我的收益 -->
<script setup>
import { ref, watch } from "vue"
import { get, post, del } from "../../service/http"
import { Search, InfoFilled, SuccessFilled } from '@element-plus/icons-vue'
import NoData from "@/components/NoData.vue"
import router from "../../router";
// 获取收益交易列表
const list = ref([])
const getTransactions = async () => {
  const res = await get(`/transactions/current`)
  list.value = res.data.results
  window.hideLoading()
}
// 个人总收益
const totals = ref(0)
const getBenefits = async () => {
  const res = await get(`/benefits/total`)
  if (res.ready) {
    res.data.map(el => {
      const { amount, currency } = el
      totals.value += Number(parseFloat(amount).toFixed(2))
    })
  }
}
getBenefits()
getTransactions()
const calcSource = (source) => {
  if (source == 1) return 'issue'
  if (source == 2) return 'trade'
}
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "..." + addr.substr(-4, 4)
  }
}
// 查看作者
const checkAuthor = (id) => {
  router.push({ path: `/authorCenter/${id}` })
}
// 查看书籍
const checkBook = (row) => {
  router.push({ path: `/issueInfo/${row.issue.id}/display` })
}
</script>
<template>
  <div>
    <!-- USDC -->
    <div class="earningTitle">accumulated earnings：
      <span>{{ totals }} USDC</span>
    </div>
    <el-table :data="list" class="dark">
      <el-table-column label="Event" width="90px">
        <template #default="scope">
          <div class="evenetLable">
            <img src="../../assets/img/fabu.svg" v-if="scope.row.source === 1" alt="">
            <img src="../../assets/img/jiaoyi.svg" v-if="scope.row.source === 2" alt="">
            <span>{{ calcSource(scope.row.source) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Book" prop="">
        <template #default="scope">
          <div @click="checkBook(scope.row)"> {{ scope.row.issue.book.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Unit Price" prop="price">
        <template #default="scope">
          <div class="evenetLable">
            <img src="../../assets/img/jinbi.svg" alt="">
            <span>{{ scope.row.price }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Quantity" prop="quantity" width="90px"></el-table-column>
      <el-table-column label="From" prop="" show-overflow-tooltip>
        <template #default="scope">
          <div class="hoverd" @click="checkAuthor(scope.row.buyer.id)">
            {{
                            scope.row.buyer.name ? scope.row.buyer.name + '(' + encate(scope.row.buyer.address) + ')' :
                            encate(scope.row.buyer.address)
                        }}
          </div>

        </template>
      </el-table-column>
      <el-table-column label="To" prop="to" show-overflow-tooltip>
        <template #default="scope">
          <div class="hoverd" @click="checkAuthor(scope.row.seller.id)">
            {{
                            scope.row.seller.name ? scope.row.seller.name + '(' + encate(scope.row.seller.address) + ')' :
                            encate(scope.row.seller.address)
                        }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Status">
        <template #default="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="Date" prop="updated_at" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss">
.earningTitle {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #000000;
  line-height: 26px;
  margin-bottom: 15px;
  padding-left: 10px;

  span {
    margin-right: 20px;
  }
}

.evenetLable {
  display: flex;
  align-items: center;

  img {
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }
}

.hoverd:hover {
  text-decoration: underline;
  color: #7d5321;
}
</style>