<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from "vue"
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import router from "../router/index"
import { get, post, put } from "../service/http"
import { Editor, Toolbar} from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'
import message from "../assets/lib/resetMessage"
// 切换的时候再次触发
const draftForm = ref({
  id: "",
  title: '',
  content: ''
})
watch(() => router.currentRoute.value.params, async (newValue, oldValue) => {
  draftForm.value.id = newValue.id
  if (newValue.id != -1) {
    const res = await get(`drafts/${newValue.id}`)
    draftForm.value.title = res.data.title
    draftForm.value.content = res.data.content
  } else {
    draftForm.value.title = ''
    draftForm.value.content = ''
  }
}, { immediate: true })
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = ref({
  excludeKeys:  [
    "group-image",
   "group-video"
]
})
const mode = ref("default")
const editorConfig = { placeholder: '请输入内容...' }
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const saveDraft = async () => {
  let res;
  if (draftForm.value.id != -1) {
    // 修改草稿
    res = await put(`drafts/${draftForm.value.id}`, draftForm.value)
  } else {
    // 添加草稿
    res = await post("drafts", draftForm.value)
  }
  // const res = await post("drafts", draftForm.value)
  if (res.ready) {
    message.success("草稿已保存")
    draftForm.value.id = res.data.id
  }
}
// 保存草稿
const save = async () => {
  await saveDraft()
}
// 保存并退出
const saveAndExit = async () => {
  await saveDraft()
  draftForm.value.title = ''
  draftForm.value.content = ''
  router.push({ path: '/writePublishManagement/draft' })
}
</script>
<template>
  <div class="main">
    <div class="headerWrap">
      <Header></Header>
    </div>
    <div class="content">
      <div class="top">
        <el-input class="noBorder" v-model="draftForm.title"></el-input>
        <div class="btn " @click="save">保存草稿</div>
        <div class="btn color" @click="saveAndExit">保存并退出</div>
      </div>
      <div class="bottom">
        <Toolbar  style="border: 1px solid #ccc" :editor="editorRef" :mode="mode" :defaultConfig="toolbarConfig" />
        <Editor style="height: 500px; border: 1px solid #ccc;border-top: none;" v-model="draftForm.content"
          :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
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

  .headerWrap {
    background: #ffe1b4;
  }

  .content {
    width: $contentWidth;
    min-width: $contentMinWidth;
    min-height: calc(100vh - 61px - 170px - 30px - 91px) !important;
    flex: 1;
    margin: 0 auto;
    position: relative;
    padding-top: 91px;
    min-height: 63.5vh;

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 41px;

      .el-input {
        width: 72%;
        border: 1px solid #000000;
      }

      .btn {
        background-color: #FFFFFF;
        border: 1px solid #42392B;
        font-size: 15px;
        font-family: PingFang SC;
        color: #42392B;
        padding: 10px 25px;
        cursor: pointer;
      }

      .btn.color {
        background: #42392B;
        font-size: 15px;
        font-family: PingFang SC;
        color: #FFE1B4;
      }
    }

    .bottom {}
  }
}
</style>