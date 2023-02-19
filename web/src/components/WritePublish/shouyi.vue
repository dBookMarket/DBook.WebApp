<!-- 我的收益 -->
<script setup>
import { ref, watch } from "vue"
import { get, post, del } from "../../service/http"
import { Search, InfoFilled, SuccessFilled } from '@element-plus/icons-vue'
import NoData from "@/components/NoData.vue"
// 获取收益交易列表
const list = ref([])
const getTransactions = async () => {
    const res = await get(`/transactions`)
    list.value = res.data.results
    window.hideLoading()
}
// 个人总收益
const totals = ref([])
const getBenefits = async () => {
    const res = await get(`/benefits/total`)
    if (res.ready) {
        totals.value = res.data.results || []
    }
}
getBenefits()
getTransactions()
const calcSource = (source) => {
    if (source == 1) return '首发'
    if (source == 2) return '二手'
}
const encate = (addr) => {
    if (addr) {
        return addr.substr(0, 6) + "****" + addr.substr(-4, 4)
    }
}
</script>
<template>
    <div>
        <!-- USDC -->
        <div class="earningTitle">累计收益：
            <span v-if="totals.length">
                <span v-for="row in  totals">{{ row.amount }}{{ row.currency }}</span>
            </span>
            <span v-else> - </span>
        </div>
        <el-table :data="list" class="dark">
            <el-table-column label="Event">
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
                    {{ scope.row.issue.book.title }}
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
            <el-table-column label="Quantity" prop="quantity"></el-table-column>
            <el-table-column label="From" prop="" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.buyer.name || encate(scope.row.buyer.address) }}
                </template>
            </el-table-column>
            <el-table-column label="To" prop="to">
                <template #default="scope">
                    {{ scope.row.seller.name || encate(scope.row.seller.address) }}
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
</style>