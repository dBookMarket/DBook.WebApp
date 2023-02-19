<!-- 书籍出版 -->
<template>
  <div class="container">
    <div class="personal">Listing settings</div>
    <div class="shelf-set">
      <img src="@/icons/banner-tuya.png" alt="" />
      <div class="right">
        <div class="title">
          {{ title }}
        </div>

        <div class="exp">
          {{ content }}
        </div>
      </div>
    </div>
    <div class="form">
      <van-form @submit="createBook">
        <div class="name">Publication settings</div>
        <van-field v-model="formData.quantity" :min="1" type="number" />
        <div class="name">Public chain</div>
        <van-field v-model="formData.token.block_chain" />
        <div class="name">Currency</div>
        <van-field v-model="formData.token.currency" />
        <div class="name">Unit price</div>
        <van-field v-model="formData.price" type="number" />
        <div class="name">Royalties</div>
        <van-field v-model="formData.royalty" type="number" />
        <div class="name">Pre-sale time</div>
        <van-field
          :value="formData.published_at"
          readonly
          clickable
          @click="showCalendar = true"
        />
        <van-popup
          v-model="showCalendar"
          position="bottom"
          :style="{ width: '100%' }"
        >
          <van-datetime-picker
            v-model="formData.published_at"
            type="datetime"
            @confirm="onConfirm"
          />
        </van-popup>
        <div class="name">Supply cycle/minute</div>
        <van-field v-model="formData.duration" type="number" />
        <div class="name">Buy limit</div>
        <van-field v-model="formData.buy_limit" type="number" />
        <div class="explain">
          <div>
            Books not purchased after the end of supply will be sold in full
          </div>
          <div style="margin-top: 14px">
            There is no minting fee for the listing process, which will be
            automatically deducted when the first transaction is completed
          </div>
        </div>

        <div style="margin: 16px">
          <van-button block native-type="submit" class="encry"
            >Data encryption</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import { queryDraftInfo, bookDetailV2, bookPublish } from "@/api/books.js";
import { relistAvalibable } from "@/api/publish.js";
const dayjs = require("dayjs");
import Wallet from "@/utils/wallet";

export default {
  name: "ShelfSet",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      formData: {
        price: "",
        quantity: "",
        royalty: "",
        buy_limit: "",
        published_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        duration: "",
        token: {
          block_chain: "bnb",
          currency: "USDC",
        },
      },
      arr: [],
      title: "",
      content: "",
      coverUrl: "",
      value: "",
      showCalendar: false,
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {},
  async mounted() {
    const res = await bookDetailV2(this.$route.query.id);
    if (res) {
      this.title = res.title || "";
      this.content = res.content || "";
    }
  },
  destroy() {},
  methods: {
    async createBook() {
      let res = {},
        formData = this.formData;
      let bookId = this.$route.query.id;
      const promotedDate = formData.published_at;
      const params = Object.assign({}, formData);
      // Step 1，添加授权操作,调用NFT合约setApprovalForAll()进行授权给platform合约，若成功，转step 2；
      const walletInstance = new Wallet(formData.token.block_chain);
      const provider = await walletInstance.connectWeb3();
      if (provider) {
        const signer = walletInstance.getSigner(provider);
        console.log(formData.token.block_chain);
        // 先查看是否授权过
        const isApprovedForAll = await walletInstance.isApprovedForAll(
          signer,
          formData.token.block_chain
        );
        console.log(isApprovedForAll);
        // 为false，则调用授权
        if (!isApprovedForAll) {
          const transaction = await walletInstance.approveIssue(
            signer,
            formData.token.block_chain
          );
          if (transaction == null || transaction.status != 1) {
            this.$toast("Set approval failed, please try again.");
          }
        }
        console.log("bookId", bookId);

        // Step 2，调用issue接口发布书籍。
        const issue = await walletInstance.issue(
          signer,
          formData.token.block_chain,
          bookId,
          formData.quantity,
          "0x1234",
          formData.price,
          formData.royalty
        );
        params.book = bookId
        let res = bookPublish(params);
        if (res) {
          this.$toast.success("publish success!");
        }
      } else {
        this.$toast("the provider is empty");
      }
    },
    async onSubmit() {
      const params = {
        book: +this.$route.query.id,
        ...this.formData,
      };
      const res = await bookPublish(params);
      if (res) {
        this.$toast.success("publish success!");
      }
    },
    onConfirm(date) {
      this.formData.published_at = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      this.showCalendar = false;
    },
  },
};
</script>
<style lang="scss" scoped>
div {
  text-align: left;
}

.container {
  background: #fff;
  width: 100%;
  min-height: 100%;

  .explain {
    padding: 22px 39px 0px 39px;
    width: 609px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 27px;
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

  .shelf-set {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 38px;

    img {
      width: 141px;
      height: 181px;
      flex-shrink: 0;
    }

    .right {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      margin-left: 26px;

      .title {
        width: 438px;
        height: 43px;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
      }

      .exp {
        width: 473px;
        height: 118px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        white-space: pre-wrap;
        word-break: break-all;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        margin-top: 24px;
      }
    }
  }

  .user-name .van-cell {
    width: 675px;
    height: 46px;
    background: #ffffff;
    border: 1px solid #000000;
  }

  .user-description .van-cell {
    width: 675px;
    height: 118px;
    background: #ffffff;
    border: 1px solid #000000;
  }

  .form {
    width: 100%;
    position: relative;
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
