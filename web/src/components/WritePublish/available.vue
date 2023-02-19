<!-- 已上架 -->
<script setup>
import { ref, watch } from "vue"
import { get, post, del } from "../../service/http"
import { InfoFilled } from '@element-plus/icons-vue'
import NoData from "@/components/NoData.vue"
import router from "../../router";
import message from "../../assets/lib/resetMessage"
const calcText = (status) => {
    let text = ''
    switch (status) {
        //销售中 在售
        case 'on_sale': text = '在售'; break;
        //停止销售 销毁
        case 'off_sale': text = '销毁'; break;
        //未售出的 流拍
        case 'unsold': text = '流拍'; break;
        //即将发售
        case 'pre_sale': text = '即将发售'; break;
    }
    return text
}
// 上架成功的书籍
const list = ref([])
const getList = async () => {
    const res = await get(`issues/current`)
    list.value = res.data.results
    window.hideLoading()
}
getList()
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
        getList()
    }
}
// 下架
const off_issue = async (row) => {
    del_issue(row)
}
const checkIssue = (row) => {
    router.push({ path: `/issueInfo/${row.id}/my` })
}
// const checkBook = (row) => {
//     router.push({ path: `/issueInfo/${row.issue.id}/display` })
// }
</script>
<template>
    <div class="cardList_">
        <div class="card" v-for="(item, index) in list" :key="index">
            <div class="card_top">
                <div class="leftC">
                    <el-image class="postImg" :src="item.book.cover_url" fit="cover"
                        @click="checkIssue(item)"></el-image>
                    <div :class="['tip', item.status]">
                        {{ calcText(item.status) }}
                    </div>
                </div>
                <div class="rightC">
                    <div class="cTop">
                        <el-image class="ava" :src="item.book.author.avatar_url"></el-image>
                        <span class="name">{{ item.book.author.name }}</span>
                    </div>
                    <div class="cCon">
                        {{ item.book.title }}
                    </div>
                    <div class="presaleClock" v-if="item.status == 'pre_sale'">
                        <img src="../../assets/img/clock.svg" alt="">
                        <span>{{ item.published_at }}</span>
                    </div>
                    <div class="cBottom" v-if="item.status == 'pre_sale'">
                        <div class="cBc">
                            <div class="label">listed price</div>
                            <div class="value">{{ item.price }}</div>
                        </div>
                        <div class="cBc">
                            <div class="label">RN</div>
                            <div class="value">{{ item.buy_limit }}</div>
                        </div>
                    </div>
                    <div class="cBottom" v-else>
                        <div class="cBc">
                            <div class="label">Floor price</div>
                            <div class="value">{{ item.price }}</div>
                        </div>
                        <div class="cBc">
                            <div class="label">owners/burn</div>
                            <div class="value">{{ item.n_circulations }}/{{ item.quantity - item.n_circulations }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="operaIconList">
                <!-- 流拍的有4个按钮 -->
                <span v-if="['unsold'].includes(item.status)" @click="re_issue(item)">relist</span>
                <!-- 即将发售和未售出的可以修改和下架 -->
                <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
                    :icon="InfoFilled" icon-color="#F00" title="Are you sure to delisting this?"
                    @confirm="del_issue(item)" v-if="['pre_sale', 'unsold'].includes(item.status)">
                    <template #reference>
                        <span v-if="['pre_sale', 'unsold'].includes(item.status)"
                            @click="off_issue(item)">delisting</span>
                    </template>
                </el-popconfirm>
                <span v-if="['pre_sale', 'unsold'].includes(item.status)" @click="edit_issue(item)">edit</span>
                <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
                    :icon="InfoFilled" icon-color="#F00" title="Are you sure to delete this?" @confirm="del_issue(item)"
                    v-if="['unsold'].includes(item.status)">
                    <template #reference>
                        <span v-if="['unsold'].includes(item.status)">delete</span>
                    </template>
                </el-popconfirm>
            </div>
        </div>
        <NoData v-show="list.length === 0"></NoData>
    </div>
</template>
<style lang="scss">
.cardList_ {
    width: 100%;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;

    .card {
        width: 30%;
        margin-bottom: 50px;

        .card_top {
            display: flex;
            justify-content: space-between;

            .leftC {
                position: relative;

                .postImg {
                    width: 140px;
                    height: 180px;
                    cursor: pointer;
                }

                .tip {
                    width: 90px;
                    height: 40px;
                    line-height: 30px;
                    padding-left: 8px;
                    position: absolute;
                    left: -8px;
                    top: 5px;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    font-size: 10px;
                    font-family: Alibaba PuHuiTi;
                    color: #FFFFFF;

                    //销售中 在售
                    &.on_sale {
                        background-image: url(../../assets/img/tag_yellow.svg);
                    }

                    //停止销售 销毁
                    &.off_sale {
                        background-image: url(../../assets/img/tag_red.svg);
                    }

                    //未售出的 流拍
                    &.unsold {
                        background-image: url(../../assets/img/tag_red.svg);
                    }

                    //即将发售
                    &.pre_sale {
                        background-image: url(../../assets/img/tag_red.svg);
                    }
                }
            }



            .rightC {
                flex: 1;
                margin-left: 22px;
                display: flex;
                justify-content: space-between;
                flex-direction: column;

                .cTop {
                    display: flex;

                    .ava {
                        width: 24px;
                        height: 24px;
                        // background: #4c9b85;
                        border-radius: 50%;
                        margin-right: 15px;
                    }

                    .name {
                        height: 16px;
                        font-size: 15px;
                        font-family: Alibaba PuHuiTi;
                        color: #999999;
                    }
                }

                .cCon {
                    font-size: 18px;
                    font-family: PingFang SC;
                    color: #000000;
                    line-height: 26px;
                }

                .presaleClock {
                    display: flex;
                    align-items: center;

                    img {
                        width: 13px;
                        height: 13px;
                        margin-right: 12px;
                    }

                    span {
                        font-size: 12px;
                        color: #8B5E28;
                    }
                }

                .cBottom {
                    display: flex;
                    height: 50px;
                    justify-content: space-between;

                    .cBc {
                        height: 39px;
                        display: flex;
                        flex-direction: column;
                        width: 33%;

                        .label {
                            color: #999999;
                            line-height: 27px;
                            font-size: 12px;
                        }

                        .value {
                            color: #000000;
                            line-height: 27px;
                            font-size: 15px;
                        }
                    }
                }
            }
        }

        .operaIconList {
            padding-top: 10px;

            span {
                font-size: 12px;
                font-family: PingFang SC;
                color: #000000;
                border-right: 1px solid #BEBEBE;
                padding-right: 14px;
                padding-left: 14px;
                cursor: pointer;

            }

            span:nth-child(1) {
                padding-left: 0;
            }

            span:last-child {
                border-right: none;
            }

        }


    }
}
</style>