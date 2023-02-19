<!--  -->
<template>
  <div class="container">
    <div class="personal">{{ $route.query.id ? "Edit" : "Add" }} the book</div>
    <div class="tabs">
      <div
        :class="[currentTab == 0 ? 'avatar' : 'unavatar']"
        @click="chooseTab(0)"
      >
        Book
      </div>
      <div class="line"></div>
      <div
        :class="[currentTab == 1 ? 'avatar' : 'unavatar']"
        @click="chooseTab(1)"
      >
        Drafts
      </div>
    </div>

    <div class="upload-file" v-show="currentTab == 0">
      <van-uploader
        v-model="fileList"
        :after-read="afterRead"
        :max-size="209715200"
        accept=".pdf,.txt,.epub"
        :max-count="1"
      >
      </van-uploader>
      <p class="tips">仅支持pdf、epub、txt后缀文件</p>
    </div>
    <div class="book" v-show="currentTab == 1">
      <div class="draft-list">
        <div class="draft" v-for="(item, index) in draftList" :key="index">
          <div class="draft-check">
            <van-checkbox
              v-model="item.checked"
              shape="round"
              icon-size="16px"
              :bind-group="false"
              @click="changeCheckBox($event, index, item.checked)"
            />
          </div>
          <div>{{ item.title }}</div>
        </div>
      </div>
      <div class="no-data" v-if="draftList.length == 0">~no Drafts data</div>
    </div>
    <div class="cover">Cover</div>
    <div class="upload-cover">
      <van-uploader
        v-model="coverList"
        :after-read="afterReaderCover"
        :max-size="5242880"
        :max-count="1"
        accept=".jpg,.png"
      >
      </van-uploader>
      <p class="tips">仅支持jpg、png格式文件</p>
    </div>
    <div class="form">
      <van-form @submit="onSubmit">
        <div class="name">Book title</div>
        <van-field v-model="formData.title" maxlength="150" />
        <div class="name">Description</div>
        <div class="user-description">
          <van-field
            v-model="formData.desc"
            placeholder="Write a description of your drawing, such as a part, how it differs from the standard version, or some signatures worth collecting"
            rows="5"
            autosize
            maxlength="1500"
            type="textarea"
          />
        </div>
        <div style="margin: 16px;">
          <van-button block native-type="submit" class="encry"
            >Data encryption</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import { draftsList, bookAdd, bookInfo,bookUpdate } from "@/api/books";
export default {
  name: "editBook",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      currentTab: 0,
      formData: {
        file: "",
        cover: "",
        title: "",
        desc: "",
        draft: ""
      },
      draftList: [], //草稿list
      bookFile: "",
      coverFile: "",
      fileUrl: "",
      coverUrl: "",
      fileList: [],
      coverList:[]
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {
    this.getBookDetail()
    this.getDraftList()
  },
  mounted() {},
  destroy() {},
  methods: {
    async onSubmit() {
      if (
        this.currentTab == 1 &&
        !this.formData.draft &&
        this.draftList.length
      ) {
        this.$toast("please choose draft");
        return;
      }
      if (!this.formData.cover) {
        this.$toast("please upload cover");
        return;
      }
      if (!this.formData.title) {
        this.$toast("please write title");
        return;
      }
      if (!this.formData.desc) {
        this.$toast("please write desc");
        return;
      }
      const { title, desc, cover, file, draft } = this.formData;
      let formData = new FormData();
      formData.append("cover", cover);
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("file", file);
      if (this.formData.draft) {
        formData.append("draft", draft);
      }
      if(this.$route.query.id){
        //编辑图书
        if(/^http:/.test(file)){
          formData.delete('file')
        }
        if(/^http:/.test(cover)){
          formData.delete('cover')
        }
        const id = this.$route.query.id
        formData.append("id", id);
        const res = await bookUpdate(formData,id)
        if(res){
          this.$toast("edit success");
        }
      }else{
        //新增
        bookAdd(formData)
          .then(res => {
            console.log("res", res);
            if (res) {
              this.$toast("save success");
            }
          })
          .catch(res => {
            console.log("res", res);
          });
      }
    },
    chooseTab(val) {
      this.currentTab = val;
      this.draftList.forEach(item => {
        item.checked = false;
      });
      this.formData.draft = "";
      this.formData.file = "";
      this.fileUrl = {};
      // window.location.href="http://dbookmarket.com:56789/media/previews/03279b646e544893b2ddf36149c319a5.pdf"
    },
    changeCheckBox(e, index, checked) {
      console.log(e, index, checked);
      this.draftList.forEach((item, idx) => {
        if (index == idx && checked) {
          item.checked = true;
          this.formData.draft = item.id;
        } else {
          item.checked = false;
        }
      });
      this.$forceUpdate();
    },
    afterRead(file) {
      console.log(file);
      this.formData.file = file.file;
      this.fileUrl = file.content;
    },
    afterReaderCover(file) {
      console.log(file);
      this.formData.cover = file.file;
      this.coverUrl = file.content;
    },
    //获取书籍详情
    async getBookDetail(){
      const id = this.$route.query.id
      const res = await bookInfo(id)
      if(res){
        this.formData.title = res.title
        this.formData.desc = res.desc
        this.coverList = [{url:res.cover_url}]
        this.fileList = [{url:res.preview.file_url}]
        this.formData.file = res.preview.file_url
        this.formData.cover = res.cover_url
      }
    },
    //获取草稿列表
    async getDraftList(){
      const params = {
        page: 1, pageSize: 99999
      }
      const res = await draftsList(params)
      if(res){
        if (res.results && res.results.length) {
          this.draftList = res.results;
          this.draftList.forEach(item => {
            item.checked = false;
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  text-align: left;
}
.file-banner {
  width: 140px;
  height: 180px;
}

.cover-url {
  width: 100% !important;
  height: 100% !important;
}

.tabs {
  display: flex;
  align-items: center;
  padding-bottom: 29px;

  .line {
    background-color: #000000;
    width: 2px;
    height: 25px;
    margin: 0 0px 0px 30px;
  }
}

.container {
  background: #fff;
  width: 100%;
  min-height: 100%;
  .upload-file,.upload-cover{
    margin: 0 39px 34px 39px;
  }
  .book {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 39px 34px 39px;

    .draft-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding: 10px 30px 10px 10px;
    }
    .draft{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      flex-shrink: 0;
      width: 140px;
      height: 180px;
      background: #ffffff;
      border: 1px solid #000000;
      position: relative;
      &:not(:first-child){
        margin-left: 39px;
      }
    }
    .draft-check {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .no-data {
      margin: 20px 0px 0px 40px;
      color: #9999;
    }

    .upload {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      flex-shrink: 0;
      width: 140px;
      height: 180px;
      background: #ffffff;
      border: 1px solid #000000;
      margin-left: 39px;

      .file-type {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      img {
        width: 26px;
        height: 32px;
      }
    }

    .right {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 180px;
      margin-left: 24px;

      .up {
        width: 221px;
        height: 36px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #e93f3f;
        margin-bottom: 100px;
      }

      .down {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 27px;
      }

      .file-name {
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 27px;
        margin-top: 50px;
      }
      .down-two {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 27px;
        margin-top: 153px;
      }
    }
  }

  .personal {
    padding: 59px 0px 31px 39px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #000000;
    line-height: 26px;
    text-align: left;
  }

  .user-name .van-cell {
    width: 672px;
    height: 46px;
    background: #ffffff;
    border: 1px solid #000000;
  }

  .user-description .van-cell {
    width: 672px;
    height: 154px;
    background: #ffffff;
    border: 1px solid #000000;
    word-break: break-all;
  }

  /deep/ .user-description .van-cell .van-field__control {
    padding: 10px;
    line-height: 26px;
    font-size: 18px;
  }

  .form {
    width: 100%;
    position: relative;
  }

  .avatar {
    padding-left: 39px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 27px;
  }
  .cover {
    padding-left: 39px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 27px;
    margin-bottom: 29px;
  }
  .unavatar {
    padding-left: 39px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 27px;
  }

  .round {
    width: 77px;
    height: 77px;
    border: 1px solid #000000;
    border-radius: 100%;
    margin-left: 38px;
  }

  .name {
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 27px;
    padding: 47px 0px 25px 36px;
  }

  .van-cell {
    width: 673px;
    height: 77px;
    border: 1px solid #000000;
    font-size: 26px;
    margin-left: 37px;
    display: flex;
    align-items: center;
    z-index: 99;
  }

  .van-field__body {
    height: 100%;
  }

  .van-button {
    width: 672px;
    height: 70px;
    background: #42392b;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffe1b4;
    margin: 59px auto;
  }

  .twitter {
    display: flex;
    justify-content: space-between;
    padding: 55px 36px 26px 36px;
    align-items: center;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 27px;

    span {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #42392b;
      line-height: 27px;
    }

    .auth {
      width: 180px;
      height: 50px;
      background: #50483b;
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffe1b4;
      line-height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
