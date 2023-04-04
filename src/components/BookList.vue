<!-- 已上架 -->
<script setup>
import { ref, watch, onMounted } from "vue"
import { get, post, del } from "../service/http"
import { InfoFilled } from '@element-plus/icons-vue'
import router from "../router";
import message from "../assets/lib/resetMessage"
import cache from "../assets/lib/cache"
const calcText = (status) => {
  let text = ''
  switch (status) {
    //销售中 在售
    case 'on_sale': text = 'IPO'; break;
    //停止销售 销毁
    case 'off_sale': text = 'Burned'; break;
    //未售出的 流拍
    case 'unsold': text = 'Bought-In'; break;
    //即将发售
    case 'pre_sale': text = 'Comming soon'; break;
  }
  return text
}
const props = defineProps({
  options: {
    type: Object,
    required: true,
    default: {}
  }
})
const emits = defineEmits('callback')
const list = ref([])
const operaIconShow = ref(false)
const gridClass = ref('')
const getApi = async () => {
  window.setLoading()
  const res = await get(props.options.api)
  list.value = res.data.results
  window.hideLoading()
}
const checkProps = async () => {
  const { api, issueList, operaIcon = false, gridType = 'grid2' } = props.options
  operaIconShow.value = operaIcon
  gridClass.value = gridType
  if (api) {
    getApi()
  }
  if (issueList) {
    list.value = issueList
  }
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
  const userInfoCache = cache.get('userInfo') || {}
  console.log(row, userInfoCache)
  let path;
  if (row.book.author.id === userInfoCache.id) {
    path = `/issueInfo/${row.id}/my`
  } else {
    path = `/issueInfo/${row.id}/display`
  }
  router.push({ path })
}
</script>
<template>
  <div class="cardList_" :class="[gridClass]">
    <div class="card" v-for="(item, index) in list" :key="index">
      <div class="card_top">
        <div class="leftC">
          <el-image class="postImg" :src="item.book.cover_url" fit="cover" @click="checkIssue(item)"></el-image>
          <div :class="['tip', item.status]" v-if="item.status !== 'off_sale'">
            {{ calcText(item.status) }}
          </div>
        </div>
        <div class="rightC">
          <div class="cTop">
            <el-image class="ava" :src="item.book.author.avatar_url"></el-image>
            <span class="name">{{ item.book.author.name }}</span>
          </div>
          <div class="desContainer">
            <div class="cCon">
              {{ item.book.title }}
            </div>
            <div class="presaleClock" v-if="item.status == 'pre_sale'">
              <img src="../assets/img/clock.svg" alt="">
              <span>{{ item.published_at }}</span>
            </div>
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
      <div class="operaIconList" v-if="operaIconShow">
        <!-- 流拍的有4个按钮 -->
        <!-- <span v-if="['unsold'].includes(item.status)" @click="re_issue(item)">relist</span> -->
        <!-- 即将发售和未售出的可以修改和下架 -->
        <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
          :icon="InfoFilled" icon-color="#F00" title="Are you sure to delisting this?" @confirm="del_issue(item)"
          v-if="['pre_sale', 'unsold'].includes(item.status)">
          <template #reference>
            <span v-if="['pre_sale', 'unsold'].includes(item.status)">delisting</span>
          </template>
        </el-popconfirm>
        <span v-if="['pre_sale', 'unsold'].includes(item.status)" @click="edit_issue(item)">relist</span>
        <el-popconfirm confirm-button-text="OK" confirm-button-type="danger" cancel-button-text="No, Thanks"
          :icon="InfoFilled" icon-color="#F00" title="Are you sure to delete this?" @confirm="del_issue(item)"
          v-if="['unsold'].includes(item.status)">
          <template #reference>
            <span v-if="['unsold'].includes(item.status)">delete</span>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cardList_ {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: left;

  .card {
    margin-bottom: 20px;

    .card_top {
      display: flex;
      justify-content: space-between;

      .leftC {
        position: relative;

        .postImg {
          cursor: pointer;
        }

        .tip {
          width: 99px;
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
          color: #ffffff;

          //销售中 在售
          &.on_sale {
            background-image: url(../assets/img/tag_yellow.svg);
          }

          //停止销售 销毁
          &.off_sale {
            background-image: url(../assets/img/tag_red.svg);
          }

          //未售出的 流拍
          &.unsold {
            background-image: url(../assets/img/tag_red.svg);
          }

          //即将发售
          &.pre_sale {
            background-image: url(../assets/img/tag_red.svg);
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

        .desContainer {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          padding: 10px 0;
          flex: 1;
        }

        .cCon {
          font-size: 19px;
          color: #000000;
          line-height: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          /* 超出部分省略号 */
          word-break: break-all;
          /* break-all(允许在单词内换行。) */
          display: -webkit-box;
          /* 对象作为伸缩盒子模型显示 */
          -webkit-box-orient: vertical;
          /* 设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-line-clamp: 2;
          /* 显示的行数 */
          max-height: 50px;
          /* 设置最大高度，根据行高，要几行乘以几倍 */
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
            color: #8b5e28;
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
            // width: 33%;

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
        border-right: 1px solid #bebebe;
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