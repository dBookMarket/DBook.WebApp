<script setup>
import { ref } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { SuccessFilled } from '@element-plus/icons-vue'
import { get, post, put, patch } from "../service/http"
import message from "../assets/lib/resetMessage"
import router from "../router"
const form = ref({})
const currentType = ref(1)
const bookOrDraftId = router.currentRoute.value.params.id
const isDraft = router.currentRoute.value.params.isDraft
const isAdd = ref(false)
const getBookDetail = async (id) => {
  if (id != -1) {
    const res = await get(`books/${id}`)
    if (!res.data.cover_url) isAdd.value = true
    form.value.cover_url = res.data.cover_url
    form.value.title = res.data.title
    form.value.desc = res.data.desc
    form.value.book_name = res.data.title
  }
}
if (isDraft === 'draft') {
  // 草稿
  currentType.value = 2
  if (bookOrDraftId !== -1) {
    // 编辑
    form.value.draft = bookOrDraftId
  }
} else {
  currentType.value = 1
  // 文件
  if (bookOrDraftId !== -1) {
    // book 编辑
    getBookDetail(bookOrDraftId)
  } else {
    // 新增

  }
}
// 个人草稿
const draftList = ref([])
const getDrafts = async () => {
  const res = await get("drafts")
  draftList.value = res.data.results
}
getDrafts()
let formData = new FormData()
const chooseThisDraft = (row) => {
  form.value.draft = row.id
}
// 上传书籍
const changeBookFile = (file) => {
  formData.set('file', file.raw)
  form.value['book_name'] = file.name;
  form.value['book_url'] = URL.createObjectURL(file.raw);
}
// 上传封面
const changeCover = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    message.warning("The file size must be less than 5.0Mb")
    return
  }
  formData.set('cover', file.raw)
  form.value['cover_url'] = URL.createObjectURL(file.raw);
}
const modelTip = ref(false)
const createBook = async () => {
  modelTip.value = true
}
const changeBookType = (type) => {
  currentType.value = type
}
// 书籍上传 当添加一本新书时，不管是pdf或者草稿，都会启动一个task去发起书籍上传动作。如果是草 稿，则需要先对草稿进行处理，然后再加密上传。
const goOn = async () => {
  window.setLoading()
  modelTip.value = false // 隐藏提示框
  if (currentType.value == 1) {
    // 新上传BOOK
    formData.delete('draft');
  }
  if (currentType.value == 2) {
    // 从草稿选择
    formData.delete('file');
    formData.set("draft", form.value.draft) //草稿id
  }
  formData.set("title", form.value.title)
  formData.set("desc", form.value.desc)
  let res;
  if (isAdd) {
    // 新增
    res = await post("books", formData)
  } else {
    // 编辑
    res = await patch(`books/${bookOrDraftId}`, formData)
  }
  console.log(res)
  if (res.ready) {
    message.success("success!")
    form.value = {}
    formData = new FormData()
    router.push({ path: '/writePublishManagement/listed' })
  }
  window.hideLoading()
}
</script>
<template>
  <div class="main">
    <div class="headerWrapImg">
      <Header></Header>
    </div>
    <div class="content">
      <div class="title">Create a book</div>
      <div class="typeWrap">
        <div class="type " :class="{ 'actived': currentType == 1 ? true : false }" @click="changeBookType(1)">Book</div>
        <div class="line"></div>
        <div class="type" :class="{ 'actived': currentType == 2 ? true : false }" @click="changeBookType(2)">Select from
          the draft</div>
      </div>
      <!-- 新上传 -->
      <div class="uploadWrap" v-show="currentType == 1">
        <el-upload action="#" :show-fileList="false" :auto-upload="false" :on-change="changeBookFile"
          accept=".pdf, .epub">
          <div class="bookPost" :class="{ 'hasBook': form.book_name ? true : false }">
            <div>
              <img src="../assets/img/book.svg" alt="" class="coverIcon">
              <div>{{ form.book_name || 'PDF、EPUB' }}</div>
            </div>
          </div>
        </el-upload>
        <div class="tip">
          <div>Supported file formats</div>
          <div>PDF、EPUB，File ＜ 200M</div>
        </div>
      </div>
      <!-- 从草稿中选取 -->
      <el-scrollbar>
        <div class="fradtWrap" v-show="currentType == 2">
          <div class="card" v-for="draft in draftList" :key="draft.id" @click="chooseThisDraft(draft)"
            :class="{ 'active': form.draft == draft.id ? true : false }">
            <el-icon>
              <SuccessFilled />
            </el-icon>
            <img src="../assets/img/draft.svg" alt="">
            <div>{{ draft.title }}</div>
          </div>
        </div>
      </el-scrollbar>
      <div class="title_">Cover</div>
      <div class="uploadWrap">
        <el-upload action="#" :show-fileList="false" :auto-upload="false" :on-change="changeCover" accept=".jpg, .png">
          <div class="bookPost">
            <el-image :src="form.cover_url" alt="" class="coverImg" v-if="form.cover_url" fit="cover"></el-image>
            <div v-else>
              <img src="../assets/img/book.svg" alt="" class="coverIcon">
              <div>JPG、PNG</div>
            </div>
          </div>
        </el-upload>
        <div class="tip">
          <div>Supported file formats</div>
          <div>JPG、PNG</div>
        </div>
      </div>
      <div class="title_">Book title</div>
      <el-input class="cusInput" v-model="form.title"></el-input>
      <div class="title_">Description</div>
      <el-input v-model="form.desc" :rows="5" type="textarea" class="cusArea"
        placeholder="Write a description of your drawing, such as a part, how it dif"></el-input>
      <div class="operaBtn" @click="createBook">Data encryption</div>
    </div>
    <div class="dataEncryption" v-show="modelTip">
      <div class="inner">
        <div class="i_title">Data encryption</div>
        <div class="i_content">
          Data encryption and upload IPFS is expected to
          take a few minutes ~ hours depending on the file size
          and format, and the processing progress can be viewed in
          the publication management, and subsequent publishing
          settings can be made after the processing is completed
        </div>
        <div class="operaIcon">
          <span class="continue" @click="goOn">Go on</span>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .dataEncryption {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);

    .inner {
      width: 510px;
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

      .i_content {
        font-size: 15px;
        color: #999999;
        line-height: 27px;
        margin: 43px 0 37px 0;
        background: #FFFFFF;
        border-radius: 10px;
      }

      &.send {
        .i_content {
          margin: 23px 0 37px 0;
        }
      }

      .operaIcon {
        display: flex;
        justify-content: center;

        span {
          cursor: pointer;
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

  .headerWrapImg {
    background: #ffe1b4;
  }

  .content {
    width: $contentWidth;
    min-width: $contentMinWidth;
    margin: 0 auto;
    padding: 40px 0;

    .title {
      font-size: 22px;
      font-weight: bold;
      color: #000000;
    }

    .title_ {
      font-size: 18px;
      color: #000000;
      margin: 49px 0 25px 0;
    }

    .typeWrap {
      display: flex;
      align-items: center;
      margin: 38px 0 29px 0;

      .type {
        font-size: 18px;
        color: #999999;
        cursor: pointer;

        &.actived {
          font-size: 18px;
          color: #000000;
        }
      }

      .line {
        width: 1px;
        height: 14px;
        background: #c6c6c6;
        margin: 0 33px;
      }
    }

    .uploadWrap {
      display: flex;

      .bookPost {
        width: 140px;
        height: 180px;
        background: #ffffff;
        border: 1px solid #000000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        &.hasBook {
          background: #ffe1b4;
        }

        .coverImg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 138px;
          height: 178px;
          transform: translate(-50%, -50%);
          background: #ffffff;
        }

        >div {
          font-size: 12px;
          color: #999999;

          .coverIcon {
            width: 26px;
            height: 32px;
            margin-bottom: 16px;
          }
        }
      }

      .tip {
        align-self: flex-end;
        margin-left: 23px;

        >div {
          font-size: 12px;
          color: #999999;
          line-height: 27px;
        }
      }
    }

    .fradtWrap {
      display: flex;

      .card {
        width: 140px;
        height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: #f4ce96;
        border: 1px solid #000000;
        margin-right: 54px;
        position: relative;
        cursor: pointer;

        .el-icon {
          position: absolute;
          top: 11px;
          right: 12px;
          color: #fff;
          font-size: 20px;
        }

        img {
          width: 34px;
          height: 35px;
        }

        >div {
          font-size: 15px;
          font-family: Alibaba PuHuiTi;
          color: #ad8141;
          text-align: center;
          margin-top: 20px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; //溢出内容隐藏
          text-overflow: ellipsis; //文本溢出部分用省略号表示
          display: -webkit-box; //特别显示模式
          -webkit-line-clamp: 3; //行数
          line-clamp: 3;
          -webkit-box-orient: vertical; //盒子中内容竖直排列
        }
      }

      .card.active {
        .el-icon {
          color: #000;
        }
      }
    }

    .cusInput {
      width: 100%;
      height: 46px;
      background: #ffffff;
      border: 1px solid #000000;
    }

    .cusArea {
      background: #ffffff;
      border: 1px solid #000000;
    }

    .operaBtn {
      width: 130px;
      font-size: 15px;
      color: #ffe1b4;
      background: #42392b;
      padding: 11px 11px;
      margin-top: 70px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.cusInput,
.cusArea {
  width: 99% !important;

  .el-textarea__inner {
    border: none;
  }

  .el-textarea__inner:hover {
    border: none;
  }
}
</style>