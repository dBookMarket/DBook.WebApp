<!-- 即将上架 -->
<script setup>
import { ref, watch } from "vue"
import { get, post, del } from "../../service/http"
import NoData from "@/components/NoData.vue"
import message from "../../assets/lib/resetMessage"
import router from "../../router"
// 个人藏品collection
const collectionsList = ref([])
const getCollection = async () => {
    const res = await get("assets/current")
    collectionsList.value = res.data.results
}
// 阅读
const readBook = async (row) => {
    console.log(row)
    // const bookId = row.issue.book.id
    const res = await get(`assets/${row.id}/read`)
}
// 售卖
const currentBook = ref({ issue: { book: {} } })
const tradeForm = ref({ price: 0, quantity: 0, price_range: {} })
const tradeVisible = ref(false)
// 刷新issue
const freshIssues = async () => {
    window.setLoading()
    const res = await get(`issues/${currentBook.value.issue.id}/`)
    window.hideLoading()
    if (res.ready) {
        tradeForm.value.issue = res.data.id
        tradeForm.value.price = 0
        tradeForm.value.quantity = 0 //数量
        tradeForm.value.n_owned = res.data.n_owned //拥有
        tradeForm.value.price_range = res.data.price_range
        tradeVisible.value = true
    }
}
const sellBook = async (row) => {
    currentBook.value = row
    // 获取issue详情页
    freshIssues()
}

// 售卖
const createTrade = async () => {
    if (tradeForm.value.n_owned == 0) {
        message.warning("Purchase quantity must be greater than 1")
        return
    }
    const res = await post('trades', {
        //   user: '',
        issue: tradeForm.value.issue,
        quantity: tradeForm.value.quantity,
        price: tradeForm.value.price,
    })
    console.log(res)
    if (res.ready) {
        message.success(" success !")
        freshIssues()
    }
}
// 查看最低价/最高价交易详情
const checkDetail = () => {

}
const checkBook = (row) => {
    router.push({ path: `/issueInfo/${row.issue.id}/display` })
}
getCollection()
</script>
<template>
    <div class="cardOperaListed">
        <div class="cardOperaItem" v-for="item in collectionsList" :key="item.id">
            <div class="card_left">
                <div class="imgCover" @click="checkBook(item)">
                    <el-image class="postImg" :src="item.issue.book.cover_url" fit="cover"></el-image>
                </div>
                <el-tooltip class="box-item" effect="light" :content="item.issue.book.title" placement="top-start">
                    <div class="bookName">{{ item.issue.book.title }}</div>
                </el-tooltip>
            </div>
            <div class="card_right">
                <div class="opList">
                    <div class="opItem" @click="readBook(item)">
                        <img src="../../assets/img/read.svg" alt="">
                        <span>Read</span>
                    </div>
                    <div class="opItem" @click="sellBook(item)" v-if="item.issue.status !== 'on_sale'">
                        <img src="../../assets/img/sell.svg" alt="">
                        <span>Sell</span>
                    </div>
                    <!-- <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
                :icon="InfoFilled" icon-color="#F00" title="Are you sure to delete this?" @confirm="delBook(item)">
                <template #reference>
                  <div class="opItem delWrap">
                    <img src="../../assets/img/del_red.svg" alt="">
                    <span>删除</span>
                  </div>
                </template>
              </el-popconfirm> -->
                </div>
            </div>
        </div>
        <NoData v-show="collectionsList.length === 0"></NoData>
        <!-- sell售卖交易弹窗 -->
        <div class="sellTips" v-show="tradeVisible">
            <div class="inner">
                <div class="i_title">Sell</div>
                <div class="formWrap">
                    <div class="form_item">
                        <div class="form_label">Book Title</div>
                        <div class="form_value">{{ currentBook.issue.book.title }}
                            <!-- {{ currentBook.token?.currency }} -->
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_label">当前最低价/最高价</div>
                        <div class="form_value">
                            {{ tradeForm.price_range.min_price || 0 }}/{{ tradeForm.price_range.max_price || 0 }}
                            <div class="detail" @click="checkDetail">Detail</div>
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_label"> Selling Price</div>
                        <div class="form_value">
                            <el-input-number size="mini" v-model="tradeForm.price" :min="0"></el-input-number>
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_label">Purchase quantity</div>
                        <div class="form_value">
                            <el-input-number size="mini" v-model="tradeForm.quantity" :min="0"
                                :max="tradeForm.n_owned"></el-input-number>
                            <div class="owerCounts">拥有:{{ tradeForm.n_owned }}</div>
                        </div>
                    </div>
                </div>
                <div class="operaIcon">
                    <span class="cancel" @click="tradeVisible = false">Cancel</span>
                    <span class="continue" @click="createTrade">Sell</span>
                </div>
            </div>
        </div>
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
                cursor: pointer;
            }
        }

        .bookName {
            width: 100%;
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

.sellTips {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);

    .inner {
        width: 447px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 24px 32px 33px 29px;


        .i_title {
            font-size: 18px;
            color: #000000;
            text-align: center;
        }

        .formWrap {
            .form_item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 35px;

                .form_label {
                    width: 250px;
                    font-size: 15px;
                    color: #999999;
                }

                .form_value {
                    font-size: 15px;
                    color: #000000;

                    .detail {
                        width: 31px;
                        font-size: 12px;
                        color: #927252;
                        border-bottom: 1px solid #927252;
                    }

                    .owerCounts {
                        font-size: 12px;
                        color: #000000;
                        text-align: right;
                    }
                }
            }
        }

        .operaIcon {
            display: flex;
            justify-content: space-between;

            span {
                cursor: pointer;
            }

            .cancel {
                width: 150px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #FFF7E9;
                font-size: 15px;
                color: #50483B;
            }

            .continue {
                width: 150px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #50483B;
                font-size: 15px;
                color: #FFE1B4;
            }
        }
    }

}
</style>