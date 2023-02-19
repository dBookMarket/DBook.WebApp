<template>
  <div class="container">
    <img :src="book.cover_url" alt="" class="banner" />
    <div class="title">{{ book.title }}</div>
    <div class="name">
      <span>{{ book.author.name }}</span>
      <div class="num">
        <span>{{ book.author.address }}</span>
      </div>
    </div>
    <div class="artical">
      {{ book.desc }}
    </div>
    <div class="icon">
      <div>
        <img src="@/assets/img/site.svg" alt="" />
        <img src="@/assets/img/twitter_white.svg" alt="" class="mar" />
        <img src="@/assets/img/twitter_white.svg" alt="" class="mar" />
      </div>

      <div>
        <img
          src="@/assets/img/shoucang_.svg"
          alt=""
          v-if="bookInfo.is_wished"
          @click="removeWished()"
        />
        <img
          src="@/assets/img/shoucang_white.svg"
          alt=""
          v-if="!bookInfo.is_wished"
          @click="goWished()"
        />
        <img src="@/assets/img/share_white.svg" alt="" class="mar" />
      </div>
    </div>
    <div class="reading" @click="trialReading">Trial reading</div>
    <div class="public-one">
      <div class="top">
        <div class="left">
          <div class="left-top">
            <div class="dots"></div>
            <div style="margin-left:20px">Publication</div>
          </div>
          <div class="left-bottom">
            <img src="@/assets/img/clock.svg" alt="" />
            <div class="published">{{bookInfo.published_at}}</div>
          </div>
        </div>
        <div class="time" v-show="['pre_sale', 'on_sale'].includes(bookInfo.status)">
          <div class="time-item">
            <div class="date">{{countTime.days}}</div>
            <div class="time-name">Days</div>
          </div>
          <div class="dot">:</div>

          <div class="time-item">
            <div class="date">{{ countTime.hours }}</div>
            <div class="time-name">Hours</div>
          </div>
          <div class="dot">:</div>
          <div class="time-item">
            <div class="date">{{ countTime.minutes }}</div>
            <div class="time-name">Minutes</div>
          </div>
          <div class="dot">:</div>
          <div class="time-item">
            <div class="date">{{ countTime.seconds }}</div>
            <div class="time-name">Seconds</div>
          </div>
        </div>
      </div>
      <div class="center">
        <span>Public chain</span>
        <span style="color:#010101">Polygon</span>
      </div>
      <div class="content">
        <div class="supply">
          <div class="one">Supply</div>
          <div class="second">{{bookInfo.quantity}}</div>
          <div class="third">Available {{bookInfo.royalty}}</div>
        </div>
        <div class="number">
          <div class="one">Selling Price</div>
          <div class="second">{{bookInfo.price}}</div>
          <div class="third">Limited per person {{bookInfo.buy_limit}}</div>
        </div>
        <div class="ava">
          <div class="one">Supply cycle</div>
          <div class="second">{{bookInfo.duration}}</div>
          <div class="third">You have {{bookInfo.n_owners}}</div>
        </div>
      </div>
      <div class="add-cale" v-if="bookInfo.status === 'pre_sale'">Add a calendar</div>
      <div class="add-cale" v-if="bookInfo.status === 'on_sale'" @click="showBuyTips(1)">Buy</div>
    </div>
    <div class="public-two">
      <div class="top">
        <div class="dots"></div>
        <div style="margin-left:20px">Publication</div>
      </div>
      <div class="content">
        <div class="qua">
          <div>Quantity destroyed</div>
          <div class="qua-item">{{ bookInfo.quantity - bookInfo.n_circulations }}</div>
        </div>

        <div class="exe">
          <div>Execution logging</div>
          <div class="qua-item">
            {{ bookInfo.destroy_log || '~' }}
          </div>
        </div>
        <div class="status">
          <div>State</div>
          <div class="qua-item">
            {{ bookInfo.status }}
          </div>
        </div>
      </div>
    </div>
    <div class="public-three">
      <div class="top">
        <div class="dots"></div>
        <div style="margin-left:20px">Publication</div>
      </div>
      <PreSale v-if="bookInfo.status === 'pre_sale'"/>
      <div class="tab-list" v-else>
        <div
          v-for="(item, index) in tabList"
          :key="index"
          :class="active == item.id ? 'tab-sel' : 'tab'"
          @click="changeTab(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- list -->
      <List
        v-if="active === 0"
        :id="bookInfo.id"
        :currency="bookInfo.token.currency"
        :showBuyTips="showBuyTips"
      />
      <!-- Activity -->
      <Activity
        v-if="active === 1"
        :id="bookInfo.id"
      />
      <!-- trend -->
      <Trend
        v-if="active === 2"
        :id="bookInfo.id"
      />
      <!-- 购买弹窗 -->
      <SellDialog
        v-if="visible"
        :dialogVisible="visible"
        :maxQuantity="maxQuantity"
        :level="level"
        :bookInfo="bookInfo"
        :currentBuyInfo="currentBuyInfo"
        @update:visible="handleClose"
        @update:list="handleUpdate"
      />
  </div>
  </div>
</template>
<script>
import {
  bookInfo,
  bookWished,
  bookWishedRemove,
  bookTrades,
  bookTransactions,
  bookTrend
} from "@/api/books.js";
import PreSale from './components/PreSale'
import List from './components/List'
import Activity from './components/Activity'
import Trend from './components/Trend'
import SellDialog from './components/SellDialog'
const moment = require('moment');
export default {
  name: "BookDetail",
  components: {
    PreSale,
    List,
    Activity,
    Trend,
    SellDialog
  },
  props: {},
  data() {
    return {
      showPreview:false,
      show: false,
      tabList: [
        {
          id: 0,
          name: "List"
        },
        {
          id: 1,
          name: "Activity"
        },
        {
          id: 2,
          name: "Trend"
        }
      ],
      active: 0,
      formData: {
        banners: "",
        description: "",
        name: "",
        site: "https://",
        community: "",
        address: ""
      },
      bookInfo: {
        book: {
          author: {}
        },
        issue: {},
        token: {}
      }, //书本信息
      currentBuyInfo: {},
      book: {
        author: {}
      },
      addressStr: "",
      countTime:{
        days: '-',
        hours: '-',
        minutes: '-',
        seconds: '-'
      },
      published_at:"",
      off_at:"",
      myChart:"",
      timer:null,
      visible:false,//购买弹窗
      maxQuantity:1,//购买数量最大值
      level:1,//一级、二级市场
    };
  },
  computed: {},
  watch: {},
  filters: {},
  directives: {},
  created() {

  },
  destroy(){
    clearInterval(this.timer)
  },
  mounted() {
    this.getBookInfo();
  },
  destroy() {},
  methods: {
    onSubmit() {
      console.log("tijia");
    },
    changeTab(e) {
      this.active = e;
    },
    getTrendList(){
      bookTrend({issue:this.bookInfo.id}).then((res)=>{
        console.log(res)
      })
    },
    getBookInfo() {
      const params = {
        id:this.$route.query.id
      }
      bookInfo(params).then(res => {
        console.log("res", res);
        this.bookInfo = res;
        this.book = res.book;
        // 获取二级市场挂单列表
        this.getTrendList();
        if (this.bookInfo.status == 'pre_sale') {
          // 预售的计算预售时间
          this.published_at = moment(this.bookInfo.published_at)
          this.timer = setInterval(() => {
            this.calcCountTime()
          }, 1000)
        }
        if (this.bookInfo.status == 'on_sale') {
          this.published_at = new Date(this.bookInfo.published_at)
          const duration = this.bookInfo.duration
          this.off_at = moment(this.published_at).add(duration, 'minutes')
          // 销售中的计算，下架倒计时
          this.timer = setInterval(() => {
            this.calcOffTime()
          }, 1000)
        }
      });
    },
    goWished() {
      let formData = new FormData();
      formData.append("issue", this.bookInfo.id);
      bookWished(formData).then(res => {
        console.log(res);
        this.getBookInfo();
      });
    },
    removeWished() {
      let formData = new FormData();
      formData.append("issue", this.bookInfo.id);
      bookWishedRemove(formData).then(res => {
        console.log(res);
        this.getBookInfo();
      });
    },
    // 试读
    trialReading(){
      // pdf直接打开预览
      if (this.bookInfo.book.preview.file_url) {
        if (this.bookInfo.book.preview.file_url.indexOf('.pdf') > -1) {
          window.open(this.bookInfo.book.preview.file_url)
        }
      } else {
        this.$toast("该图书，暂无试读")
      }
    },
    // 预售中 计算预售时间
    calcCountTime(){
      const nowMoment = moment()
      if (this.published_at) {
        const seconds = this.published_at.diff(nowMoment, 'seconds');
        const durations = moment.duration(seconds, 'seconds');
        this.countTime.days = durations.days()
        this.countTime.hours = durations.hours()
        this.countTime.minutes = durations.minutes()
        this.countTime.seconds = durations.seconds()
      }
    },
    // 销售中 下架倒计时
    calcOffTime(){
      const nowMoment = moment()
      if (this.off_at) {
        const seconds = nowMoment.diff(this.off_at, 'seconds');
        const durations = moment.duration(seconds, 'seconds');
        this.countTime.days = durations.days()
        this.countTime.hours = durations.hours()
        this.countTime.minutes = durations.minutes()
        this.countTime.seconds = durations.seconds()
      }
    },
    showBuyTips(level, secondData){
      // secondRow = secondData
      if (level === 1) {
        this.maxQuantity = this.bookInfo.n_circulations
      }
      if (level === 2) {
        this.maxQuantity = secondData.quantity
        this.currentBuyInfo = secondData
      }
      this.level = level
      this.visible = true
    },
    handleClose(){
      this.visible = false
    },
    handleUpdate(){
      window.reload()
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  text-align: left;
}
.mask {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 9999;
  overflow-y: hidden;
}
.wrapper {
  z-index: 9999;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 468px;
  background: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 26px;

  .title-buy {
    text-align: center;
    margin-bottom: 32px;
  }

  .selling {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    margin-bottom: 36px;

    .sel {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 27px;
    }
  }

  .cb-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    margin-top: 18px;
  }

  .cancel-btn {
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

  .buy-btn {
    width: 150px;
    height: 50px;
    background: #50483b;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffe1b4;
    line-height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.container {
  box-sizing: border-box;
  padding: 24px 40px;

  .icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 52px;

    img {
      width: 40px;
      height: 40px;
    }

    .mar {
      margin-left: 40px;
    }
  }

  .banner {
    width: 672px;
    height: 866px;
  }

  .title {
    width: 578px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 40px;
    margin: 38px 0px 40px 0px;
  }

  .name {
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #42392b;
    margin-bottom: 31px;
    display: flex;
    align-items: center;

    .num {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffe1b4;
      line-height: 26px;
      background: #42392b;
      border-radius: 20px;
      padding: 5px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 35px;
      width: 150px;

      span {
        display: inline-block;
        width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }
    }
  }

  .artical {
    width: 663px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 26px;
    margin-bottom: 41px;
  }

  .reading {
    width: 673px;
    height: 80px;
    background: #50483b;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffe1b4;
    line-height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 52px;
  }

  .public-one {
    width: 669px;
    height: 480px;
    background: #ffffff;
    border: 1px solid #000000;
    margin-bottom: 42px;
    box-sizing: border-box;
    padding: 30px;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        flex-direction: column;

        .left-top {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .left-bottom {
          display: flex;
          align-items: center;


          .published{
            margin-left:20px;
          }

          div {
            width: auto;
            line-height: 21px;
            background: #ffe1b4;
            border-radius: 10px;
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #8b5e28;
            padding: 3px 6px;
            box-sizing: border-box;
          }

          img {
            width: 13px;
            height: 13px;
          }
        }

        .dots {
          width: 9px;
          height: 9px;
          background: #000000;
          border-radius: 100%;
        }
      }

      .time {
        display: flex;

        .dot {
          margin: 0px 19px;
          font-size: 25px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #42392b;
        }

        .time-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .date {
          width: 44px;
          height: 46px;
          background: #000000;
          border-radius: 10px;
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .time-name {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #42392b;
          line-height: 27px;
          margin-top: 2px;
        }
      }
    }

    .center {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
      margin: 64px 0px 35px 0px;
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .one {
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }

      .second {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #010101;
        margin-top: 22px;
      }

      .third {
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #946937;
        margin-top: 30px;
      }

      .supply {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .number {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .ava {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .add-cale {
      width: 621px;
      height: 69px;
      background: #50483b;
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffe1b4;
      line-height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 36px;
    }
  }

  .public-two {
    width: 669px;
    background: #ffffff;
    border: 1px solid #000000;
    margin-bottom: 42px;
    padding: 35px 17px 9px 23px;
    box-sizing: border-box;

    .qua-item {
      margin-top: 22px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #010101;
    }

    .bottom {
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }

    .top {
      display: flex;
      align-items: center;
      margin-bottom: 49px;
    }

    .dots {
      width: 9px;
      height: 9px;
      background: #000000;
      border-radius: 50%;
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .qua {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }

      .exe {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }

      .status {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .public-three {
    width: 669px;
    position: relative;
    min-height: 230px;
    background: #ffffff;
    border: 1px solid #000000;
    margin-bottom: 42px;
    box-sizing: border-box;

    .top {
      display: flex;
      align-items: center;
      margin: 35px 0px 49px 23px;
    }

    .dots {
      width: 9px;
      height: 9px;
      background: #000000;
      border-radius: 50%;
    }

    .no-data {
      position: absolute;
      width: auto;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #000000;
      white-space: nowrap;

      img {
        width: 52px;
        height: 63px;
      }

      .remark {
        padding-top: 20px;
      }
    }

    .tab-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 64px;
      background: #fff7ec;
      box-sizing: border-box;
      padding: 0 40px;
      margin-bottom: 30px;
    }

    .tab-sel {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #42392b;
      line-height: 27px;
      position: relative;
      text-align: center;
      line-height: 64px;
      width: 67px;
    }

    .tab {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #98866e;
      line-height: 27px;
      width: 67px;
      text-align: center;
      line-height: 64px;
    }

    .tab-sel::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 67px;
      height: 2px;
      background: #42392b;
      border-radius: 1px;
    }

    .list {
      padding: 0px 30px 23px 23px;
      height: 390px;
      overflow: hidden; // 超出部分隐藏
      overflow-y: auto;

      .echart {
        width: 100%;
        height: 100%;
      }
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;

      .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-grow: 1;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 27px;
      }

      .avatar {
        flex-shrink: 0;
      }

      .list-title {
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin-left: 27px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 27px;
      }

      .time {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 27px;
        margin-top: 13px;
      }

      .left img {
        width: 38px;
        height: 39px;
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 18px;
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        color: #42392b;
        flex-shrink: 0;
      }

      .buy-btn {
        width: 71px;
        height: 26px;
        background: #39d172;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 9px;
      }
    }
  }
}
</style>
