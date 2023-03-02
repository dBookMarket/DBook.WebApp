<!-- 即将上架 -->
<script setup>
import { ref, watch } from "vue"
import { get, post, del } from "../../service/http"
import { Search, InfoFilled, SuccessFilled } from '@element-plus/icons-vue'
import router from "../../router"
import NoData from "@/components/NoData.vue"
import message from "../../assets/lib/resetMessage"
// 获取草稿
const draftIndex = ref()
const draftList = ref([])
const getDraft = async () => {
    window.setLoading()
    const res = await get(`/drafts`)
    draftList.value = res.data.results
    window.hideLoading()
}
// 编辑
const draftEdit = (row) => {
    if (row && row.id) {
        router.push({ path: `/draftEdit/${row.id}` })
    } else {
        router.push({ path: `/draftEdit/-1` })
    }
}
// 出版
const publishDraft = (row) => {
    router.push({ path: `/publishBook/${row.id}/draft` })
}
// 删除
const deleteDraft = async (row) => {
    const res = await del(`drafts/${row.id}`)
    if (res.ready) {
        message.success("删除成功");
        getDraft()
    }
}
getDraft()
</script>
<template>
    <div class=" cardOperaList">
        <div class="draftCard cardOperaItem" v-for="item in draftList" :key="item.id"
            :class="{ 'active': draftIndex == item.id ? true : false }">
            <div class="card_left">
                <img src="../../assets/img/draft.svg" alt="">
                <div :title="item.title">{{ item.title }}</div>
            </div>
            <div class="card_right">
                <div class="opList">
                    <div class="opItem" @click.stop="draftEdit(item)">
                        <img src="../../assets/img/edit.svg" alt="">
                        <span>编辑</span>
                    </div>
                    <div class="opItem" @click.stop="publishDraft(item)">
                        <img src="../../assets/img/book_black.svg" alt="">
                        <span>出版</span>
                    </div>
                    <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
                        :icon="InfoFilled" icon-color="#F00" title="Are you sure to delete this?"
                        @confirm="deleteDraft(item)">
                        <template #reference>
                            <div class="opItem delWrap">
                                <img src="../../assets/img/del_red.svg" alt="">
                                <span>删除</span>
                            </div>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </div>
        <NoData v-show="draftList.length === 0"></NoData>
    </div>
</template>
<style lang="scss">
.cardOperaList {
    display: flex;
    flex-wrap: wrap;

    .cardOperaItem {
        display: inline-flex;
        margin-right: 60px;
        margin-bottom: 20px;
    }

    .cardOperaItem.draftCard {
        .card_left {
            width: 138px;
            height: 180px;
            background: #f4ce96;
            border: 1px solid #000000;
            // position: relative;
            // text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 20x;
            margin-right: 24px;
            cursor: pointer;

            img {
                width: 34px;
                height: 35px;
                // margin: 0 auto;
            }

            >div {
                font-size: 15px;
                color: #ad8141;
                text-align: center;
                overflow: hidden;
                margin-top: 20px;
            }
        }
    }

    .card_left {
        .imgCover {
            padding-right: 14px;

            img {
                width: 140px;
                height: 180px;
            }
        }

        .bookName {
            width: 164px;
            font-size: 12px;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .card_right {
        .opList {
            .opItem {
                margin-bottom: 25px;
                cursor: pointer;
                align-items: center;
                display: flex;

                img {
                    width: 12px;
                    height: 14px;
                    margin-right: 9px;
                }

                span {
                    font-size: 15px;
                    color: #000000;
                }
            }

            .opItem.delWrap {
                span {
                    color: red;
                }
            }
        }
    }
}
</style>