<!-- 已上架 -->
<script setup>
import { ref, watch, onMounted } from "vue"
const props = defineProps({
    options: {
        type: Object,
        required: true,
        default: {}
    }
})
const rows = ref({})
const checkProps = async () => {
    const { statistic } = props.options
    rows.value = statistic
}
watch(() => props.options, (newVal, oldVal) => {
    checkProps()
})
onMounted(async () => {
    checkProps()
})
// getList()
// 重新上架
const re_issue = async (row) => {
    router.push({ path: `/shangjia/${row.id}/${row.book.id}` })
}
// 编辑修改 
const edit_issue = async (row) => {
    router.push({ path: `/shangjia/${row.id}/${row.book.id}` })
}
// 删除
const del_issue = async (row) => {
    const res = await del(`/issues/${row.id}`)
    if (res.ready) {
        message.success("success !")
        if (props.options.api) {
            getApi()
        }
    }
}
const checkIssue = (row) => {
    router.push({ path: `/issueInfo/${row.id}/my` })
}
</script>
<template>
    <div class="numbersList">
        <div class="numberCard">
            <div class="value">{{ rows?.total_volume || 0 }}</div>
            <div class="label">Total volume</div>
        </div>
        <div class="numberCard">
            <div class="value">{{ rows?.min_price || 0 }}</div>
            <div class="label">Floor price</div>
        </div>
        <div class="numberCard">
            <div class="value">{{ rows?.max_price || 0 }}</div>
            <div class="label">Best price</div>
        </div>
        <div class="stepLine"></div>
        <div class="numberCard">
            <div class="value">{{ rows?.total_books || 0 }}</div>
            <div class="label">Total issuance</div>
        </div>
        <div class="numberCard">
            <div class="value">{{ rows?.n_destroyed || 0 }}</div>
            <div class="label">Burn</div>
        </div>
        <div class="numberCard">
            <div class="value">{{ rows?.n_owners || 0 }}</div>
            <div class="label">Owners</div>
        </div>
    </div>
</template>
<style lang="scss">
.numbersList {
    display: flex;
    justify-content: space-between;

    .numberCard {
        line-height: 26px;

        .value {
            font-size: 18px;
            color: #000000;
        }

        .label {
            font-size: 12px;
            color: #999999;
        }
    }

    .stepLine {
        display: inline-block;
        width: 1px;
        height: 48px;
        background: #999999;
    }
}
</style>