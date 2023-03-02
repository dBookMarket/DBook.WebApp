<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { StarFilled, Star, Share } from "@element-plus/icons-vue";
import { get, post } from "../service/http";
import router from "../router/index";
import message from "../assets/lib/resetMessage";
import moment from "moment";
import NoData from "../components/NoData.vue";
import wallet from "../service/wallet";
import * as echarts from "echarts";
// import VueMeta from 'vue-meta'
// 动态修改twitter card meta
// const { generate } = VueMeta
// const rawMetaInfo = {
//   meta:
//     [{ charset: 'utf-8' },
//     { name: 'twitter:card', content: 'summary' },
//     { name: 'twitter:title', content: 'Vue Social Cards Example' },
//     { name: 'twitter:description', content: 'Vue sample site showing off Twitter and Facebook Cards.' },
//     // image must be an absolute path
//     { name: 'twitter:image', content: this.logo },
//     // Facebook OpenGraph
//     { property: 'og:title', content: 'Vue Social Cards Example' },
//     { property: 'og:site_name', content: 'Vue Example' },
//     { property: 'og:type', content: 'website' },
//     { property: 'og:image', content: this.logo },
//     { property: 'og:description', content: 'Vue sample site showing off Twitter and Facebook Cards.' }
//     ]
// }
// const metaInfo = generate(rawMetaInfo /*, yourOptions*/)
// const HEAD = metaInfo.script.text() + metaInfo.meta.text()


let published_at, off_at, myChart, timer;
const bookInfo = ref({ book: { author: {} }, issue: {}, token: {} });
const countTime = ref({
  days: "-",
  hours: "-",
  minutes: "-",
  seconds: "-",
});
// 预售中 计算预售时间
const calcCountTime = () => {
  const nowMoment = moment();
  if (published_at) {
    const nowMoment = moment();
    const seconds = moment(published_at).diff(nowMoment, "seconds");
    if (seconds == 0) {
      // 清除倒计时
      clearInterval(timer);
      countTime.value.days = 0;
      countTime.value.hours =
        countTime.value.minutes =
        countTime.value.seconds =
        "00";
      // 倒计时结束，刷新数据
      setTimeout(() => {
        getBookIssue(bookId);
      }, 1000)
    } else {
      const durations = moment.duration(seconds, "seconds");
      countTime.value.days = durations.days();
      countTime.value.hours = durations.hours();
      countTime.value.minutes = durations.minutes();
      countTime.value.seconds = durations.seconds();
    }
  }
};
// 销售中 下架倒计时
const calcOffTime = () => {
  const nowMoment = moment();
  if (off_at) {
    const seconds = off_at.diff(nowMoment, "seconds");
    if (seconds == 0) {
      // 清除倒计时
      clearInterval(timer);
      countTime.value.days =
        countTime.value.hours =
        countTime.value.minutes =
        countTime.value.seconds =
        "00";
      // 倒计时结束，刷新数据
      setTimeout(() => {
        getBookIssue(bookId);
      }, 1000)
    } else {
      const durations = moment.duration(seconds, "seconds");
      countTime.value.days = durations.days();
      countTime.value.hours = durations.hours();
      countTime.value.minutes = durations.minutes();
      countTime.value.seconds = durations.seconds();
    }
  }
};
const getBookIssue = async (id) => {
  window.setLoading();
  const res = await get(`issues/${id}`);
  published_at = moment
    .utc(res.data.published_at)
    .local()
    .format("YYYY-MM-DD HH:mm:ss");
  res.data.published_at = published_at
  bookInfo.value = res.data;
  // 获取二级市场挂单列表
  getTradesList();
  if (bookInfo.value.status == "pre_sale") {
    // 预售的计算预售时间
    timer = setInterval(() => {
      calcCountTime();
    }, 1000);
  } else if (bookInfo.value.status == "on_sale") {
    const duration = bookInfo.value.duration;
    off_at = moment(published_at).add(duration, "minutes");
    // 销售中的计算，下架倒计时
    timer = setInterval(() => {
      calcOffTime();
    }, 1000);
  } else if (bookInfo.value.status == "off_sale") {
    countTime.value.days =
      countTime.value.hours =
      countTime.value.minutes =
      countTime.value.seconds =
      "00";
  }
  setTimeout(() => {
    window.hideLoading();
  }, 1000);
};
const bookId = router.currentRoute.value.params.id;
const issueType = ref("");
issueType.value = router.currentRoute.value.params.type;
if (bookId) {
  getBookIssue(bookId);
} else {
  router.push({ path: "/" });
}
onMounted(() => {
  let chartDom = document.getElementById("trendId");
  myChart = echarts.init(chartDom);
});
// 退出销毁计时器
onUnmounted(() => {
  clearInterval(timer);
});
// 作者
const goAuthor = () => {
  const userId = bookInfo.value.book.author.id;
  router.push({ path: `/authorCenter/${userId}` });
};
// 二手市场挂单列表
const tradesList = ref([]);
const getTradesList = async () => {
  const res = await get("/trades", { issue: bookInfo.value.id });
  tradesList.value = res.data.results;
};
// 二手市场交易列表activity
const activityList = ref([]);
const getTransactions = async () => {
  const res = await get("/transactions", { issue: bookInfo.value.id });
  console.log(res);
  activityList.value = res.data.results;
};
// 二手市场交易趋势图trend
const trendList = ref({ dates: [] });
const getTrend = async () => {
  const res = await get("/transactions/trend", { issue: bookInfo.value.id });
  trendList.value = res.data;
  await nextTick();
  const option = {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: res.data.dates,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: res.data.quantities,
        type: "line",
        areaStyle: {},
      },
    ],
  };
  option && myChart.setOption(option);
  myChart.resize();
};
const encate = (addr) => {
  if (addr) {
    return addr.substr(0, 6) + "..." + addr.substr(-4, 4);
  }
};
const goLink = (url) => {
  if (url) {
    window.open(url);
  } else {
    message.warning("not setting");
  }
};
// 试读
const trialReading = () => {
  // pdf直接打开预览
  if (bookInfo.value.book.preview.file_url) {
    if (bookInfo.value.book.preview.file_url.indexOf(".pdf") > -1) {
      window.open(bookInfo.value.book.preview.file_url);
    }
  } else {
    message.warning("该图书，暂无试读");
  }
};
// 分享
const goShare = () => {
  const { title } = bookInfo.value.book;
  const { name } = bookInfo.value.book.author;
  issueType.value = "";
  const href = window.location.href;
  const uri = `https://twitter.com/intent/tweet?text=I'm looking at the rare edition ${title} book%0Areleased by ${name}, so come and check it out on %0A%0A${encodeURIComponent("#dbookmarket #BookLovers #author")}%0A%0A${href}`
  window.open(uri);
};
const naviType = ref("List");
const changeNaviType = (type) => {
  naviType.value = type;
  if (type === "List") getTradesList();
  if (type === "Activity") getTransactions();
  if (type === "Trend") getTrend();
};
const calcSource = (source) => {
  if (source == 1) return "首发";
  if (source == 2) return "二手";
};
// 立即购买
const maxQuantity = ref(1);
let currentBuyLevel;
const buyForm = ref({ quantity: 1 });
let currentBuyInfo = null;
const buyTips = ref(false);
const showBuyTips = (level, secondData) => {
  const { quantity, n_circulations, buy_limit } = bookInfo.value;
  // buyForm.value.quantity = 1
  if (level === 1) {
    console.log(quantity - n_circulations > buy_limit);
    if (quantity - n_circulations > buy_limit) {
      maxQuantity.value = buy_limit;
    } else {
      maxQuantity.value = quantity - n_circulations;
    }
    console.log("maxQuantity.value", maxQuantity.value);
  }
  if (level === 2) {
    maxQuantity.value = quantity;
    currentBuyInfo = secondData;
  }
  currentBuyLevel = level;
  buyTips.value = true;
};
const buyNow = async () => {
  console.log(bookInfo.value);
  const params = {
    trade: bookInfo.value.trade.id,
    quantity: buyForm.value.quantity,
  };
  let walletOk = false;
  // 唤起钱包 并 签名
  // console.log("二级市场售卖用户数据", currentBuyInfo.user)
  // console.log("bookInfo", bookInfo.value)
  const block_chain = bookInfo.value.token.block_chain;
  const currency = bookInfo.value.token.currency;
  const walletInstance = new wallet(block_chain);
  console.log(walletInstance);
  const provider = await walletInstance.connectWeb3();
  const price = bookInfo.value.price;
  const amount = buyForm.value.quantity;
  console.log("amount", amount)
  if (currentBuyLevel === 1) {
    // 首发
    // 用户购买首发书籍流程

    // Step 1，调用platform合约payFirstTrade()转账给平台钱包，若成功，转step 2；
    // Step 2，调用transaction接口购买书籍。

    if (provider) {
      const signer = walletInstance.getSigner(provider);

      const is_approve = await walletInstance.allowance(
        signer,
        block_chain,
        currency.toLowerCase()
      );
      console.log("is_approve", is_approve == 0);
      console.log("is_approve", is_approve);
      // if (is_approve == 0) {
      const transactions = await walletInstance.approve(
        signer,
        block_chain,
        currency.toLowerCase()
      );
      console.log(transactions);
      // }

      const res = await walletInstance.payFirstTrade(amount, price, signer);
      console.log(res);
      walletOk = true;
    } else {
      message.warning("the provider is empty");
    }
  }
  if (currentBuyLevel === 2) {
    // 二手
    params.status = ""; //一级市场不需要, 二级市场根据链上交易状态定
    params.hash = ""; //一级市场不需要, 二级市场根据链上交易状态定
    // 用户购买二手书籍
    // Step 1，调用usdc合约approve()授权购买额度给platform合约，若成功，转step2；
    // Step 2，调用platform合约trade()进行交易，若成功，转step 3； 1
    // Step 3，调用transaction接口购买书籍。

    if (provider) {
      const signer = walletInstance.getSigner(provider);
      console.log("is_approve--currency", currency);
      let free = await walletInstance.getFee(
        signer,
        bookInfo.value.token.block_chain
      );
      console.log("free", amount);
      // const is_approve = await walletInstance.allowance(
      //   signer,
      //   bookInfo.value.token.block_chain,
      //   currency.toLowerCase()
      // );

      // if (is_approve == 0) {
      const transactions = await walletInstance.approve(
        signer,
        bookInfo.value.token.block_chain,
        currency.toLowerCase()
      );
      console.log(transactions);
      // }
      const transaction = await walletInstance.trade(
        signer,
        bookInfo.value.token.block_chain,
        currentBuyInfo.user.address,
        bookInfo.value.token.id,
        amount,
        "0x1234",
        currentBuyInfo.price,
      );
      console.log(transaction);
      if (!transaction || !transaction.status) return
      // params.status = transaction.status == 1 ? 'SUCCESS':'FAILURE';
      params.status = 'SUCCESS';
      params.hash = transaction.transactionHash;
      params.trade = currentBuyInfo.id;
      walletOk = true;
    } else {
      message.warning("the provider is empty");
    }
  }
  if (walletOk) {
    const res = await post("/transactions", params);
    console.log(res)
    if (res.ready) {
      message.success("success");
      // 购买成功，刷新数据
      getBookIssue(bookId);
    }
  }
};
const addWish = async () => {
  let res;
  if (bookInfo.value.is_wished) {
    // 取消收藏
    res = await post("/wishlists/remove", { issue: bookInfo.value.id });
  } else {
    res = await post("/wishlists", { issue: bookInfo.value.id });
  }
  if (res.ready) {
    bookInfo.value.is_wished = !bookInfo.value.is_wished;
    message.success("success");
    buyTips.value = false;
  }
};
// 添加日历
const addCalender = () => {
  // dates=20230827T101500/20230827T174500
  const { title } = bookInfo.value.book;
  const dates_start = moment(bookInfo.value.published_at).subtract(15, 'minutes').format("YYYYMMDDTHHmmss")
  const dates_end = moment(bookInfo.value.published_at).format("YYYYMMDDTHHmmss")
  const ctz = Intl.DateTimeFormat().resolvedOptions().timeZone // Asia/Shanghai
  const text = `${title} PRESALE`
  const location = `${title}+published_at+${published_at}`
  const details = `The rare edition book you want to buy ${title} will go on sale in 15 minutes.`
  // const uid = "850a6dc1-5413-411b-9376-1b878c10c18c"
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?&dates=${dates_start}/${dates_end}&ctz=${ctz}&text=${text}&location=${location}&details=${details}`)
}
// 查看作者
const checkAuthor = (id) => {
    router.push({ path: `/authorCenter/${id}` })
}
// 查看书籍
const checkBook = (row) => {
    router.push({ path: `/issueInfo/${row.issue.id}/display` })
}
</script>
<template>
  <div class="main">
    <div class="headerWrap">
      <Header></Header>
    </div>
    <div class="content">
      <div class="issueInfo">
        <el-image :src="bookInfo.book.cover_url" alt="" class="bookPost" fit="cover"></el-image>
        <div class="infos">
          <div class="line1">
            <div class="line_title">{{ bookInfo.book?.title }}</div>
            <div class="operaIconTop">
              <div class="noShoucang" v-if="bookInfo.is_wished === false" @click="addWish">
                <el-icon>
                  <Star />
                </el-icon>
              </div>
              <div class="shoucang" v-else @click="addWish">
                <el-icon>
                  <StarFilled />
                </el-icon>
              </div>
              <div class="shareIcon" @click="goShare">
                <el-icon>
                  <Share />
                </el-icon>
              </div>
            </div>
          </div>
          <div class="line2">
            <span class="author" @click="goAuthor">{{
              bookInfo.book.author.name
            }}</span>
            <span class="address">{{
              encate(bookInfo.book.author.address)
            }}</span>
          </div>
          <div class="line3" :title="bookInfo.book.desc || '什么也没有留下'">
            {{ bookInfo.book.desc || "什么也没有留下" }}
          </div>
          <div class="line4">
            <img src="../assets/img/site_white.svg" alt="" @click="goLink(bookInfo.book.author.website_url)" />
            <img src="../assets/img/discord_white.svg" alt="" @click="goLink(bookInfo.book.author.discord_url)" />
            <img src="../assets/img/twitter_white.svg" alt="" @click="goShare(bookInfo.book.author.twitter_url)" />
          </div>
          <div class="line5" @click="trialReading">Trial reading</div>
        </div>
      </div>
      <div class="Publication bookCard">
        <div class="topWrap">
          <div class="topTile">
            <span class="blackPoint"></span>
            <span class="title">Publication</span>
          </div>
          <div class="timeWrap">
            <img src="../assets/img/clock.svg" alt="" />
            <span class="time">{{ bookInfo.published_at }}</span>
          </div>
          <!-- 售卖中 -->
          <!-- v-show="['pre_sale', 'on_sale'].includes(bookInfo.status)" -->
          <div class="timeClock">
            <div v-show="['on_sale'].includes(bookInfo.status)" class="clockTip">
              Supply countdown
            </div>
            <div class="cl_1 part">
              <span class="value">{{ countTime.days }}</span>
              <div class="label">DAYS</div>
            </div>
            <div class="cl_2 point">：</div>
            <div class="cl_3 part">
              <span class="value">{{ countTime.hours }}</span>
              <div class="label">HOURS</div>
            </div>
            <div class="cl_4 point">：</div>
            <div class="cl_5 part">
              <span class="value">{{ countTime.minutes }}</span>
              <div class="label">MINUTES</div>
            </div>
            <div class="cl_6 point">：</div>
            <div class="cl_7 part">
              <span class="value">{{ countTime.seconds }}</span>
              <div class="label">SECONDS</div>
            </div>
          </div>
        </div>
        <div class="lineStep"></div>
        <div class="cardBottom between">
          <div class="cardBottomLeft">
            <div class="left_1">
              <div class="label_1">supply</div>
              <div class="value_1">{{ bookInfo.quantity || "-" }}</div>
              <div class="label_2">RN</div>
              <div class="value_2">
                {{ bookInfo.quantity - bookInfo.n_circulations }}
              </div>
            </div>
            <div class="left_2">
              <div class="label_1">Selling price</div>
              <div class="value_1">
                {{ bookInfo.price || 0 }} {{ bookInfo.token?.currency }}
              </div>
              <div class="label_2">purchase/person</div>
              <div class="value_2">{{ bookInfo.buy_limit || "-" }}</div>
            </div>
            <div class="left_3">
              <div class="label_1">Public Chain</div>
              <div class="value_">{{ bookInfo?.token?.currency }}</div>
            </div>
            <div class="left_4">
              <div class="label_1">Supply time range</div>
              <div class="value_1">{{ bookInfo.duration }} minutes</div>
              <div class="label_2">You own</div>
              <div class="value_2">{{ bookInfo.n_owned }}</div>
            </div>
          </div>
          <div class="cardBottomRight" v-if="bookInfo.status === 'pre_sale'">
            <span @click="addCalender">Add a calendar</span>
          </div>
          <div class="cardBottomRight" v-if="bookInfo.status === 'on_sale'">
            <span class="selloutBtn" v-if="bookInfo.quantity - bookInfo.n_circulations == 0">sellout</span>
            <span @click="showBuyTips(1)" v-else>Buy</span>
          </div>
          <div class="cardBottomRight" v-if="bookInfo.status === 'off_sale'">
            <span @click="showBuyTips(1)">停售</span>
          </div>
        </div>
      </div>
      <div class="Destroyed bookCard">
        <div class="topTile">
          <span class="blackPoint"></span>
          <span class="title">burn</span>
        </div>
        <div class="cardBottom">
          <div class="left_1">
            <div class="label">Quantity burned</div>
            <div class="value">
              {{ bookInfo.quantity - bookInfo.n_circulations }}
            </div>
          </div>
          <div class="left_2">
            <div class="label">执行记录</div>
            <div class="value">{{ bookInfo.destroy_log || "~" }}</div>
          </div>
          <div class="left_3">
            <div class="label">状态</div>
            <div class="value_">
              <div class="des" v-if="bookInfo.n_circulations == 0 && bookInfo.status == 'on_sale'">
                <p class="time_">
                  {{ countTime.days }} : {{ countTime.hours }} : {{ countTime.minutes }} : {{ countTime.seconds }}</p>
                <p class="dxh">待销毁</p>
              </div>
              <span v-else>
                {{ bookInfo.destroy_log == "" ? "待销毁" : "已销毁" }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="Secondary">
        <div class="topTile">
          <span class="blackPoint"></span>
          <span class="title">二级市场</span>
        </div>
        <div class="card_Secondary">
          <div v-if="['pre_sale', 'on_sale'].includes(bookInfo.status)" class="shoufa">
            <img src="../assets/img/state_2.svg" alt="" />
            <div>首发供应结束后开启</div>
          </div>
          <div v-else-if="bookInfo.status == 'unsold'" class="shoufa">
            <img src="../assets/img/state_2.svg" alt="" />
            <div>Opens after the end of the initial supply</div>
          </div>
          <div v-else class="erji">
            <div class="naviTitles">
              <span :class="{ actived: naviType === 'List' ? true : false }" @click="changeNaviType('List')">List</span>
              <span :class="{ actived: naviType === 'Activity' ? true : false }"
                @click="changeNaviType('Activity')">Activity</span>
              <span :class="{ actived: naviType === 'Trend' ? true : false }"
                @click="changeNaviType('Trend')">Trend</span>
            </div>
            <div v-if="naviType === 'List'" class="ListWrap">
              <div v-for="item in tradesList" :key="item.id" class="listItem">
                <el-image  :src="item.user.avatar_url" @click="checkAuthor(item.user.id)"></el-image>
                <div class="addressWrap">
                  <div class="hoverd" @click="checkAuthor(item.user.id)">{{ item.user.name + '(' + encate(item.user.address) + ')' }}</div>
                  <div>{{ item.updated_at }}</div>
                </div>
                <div class="buyWrap">
                  <div class="price">
                    {{ item.price }}{{ bookInfo.token?.currency }}
                  </div>
                  <div class="buy_btn" @click="showBuyTips(2, item)">Buy</div>
                </div>
              </div>
              <NoData v-show="tradesList.length === 0"></NoData>
            </div>
            <div v-if="naviType === 'Activity'" class="ActivityWrap">
              <!-- <el-table :data="activityList" class="light">
                <el-table-column label="Event" width="80px">
                  <template #default="scope">
                    <div class="evenetLable">
                      <img src="../assets/img/fabu.svg" v-if="scope.row.source === 1" alt="" />
                      <img src="../assets/img/jiaoyi.svg" v-if="scope.row.source === 2" alt="" />
                      <span>{{ calcSource(scope.row.source) }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Book" prop="" show-overflow-tooltip width="130px">
                  <template #default="scope">
                    <div class="bookWrap">
                      <el-image :src="bookInfo.book.cover_url" alt="" fit="cover"></el-image>
                      <span> {{ scope.row.issue.book.title }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Unit Price" prop="price" width="200px">
                  <template #default="scope">
                    <div class="evenetLable">
                      <img src="../assets/img/jinbi.svg" alt="" />
                      <span>{{ scope.row.price
                      }}{{ bookInfo.token?.currency }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Quantity" prop="quantity"></el-table-column>
                <el-table-column label="From" prop="" show-overflow-tooltip>
                  <template #default="scope">
                    {{
                      scope.row.buyer.name ? scope.row.buyer.name + '(' + encate(scope.row.buyer.address) + ')' :
                      encate(scope.row.buyer.address)
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="To" prop="to" show-overflow-tooltip>
                  <template #default="scope">
                    {{
                      scope.row.seller.name ? scope.row.seller.name + '(' + encate(scope.row.seller.address) + ')' :
                      encate(scope.row.seller.address)
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="Status" prop="updated_at" show-overflow-tooltip>
                  <template #default="scope">
                    {{ scope.row.status }}
                  </template>
                </el-table-column>
                <el-table-column label="Date" prop="updated_at" show-overflow-tooltip></el-table-column>
              </el-table> -->
              <el-table :data="activityList" class="dark">
            <el-table-column label="Event" width="90px">
                <template #default="scope">
                    <div class="evenetLable">
                        <img src="../assets/img/fabu.svg" v-if="scope.row.source === 1" alt="">
                        <img src="../assets/img/jiaoyi.svg" v-if="scope.row.source === 2" alt="">
                        <span>{{ calcSource(scope.row.source) }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Book" prop="">
                <template #default="scope">
                    <div class="hoverd" @click="checkBook(scope.row)"> {{ scope.row.issue.book.title }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Unit Price" prop="price">
                <template #default="scope">
                    <div class="evenetLable">
                        <img src="../assets/img/jinbi.svg" alt="">
                        <span>{{ scope.row.price }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Quantity" prop="quantity" width="90px"></el-table-column>
            <el-table-column label="From" prop="" show-overflow-tooltip>
                <template #default="scope">
                    <div class="hoverd" @click="checkAuthor(scope.row.buyer.id)">
                        {{
                            scope.row.buyer.name ? scope.row.buyer.name + '(' + encate(scope.row.buyer.address) + ')' :
                            encate(scope.row.buyer.address)
                        }}
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="To" prop="to" show-overflow-tooltip>
                <template #default="scope">
                    <div class="hoverd" @click="checkAuthor(scope.row.seller.id)">
                        {{
                            scope.row.seller.name ? scope.row.seller.name + '(' + encate(scope.row.seller.address) + ')' :
                            encate(scope.row.seller.address)
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Status" prop="status" show-overflow-tooltip width="100px"></el-table-column>
            <el-table-column label="Date" prop="updated_at" show-overflow-tooltip></el-table-column>
        </el-table>
            </div>
            <div v-show="naviType === 'Trend'" class="TrendWrap">
              <div id="trendId" v-show="trendList.dates.length > 0"></div>
              <NoData v-show="trendList.dates.length === 0"></NoData>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <div class="issueTips" v-show="issueType === 'new'">
      <div class="inner">
        <div class="i_title">listed</div>
        <div class="i_content">
          Congratulations on your successful listing, the last step, hurry up
          and share it on Twitter to let your readers and fans know.
        </div>
        <div class="operaIcon">
          <span class="cancel" @click="issueType = false">Cancel</span>
          <span class="continue" @click="goShare">Share</span>
        </div>
      </div>
    </div>
    <!-- 购买弹窗 -->
    <div class="buyTips" v-show="buyTips">
      <div class="inner">
        <div class="i_title">Buy</div>
        <div class="formWrap">
          <div class="form_item">
            <div class="form_label">Selling Price</div>
            <div class="form_value">
              {{ bookInfo.price }}{{ bookInfo.token?.currency }}
            </div>
          </div>
          <div class="form_item">
            <div class="form_label">Purchase quantity</div>
            <div class="form_value">
              <el-input-number size="mini" v-model="buyForm.quantity" :min="1" :max="maxQuantity"></el-input-number>
            </div>
          </div>
        </div>
        <div class="operaIcon">
          <span class="cancel" @click="buyTips = false">Cancel</span>
          <span class="continue" @click="buyNow">Buy</span>
        </div>
      </div>
    </div>
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
    flex: 1;
    margin: 0 auto;
    margin: 0 auto;
    position: relative;
    padding-top: 40px;

    .issueInfo {
      display: flex;
      margin-bottom: 41px;

      .bookPost {
        width: 189px;
        height: 246px;
        margin-right: 25px;
      }

      .infos {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .line1 {
          font-size: 22px;
          font-weight: bold;
          color: #000000;
          display: flex;

          .line_title {
            flex: 1;
          }

          .operaIconTop {
            width: 100px;
            display: flex;
            justify-content: flex-end;
            // justify-content: space-between;

            >div {
              cursor: pointer;
              margin-left: 15px;
            }

            .el-icon {
              font-size: 15px;
            }

            .shareIcon {
              width: 25px;
              height: 25px;
              text-align: center;
              line-height: 25px;
              background: #42392b;
              border-radius: 50%;

              .el-icon {
                color: #fff;
              }
            }

            .noShoucang,
            .shoucang {
              width: 25px;
              height: 25px;
              line-height: 25px;
              text-align: center;
              border-radius: 50%;
            }

            .noShoucang {
              background: #c2c2c2;

              .el-icon {
                color: #fff;
              }
            }

            .shoucang {
              background: #42392b;

              .el-icon {
                color: #fff;
              }
            }
          }
        }

        .line2 {
          .author {
            font-size: 15px;
            color: #42392b;
            margin-right: 15px;
            cursor: pointer;
          }

          .address {
            background: #42392b;
            border-radius: 20px;
            padding: 4px 8px;
            color: #ffe1b4;
          }
        }

        .line3 {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; //溢出内容隐藏
          text-overflow: ellipsis; //文本溢出部分用省略号表示
          display: -webkit-box; //特别显示模式
          -webkit-line-clamp: 2; //行数
          line-clamp: 2;
          -webkit-box-orient: vertical; //盒子中内容竖直排列
          font-size: 15px;
          color: #999999;
          line-height: 26px;
        }

        .line4 {
          img {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin-right: 25px;
          }
        }

        .line5 {
          width: 125px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          background: #50483b;
          color: #ffe1b4;
          cursor: pointer;
        }
      }
    }

    .bookCard {
      background: #ffffff;
      border: 1px solid #000000;
      padding: 23px;
      margin-bottom: 32px;

      .topTile {
        .blackPoint {
          width: 9px;
          height: 9px;
          background: #000000;
          border-radius: 9px;
          margin-right: 20px;
          margin-left: 2px;
          display: inline-block;
        }

        .title {
          font-size: 18px;
          color: #42392b;
        }
      }

      &.Publication {
        .topWrap {
          position: relative;

          .timeWrap {
            margin-top: 17px;

            img {
              width: 14px;
              height: 13px;
              margin-right: 12px;
            }

            span {
              background: #ffe1b4;
              border-radius: 10px;
              font-size: 12px;
              color: #8b5e28;
              padding: 5px 7px;
            }
          }

          .timeClock {
            position: absolute;
            right: 15px;
            top: 5px;
            display: flex;

            .clockTip {
              margin-right: 26px;
              font-size: 18px;
              font-family: PingFang SC;
              color: #42392b;
            }

            .part {
              width: 60px;
              text-align: center;

              .value {
                background: #000000;
                border-radius: 10px;
                font-size: 18px;
                color: #ffffff;
                padding: 8px 11px;
              }

              .label {
                font-size: 10px;
                color: #42392b;
                margin-top: 8px;
              }
            }

            .point {
              text-align: center;
            }
          }
        }

        .lineStep {
          width: 100%;
          height: 1px;
          background: #f3f3f3;
          margin: 25px 0 22px 0;
        }

        .cardBottom {
          display: flex;
          // justify-content: space-between;

          .cardBottomLeft {
            display: flex;
            justify-content: space-between;
            width: 60%;

            >div {
              display: flex;
              flex-direction: column;
              text-align: left;

              .label_1 {
                font-size: 12px;
                color: #999999;
              }

              .value_1 {
                font-size: 18px;
                color: #010101;
              }

              .label_2,
              .value_2 {
                font-size: 12px;
                color: #946937;
              }

              .value_ {
                font-size: 18px;
                color: #010101;
              }
            }
          }

          .cardBottomRight {
            display: flex;
            align-items: center;

            span {
              font-size: 15px;
              color: #ffe1b4;
              padding: 11px 72px;
              background: #50483b;
              margin-right: 22px;
              cursor: pointer;
              user-select: none;
            }

            .selloutBtn {
              background: #f0f0f0;
              color: #999999;
              cursor: not-allowed;
            }
          }
        }

        .between.between {
          justify-content: space-between;
        }
      }

      &.Destroyed {
        .cardBottom {
          text-align: center;
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 31px;

          >div {
            width: 33%;
            display: flex;
            flex-direction: column;
            text-align: left;

            .label {
              font-size: 12px;
              color: #999999;
            }

            .value {
              font-size: 18px;
              color: #010101;
            }

            .value_ {
              font-size: 18px;
              color: #f53131;

              .des {
                .time_ {
                  font-size: 18px;
                  font-family: PingFang SC;
                  color: #010101;
                }

                .dxh {
                  font-size: 12px;
                  font-family: PingFang SC;
                  color: #999999;
                }
              }
            }
          }
        }
      }
    }

    .Secondary {
      background: #ffffff;
      border: 1px solid #000000;
      margin-bottom: 32px;
      padding: 23px 0;

      .topTile {
        padding: 0 23px;

        .blackPoint {
          width: 9px;
          height: 9px;
          background: #000000;
          border-radius: 9px;
          margin-right: 20px;
          margin-left: 2px;
          display: inline-block;
        }

        .title {
          font-size: 18px;
          color: #42392b;
        }
      }

      .card_Secondary {
        .shoufa {
          text-align: center;

          img {
            width: 52px;
            height: 63px;
            margin: 0 auto;
            border-radius: 5px;
            zoom: 1.5;
          }

          div {
            font-size: 15px;
            color: #000000;
          }
        }

        // 二级市场
        .erji {
          .naviTitles {
            width: 100%;
            height: 43px;
            line-height: 43px;
            background: #fff7ec;
            margin-top: 30px;

            span {
              display: inline-block;
              font-size: 15px;
              font-family: PingFang SC;
              color: #98866e;
              margin: 0 38px;
              cursor: pointer;
            }

            span.actived {
              position: relative;

              &::after {
                content: "";
                width: 200%;
                height: 2px;
                background: #42392b;
                border-radius: 1px;
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
              }
            }
          }

          .ListWrap {
            .listItem {
              display: flex;
              justify-content: space-between;
              height: 89px;
              align-items: center;
              border-bottom: 1px solid #f3f3f3;
              padding: 0 50px 0 23px;

              .el-image {
                width: 38px;
                height: 39px;
                margin-right: 26px;
                border-radius: 50%;
              }

              .addressWrap {
                width: 200px;

                .hoverd:hover {
                  text-decoration: underline;
                  color: #7D5321;
                }
              }

              .buyWrap {
                flex: 1;
                text-align: right;

                .price {
                  font-size: 15px;
                  font-family: Alibaba PuHuiTi;
                  color: #42392b;
                }

                .buy_btn {
                  display: inline-block;
                  width: 71px;
                  height: 24px;
                  text-align: center;
                  background: #39d172;
                  font-size: 15px;
                  color: #ffffff;
                  line-height: 24px;
                  cursor: pointer;
                }
              }
            }
          }

          .ActivityWrap {
            padding: 0 50px 0 23px;
          }

          .TrendWrap {
            // padding: 0 50px 0 23px;
          }
        }
      }
    }
  }

  .issueTips {
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

      .i_content {
        font-size: 15px;
        color: #999999;
        line-height: 27px;
        margin: 43px 0 37px 0;
        background: #ffffff;
        border-radius: 10px;
      }

      &.send {
        .i_content {
          margin: 23px 0 37px 0;
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
          background: #fff7e9;
          font-size: 15px;
          color: #50483b;
        }

        .continue {
          width: 150px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          background: #50483b;
          font-size: 15px;
          color: #ffe1b4;
        }
      }
    }
  }

  .buyTips {
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
            width: 200px;
            font-size: 15px;
            color: #999999;
          }

          .form_value {
            font-size: 15px;
            color: #000000;
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
          background: #fff7e9;
          font-size: 15px;
          color: #50483b;
        }

        .continue {
          width: 150px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          background: #50483b;
          font-size: 15px;
          color: #ffe1b4;
        }
      }
    }
  }
}

.bookWrap {
  width: 100%;
  // display: flex;
  // align-items: center;

  .el-image {
    width: 18px;
    height: 22px;
    vertical-align: middle;
  }

  span {
    width: 70%;
    margin-left: 14px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

#trendId {
  height: 283px;
}
</style>