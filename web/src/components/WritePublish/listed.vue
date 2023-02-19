<!-- 即将上架 -->
<script setup>
import { ref, watch } from "vue"
import { get, post, del } from "../../service/http"
import NoData from "@/components/NoData.vue"
import message from "../../assets/lib/resetMessage"
import router from "../../router"
import { InfoFilled } from '@element-plus/icons-vue'
// 即将上架to be listed
const listedList = ref([])
// 获取即将上架
const getBooks = async () => {
    const res = await get(`/books`)
    listedList.value = res.data.results
    window.hideLoading()
}
getBooks()
// 编辑
const editBook = async (row) => {
    router.push({ path: `/publishBook/${row.id}/book` })
}
// 上架
const publishNow = async (row) => {
    console.log(row)
    router.push({ path: `/shangjia/-1/${row.id}` })
}
// 删除待上架
const delBook = async (row) => {
    console.log(row)
    const res = await del(`/books/${row.id}`)
    if (res.ready) {
        message.success("message")
        getBooks()
    }
}
</script>
<template>
    <div class="cardOperaListed">
        <div class="cardOperaItem" v-for="item in listedList" :key="item.id">
            <div class="card_left">
                <div class="imgCover">
                    <el-image class="postImg" :src="item.cover_url" fit="cover"></el-image>
                </div>
                <el-tooltip class="box-item" effect="light" :content="item.title" placement="top-start">
                    <div class="bookName">{{ item.title }}</div>
                </el-tooltip>
            </div>
            <div class="card_right">
                <div class="opList">
                    <div class="opItem" @click="editBook(item)">
                        <img src="../../assets/img/edit.svg" alt="">
                        <span>编辑</span>
                    </div>
                    <div class="opItem"  @click="publishNow(item)">
                        <img src="../../assets/img/book_black.svg" alt="">
                        <span>上架</span>
                    </div>
                    <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
                        :icon="InfoFilled" icon-color="#F00" title="Are you sure to delete this?"
                        @confirm="delBook(item)">
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
        <NoData v-show="listedList.length === 0"></NoData>
    </div>
</template>
<style lang="scss">
.cardOperaListed {
    display: flex;
    flex-wrap: wrap;

    .cardOperaItem {
        width: 25%;
        margin-bottom: 20px;
        display: flex;
    }

    .card_left {
        .imgCover {
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