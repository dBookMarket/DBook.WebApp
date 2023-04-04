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
const getBooks = async (showLoading = true) => {
    showLoading && window.setLoading()
    const res = await get(`/books`)
    listedList.value = res.data.results
    const hasPending = listedList.value.some(el => el.status === 'pending')
<<<<<<< HEAD:src/components/WritePublish/listed.vue
    if (hasPending) {
=======
    if(hasPending) {
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
        setTimeout(() => {
            getBooks(false)
        }, 60000)
    }
    showLoading && setTimeout(() => {
        window.hideLoading()
<<<<<<< HEAD:src/components/WritePublish/listed.vue
    }, 1000)
=======
    },1000)
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
}
getBooks()
// 编辑
const editBook = async (row) => {
<<<<<<< HEAD:src/components/WritePublish/listed.vue
    if (row.status !== 'success') return
=======
    if(row.status !== 'success') return
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
    router.push({ path: `/publishBook/${row.id}/book` })
}
// 上架
const publishNow = async (row) => {
<<<<<<< HEAD:src/components/WritePublish/listed.vue
    if (row.status !== 'success') return
=======
    if(row.status !== 'success') return
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
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
    <div class="cardOperaListed listed">
        <div class="cardOperaItem" v-for="item in listedList" :key="item.id">
            <div class="card_left">
<<<<<<< HEAD:src/components/WritePublish/listed.vue
                <div class="imgCover" v-loading="item.status !== 'success'"
                    element-loading-text="During data processing, it is expected to be 2 Minute">
                    <el-image class="postImg" :src="item.cover_url" fit="cover" @click="editBook(item)"></el-image>
=======
                <div class="imgCover"  v-loading="item.status !== 'success'"
                    element-loading-text="During data processing, it is expected to be 2 Minute">
                        <el-image class="postImg" :src="item.cover_url" fit="cover"></el-image>
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
                </div>
                <el-tooltip class="box-item" effect="light" :content="item.title" placement="top-start">
                    <div class="bookName">{{ item.title }}</div>
                </el-tooltip>
            </div>
            <div class="card_right">
                <div class="opList" :class="[item.status]">
<<<<<<< HEAD:src/components/WritePublish/listed.vue
                    <div class="opItem" @click="editBook(item)">
=======
                    <div class="opItem" @click="editBook(item)" >
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
                        <img src="../../assets/img/edit.svg" alt="">
                        <span>edit</span>
                    </div>
                    <div class="opItem" @click="publishNow(item)" v-show="item.status === 'success'">
                        <img src="../../assets/img/book_black.svg" alt="">
                        <span>issue</span>
                    </div>
<<<<<<< HEAD:src/components/WritePublish/listed.vue
                    <el-popconfirm v-if="item.status === 'success'" confirm-button-text="OK" confirm-button-type="danger"
                        cancel-button-text="No, Thanks" :icon="InfoFilled" icon-color="#F00"
                        title="Are you sure to delete this?" @confirm="delBook(item)">
=======
                    <el-popconfirm v-if="item.status === 'success'" confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
                        :icon="InfoFilled" icon-color="#F00" title="Are you sure to delete this?" @confirm="delBook(item)">
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
                        <template #reference>
                            <div class="opItem delWrap" v-if="item.status === 'success'">
                                <img src="../../assets/img/del_red.svg" alt="">
                                <span>delete</span>
                            </div>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </div>
        <NoData v-show="listedList.length === 0"></NoData>
    </div>
</template>
<style>
.el-loading-spinner {
    top: 20%;
    width: 90%;
}
</style>
<style lang="scss" scoped>
.cardOperaListed {
    display: flex;
    flex-wrap: wrap;

    .cardOperaItem {
        width: 31%;
        margin-bottom: 20px;
        margin-right: 2%;
        display: flex;
    }

    .card_left {
        .imgCover {
<<<<<<< HEAD:src/components/WritePublish/listed.vue

            .el-loading-mask,
            .postImg {
                width: 140px;
                height: 180px;
            }


=======
            .el-loading-mask,.postImg {
                width: 140px;
                height: 180px;
            }
            .el-loading-spinner{
                top:20%;
            }
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
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
<<<<<<< HEAD:src/components/WritePublish/listed.vue

        .opList.pending {
            .opItem {
                position: relative;
                cursor: not-allowed;
                user-select: none;

                span {
=======
        .opList.pending {
            .opItem{
                position: relative;
                cursor:not-allowed;
                user-select: none;
                span{
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/components/WritePublish/listed.vue
                    color: #ccc;
                }
            }
        }
    }
}
</style>