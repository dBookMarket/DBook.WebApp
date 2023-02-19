<!--  -->
<template>
  <div class="container">
    <div class="personal">Personal Data</div>
    <div class="avatar">Avatar</div>
    <van-uploader
      :after-read="afterRead"
      :max-size="5242880"
      accept=".jpg,.png"
    >
      <div class="round">
        <img
          src="@/assets/img/personal_setting.svg"
          alt=""
          v-if="!formData.avatar_url"
        />
        <img :src="formData.avatar_url" alt="" v-else />
      </div>
    </van-uploader>
    <div class="form">
      <van-form @submit="onSubmit">
        <div class="name">Banners</div>
        <van-uploader
          :after-read="afterReadBanner"
          :max-size="5242880"
          accept=".jpg,.png"
        >
          <div class="round">
            <img
              src="@/assets/img/personal_setting.svg"
              alt=""
              v-if="!formData.banner_url"
            />
            <img :src="formData.banner_url" alt="" v-else />
          </div>
        </van-uploader>
        <div class="name">User name</div>
        <div class="user-name">
          <van-field v-model="formData.name" maxlength="150" />
        </div>
        <div class="name">Description</div>
        <div class="user-description">
          <van-field
            v-model="formData.desc"
            placeholder="Introduce yourself..."
            rows="2"
            autosize
            type="textarea"
            maxlength="1500"
          />
        </div>
        <div class="twitter">
          <div style="display:flex; ">
            <span>Description</span>
            <img src="@/assets/img/twitter_white.svg" alt="" />
            <span>Twitter</span>
          </div>
          <div class="auth" v-if="!formData.is_verified" @click="goVerify">
            Authentication
          </div>
        </div>
        <div class="name">Site</div>
        <div class="user-name">
          <van-field
            v-model="formData.website_url"
            name="website_url"
            :rules="[{ validator: urlValidator }]"
          />
        </div>
        <div class="name">Discord community</div>
        <div class="user-name">
          <van-field
            v-model="formData.discord_url"
            :rules="[{ validator: urlValidator }]"
          />
        </div>
        <div class="name">Wallet address</div>

        <div class="user-name">
          <div class="address">
            <span>{{ formData.address }}</span>
            <img src="@/assets/img/copy.svg" alt="" @click="copyAddress" />
          </div>
        </div>
        <div style="margin: 16px;">
          <van-button block native-type="submit" class="encry"
            >Data encryption</van-button
          >
        </div>
      </van-form>
    </div>
    <van-popup v-model="show">
      <div class="title">Verify the recommendation</div>
      <div class="content">
        For the first time to publish a book, you need to verify your Twitter
        identity to obtain the qualification for publishing books, and it will
        be bound to your wallet address after successful verification, and you
        can re-verify it in your personal center if you need to modify it later.
      </div>
      <div class="bottom">
        <div class="cancel" @click="show = false">Cancel</div>
        <div class="confirm" @click="goConfirm">Go on</div>
      </div>
    </van-popup>

    <van-popup v-model="sendShow">
      <div class="title">Send a tweet</div>
      <div class="tweet">
        <van-field
          v-model="form.content"
          rows="3"
          autosize
          type="textarea"
          placeholder="Here is a well-written paragraph..."
        />
      </div>
      <div class="bottom">
        <div class="cancel" @click="show = false">Cancel</div>
        <div class="confirm" @click="saveData">Go on</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { userDetail, userUpdate,twitterAuth,twitterShare} from "@/api/users";
export default {
  name: "userSet",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      show: false,
      sendShow:false,
      formData: {
        id: "",
        banner_url: "",
        name: "",
        avatar_url: "",
        desc: "",
        website_url: "https://",
        discord_url: "https://",
        address: "", //钱包地址
        is_verified: ""
      },
      form: {
        oauth_token: "",
        content: "",
        oauth_verifier: ""
      },
      avatarForm: "",
      bannerForm: ""
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {
    this.getUserInfo();
  },
  mounted() {},
  destroy() {},
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
    urlValidator(val) {
      let url = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/[\]@!\$&'\*\+,;=.]+$/;
      if (!url.test(val) || !val) {
        this.$toast("Enter a valid URL");
        return false;
      } else {
        return true;
      }
    },
    getUserInfo() {
      userDetail().then(res => {
        console.log(res);
        this.formData = res;
      });
    },
    afterRead(file) {
      console.log(file);
      this.avatarForm = file.file;
      this.formData.avatar_url = file.content;
    },
    afterReadBanner(file) {
      console.log(file);
      this.bannerForm = file.file;
      this.formData.banner_url = file.content;
    },
    copyAddress() {
      let that = this;
      this.$copyText(this.formData.address).then(
        function(e) {
          console.log("copy arguments e:", e);
          that.$toast("复制成功");
        },
        function(e) {
          console.log("copy arguments e:", e);
          that.$toast("复制失败");
        }
      );
    },
    onSubmit(values) {
      if (values) {
        var { name, desc, website_url, discord_url, id } = this.formData;
        let formData = new FormData();
        if (this.avatarForm) {
          formData.append("avatar", this.avatarForm);
        }
        if (this.bannerForm) {
          formData.append("banner", this.bannerForm);
        }
        formData.append("name", name);
        formData.append("desc", desc);
        formData.append("website_url", website_url);
        formData.append("discord_url", discord_url);
        userUpdate(id, formData)
          .then(res => {
            console.log("res", res);
            if (res) {
              this.$toast("save success");
              this.formData = res;
              this.avatarForm = "";
              this.bannerForm = "";
            }
          })
          .catch(res => {
            console.log("res", res);
          });
      }
    },
    goVerify() {
      this.show = true;
    },
    goConfirm() {
        let formData=new FormData();
        twitterAuth(formData).then((res)=>{
            console.log(res)
            if(res){
                this.sendShow=true;
            }
        })
    },
    saveData(){
        if(!this.form.content){
            this.$toast("please write content")
            return;
        }
        twitterShare().then((res)=>{
             console.log(res)
        })


    }
  }
};
</script>
<style lang="scss" scoped>
div {
  text-align: left;
}

.tweet{
    width:100%;
    display:flex;
    justify-content:center;
}
.tweet .van-cell {
  width: 371px !important;
  height: 179px !important;
  border: 1px solid #a9a9a9 !important;
  margin-left:0 !important;
  display:unset !important;
}

.van-popup {
  padding: 25px 32px 34px 29px;

  width: 468px;
  background: #ffffff;
  border-radius: 10px;
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding: 0 20px;
  }
  .title {
    text-align: center;
    margin-bottom: 38px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 40px;
  }
  .cancel {
    width: 150px;
    height: 50px;
    background: #fff7e9;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #50483b;
    line-height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .confirm {
    width: 150px;
    height: 50px;
    background: #50483b;
    color: #ffe1b4;
    line-height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 27px;
    text-align: center;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
  }
}
.container {
  background: #fff;
  width: 100%;
  min-height: 100%;

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
    width: 675px;
    height: 46px;
    background: #ffffff;
    border: 1px solid #000000;
  }

  .user-name .address {
    width: 675px;
    height: 46px;
    background: #fff7ec;
    border: 1px solid #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px;
    box-sizing: border-box;
    margin-left: 38px;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .banners {
    width: 675px;
    height: 77px;
    border: 1px solid #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px;
    box-sizing: border-box;
    margin-left: 38px;

    span {
      display: inline-block;
      width: 500px;
      overflow: hidden; //超出隐藏
      white-space: nowrap; //不折行
      text-overflow: ellipsis; //溢出显示省略号
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  .user-description .van-cell {
    width: 675px;
    height: 118px;
    background: #ffffff;
    border: 1px solid #000000;
  }

  /deep/ .van-field__control {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #42392b;
    line-height: 27px;
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
    padding-bottom: 29px;
  }

  .round {
    width: 77px;
    height: 77px;
    border: 1px solid #000000;
    border-radius: 100%;
    margin-left: 38px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 40px;
      height: 44px;
    }
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
    img {
      width: 30px;
      height: 30px;
      margin: 0 22px;
    }
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
