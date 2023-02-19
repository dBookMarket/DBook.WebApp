<!--  -->
<template>
  <div class="conatiner">
    <div class="top">
      <van-field
        v-model="title"
        placeholder="please write draft title"
        maxlength="150"
      />
      <van-button type="primary" @click="saveData(0)">save</van-button>
      <van-button type="info" @click="saveData(1)">save and exit</van-button>
    </div>
    <vue-html5-editor
      :content="content"
      :height="400"
      @change="updateData"
    ></vue-html5-editor>
  </div>
</template>
<script>
import { draftAdd,queryDraftInfo,editDraft } from "@/api/books";
export default {
  name: "draft-editor",
  components: {},
  props: {},
  data() {
    return {
      content: "",
      title: ""
    };
  },
  computed: {},
  watch: {
    '$route.query':{
      async handler(newVal,oldVal){
        const {id=0} = newVal
        if(id){
          const res = await queryDraftInfo(id)
          const {title='',content=''} = res
          this.title = title
          this.content = content
        }
      },
      immediate: true,
    }
  },
  filters: {},
  directives: {},
  created() {},
  mounted() {},
  destroy() {},
  methods: {
    updateData(e) {
      console.log(e);
      this.content = e;
    },
    async saveData(status) {
      if (!this.title) {
        this.$toast("please write title");
        return;
      }
      if (!this.content) {
        this.$toast("please write content");
        return;
      }
      const params = {
        title:this.title,
        content:this.content,
        id:this.$route.query.id
      }
      let res
      if(this.$route.query.id){
        res = await editDraft(params)
      }else{
        res = await draftAdd(params)
      }
      if(res){
        this.$toast("save success");
        this.content = "";
        this.title = "";
        status && (this.$router.go(-1))
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 30px 10px;
}
.van-cell {
  width: 320px;
  border: 1px solid #000000;
}
.van-button--primary {
  background-color: #50483b;
  border: 1px solid #50483b;
}
</style>
