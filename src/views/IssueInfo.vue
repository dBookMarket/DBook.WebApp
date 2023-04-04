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
import walletMobile from "../service/walletMobile";
import * as echarts from "echarts";
import cache from "../assets/lib/cache"
import { ElNotification } from 'element-plus'
import { IsPC } from "../assets/lib/util"
const bookId = router.currentRoute.value.params.id;
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
      window.setLoading();
      setTimeout(() => {
        getBookIssue(bookId);
      }, 3000)
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
    if (seconds < 0) {
      countTime.value.days =
        countTime.value.hours =
        countTime.value.minutes =
        countTime.value.seconds =
        "00";
      message.error("Abnormal book status")
      clearInterval(timer)
    } else if (seconds == 0) {
      // 清除倒计时
      clearInterval(timer);
      countTime.value.days =
        countTime.value.hours =
        countTime.value.minutes =
        countTime.value.seconds =
        "00";
      // 倒计时结束，刷新数据
      window.setLoading();
      setTimeout(() => {
        getBookIssue(bookId);
      }, 3000)
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
  console.log(bookInfo.value)
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
const goAuthor = (userId) => {
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
    tooltip: {
      trigger: 'axis',
      formatter: (a, b, c, d, e) => {
        const { axisValue, data, dataIndex } = a[0]
        const qulity = res.data.quantities[dataIndex]
        return `${axisValue}<br />价格：${data}<br /> 成交数量：${qulity}`
      }
      // position: function (pt) {
      //   return [pt[0], '10%'];
      // }
    },
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
        data: res.data.prices,
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
  if (source == 1) return "issue";
  if (source == 2) return "trade";
};
// 立即购买
const maxQuantity = ref(1);
let currentBuyLevel;
const buyForm = ref({ quantity: 1 });
let currentBuyInfo = null;
const buyTips = ref(false);

const loginUser = cache.get("userInfo")
const showBuyTips = (level, secondData) => {
  console.log("bookInfo.value.book", secondData, bookInfo.value.book)
  if (loginUser.id === bookInfo.value.book.author.id) {
    message.error("您不能购买自己发布的书籍")
    return
  }
  const { quantity, n_circulations, buy_limit } = bookInfo.value;
  // buyForm.value.quantity = 1
  if (level === 1) {
    if (quantity - n_circulations > buy_limit) {
      maxQuantity.value = buy_limit;
    } else {
      maxQuantity.value = quantity - n_circulations;
    }
  }
  if (level === 2) {
    maxQuantity.value = quantity;
    currentBuyInfo = secondData;
  }
  currentBuyLevel = level;
  buyTips.value = true;
};
const buyNow = async () => {
  const params = { trade: bookInfo.value.trade.id, quantity: buyForm.value.quantity };
  let walletOk = false;
  const { block_chain, currency } = bookInfo.value.token
  const price = bookInfo.value.price;
  const amount = buyForm.value.quantity;
  let walletInstance, provider, signer, allowance, transactions, transactionRes;
  // 唤起钱包 
  if (IsPC()) {
    walletInstance = new wallet(block_chain);
    provider = await walletInstance.connectWeb3()
    signer = walletInstance.getSigner(provider)
    allowance = await walletInstance.allowance(signer, block_chain, currency.toLowerCase());
    // 未授权的时候
    if (allowance.isZero()) {
      transactions = await walletInstance.approve(signer, block_chain, currency.toLowerCase());
      if (!transactions) {
        message.warning("Set approval failed, please try again.")
        window.hideLoading()
        return
      }
    }


  } else {
    walletInstance = new walletMobile(block_chain);
    provider = walletInstance.ethers_provider
    signer = walletInstance.signer
    allowance = await walletInstance.allowance(block_chain, currency.toLowerCase())
    if (allowance == 0) {
      // console.log("allowance2", allowance)
      transactions = await walletInstance.approve(block_chain, currency.toLowerCase())
      if (!transactions) {
        message.warning("Set approval failed, please try again.")
        window.hideLoading()
        return
      }
    }
  }
  // // 未授权的时候
  // if (allowance.isZero()) {
  //   // 授权
  //   if (IsPC()) {
  //     transactions = await walletInstance.approve(signer, block_chain, currency.toLowerCase());
  //   } else {
  //     transactions = await walletInstance.approve(block_chain, currency.toLowerCase())
  //   }

  //   if (!transactions) {
  //     message.warning("Set approval failed, please try again.")
  //     window.hideLoading()
  //     return
  //   }
  // }

  // 一级市场
  if (currentBuyLevel === 1) {
    // 交易
    if (IsPC()) {
      transactionRes = await walletInstance.payFirstTrade(amount, price, signer);
    } else {
      transactionRes = await walletInstance.payFirstTrade(amount, price)
    }
    if (!transactionRes || !transactionRes.status) return
    walletOk = true;
  }
  if (currentBuyLevel === 2) {
    // 二级市场
    params.status = ""; //一级市场不需要, 二级市场根据链上交易状态定
    params.hash = ""; //一级市场不需要, 二级市场根据链上交易状态定
    if (IsPC()) {
      transactionRes = await walletInstance.trade(
        signer,
        block_chain,
        currentBuyInfo.user.address,
        bookInfo.value.token.id,
        amount,
        "0x1234",
        currentBuyInfo.price,
      );
    } else {
      transactionRes = await walletInstance.tradev2(signer, block_chain, currentBuyInfo.user.address, bookInfo.value.token.id, amount, "0x1234", currentBuyInfo.price)
    }
    if (!transactionRes || !transactionRes.status) return
    // params.status = transaction.status == 1 ? 'SUCCESS':'FAILURE';
    params.status = 'success';
    params.hash = transactionRes.transactionHash;
    params.trade = currentBuyInfo.id;
    walletOk = true;
  }
  if (walletOk) {
    window.setLoading()
    const res = await post("/transactions", params);
    if (res.ready) {
      // message.success("success");
      // 购买成功，刷新数据
      buyTips.value = false;
      window.hideLoading()
      const { title } = bookInfo.value.book;
      ElNotification({
        title: title,
        message: 'pending',
        type: 'warning',
        duration: 0
      })
      getBookIssue(bookId);
    }
  }
};
const addWish = async () => {
  console.log(bookInfo.value)
  let res;
  if (bookInfo.value.is_wished) {
    // 取消收藏
    res = await post("/wishlists/remove", { issue: bookInfo.value.id });
  } else {
    res = await post("/wishlists", { issue: bookInfo.value.id });
  }
  if (res && res.ready) {
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
// 查看销毁记录
const checkDestryLog = () => {
  const destroy_log = bookInfo.value.destroy_log
  if (!destroy_log) return
  const { block_chain } = bookInfo.value.token
  if (block_chain === 'polygon') {
    window.open(`https://mumbai.polygonscan.com/tx/${destroy_log}`)
  }
  if (block_chain === 'bnb') {
    window.open(`https://testnet.bscscan.com/tx/${destroy_log}`)
  }
  if (block_chain === 'filecoin') {
    window.open(`https://hyperspace.filfox.info/en/tx/${destroy_log}`)
  }
}
</script>
<template>
  <div class="main issueContent">
    <div class="headerWrap">
      <Header></Header>
    </div>
    <div class="content ">
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
            <span class="author" @click="goAuthor(bookInfo.book.author.id)">
              {{ bookInfo.book.author.name || encate(bookInfo.book.author.address) }}</span>
            <span class="address" @click="goAuthor(bookInfo.book.author.id)">{{
              encate(bookInfo.book.author.address)
            }}</span>
          </div>
          <div class="line3">
            {{ bookInfo.book.desc || "The author left no description." }}
          </div>
          <div class="line4">
            <img src="../assets/img/site_white.svg" alt="" @click="goLink(bookInfo.book.author.website_url)" />
            <img src="../assets/img/discord_white.svg" alt="" @click="goLink(bookInfo.book.author.discord_url)" />
            <img src="../assets/img/twitter_white.svg" alt="" @click="goShare(bookInfo.book.author.twitter_url)" />
          </div>
          <div class="line5" @click="trialReading">Free reading</div>
        </div>
      </div>
      <div class="Publication bookCard">
        <div class="topWrap">
          <div class="topTile">
            <span class="blackPoint"></span>
            <span class="title">Issued</span>
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
        <div class="cardBottom ">
          <div class="cardBottomLeft">
            <div class="left_3_mobile">
              <div class="label_1">Public Chain</div>
              <div class="value_">{{ bookInfo?.token?.block_chain }}</div>
            </div>
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
              <div class="label_2">Purchase / Person</div>
              <div class="value_2">{{ bookInfo.buy_limit || "-" }}</div>
            </div>
            <div class="left_3 web">
              <div class="label_1">Public Chain</div>
              <div class="value_">{{ bookInfo?.token?.block_chain }}</div>
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
            <span :class="{ isSelf: loginUser.id === bookInfo.book.author.id ? true : false }" @click="showBuyTips(1)"
              v-else>Buy</span>
          </div>
          <div class="cardBottomRight" v-if="['unsold', 'off_sale'].includes(bookInfo.status)">
            <span class="tingshou" @click="showBuyTips(1)">closing a sale</span>
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
            <div class="label">executive logging</div>
            <div class="value desLog" @click="checkDestryLog">{{ encate(bookInfo.destroy_log) || "~" }}</div>
          </div>
          <div class="left_3">
            <div class="label">state</div>
            <div class="value_">
              <div class="des" v-if="bookInfo.n_circulations > 0 && bookInfo.status == 'on_sale'">
                <p class="time_">
                  {{ countTime.days }} : {{ countTime.hours }} : {{ countTime.minutes }} : {{ countTime.seconds }}</p>
                <p class="dxh">unburned</p>
              </div>
              <span v-else>
                {{ bookInfo.destroy_log == "" ? "unburned" : "burned" }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="Secondary">
        <div class="topTile">
          <span class="blackPoint"></span>
          <span class="title">Secondary Market</span>
        </div>
        <div class="card_Secondary">
          <div v-if="['pre_sale', 'on_sale'].includes(bookInfo.status)" class="shoufa">
            <img src="../assets/img/state_2.svg" alt="" />
            <div>Start it after the supply time is over</div>
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
                <el-image :src="item.user.avatar_url" @click="checkAuthor(item.user.id)"></el-image>
                <div class="addressWrap">
                  <div class="hoverd" @click="checkAuthor(item.user.id)">{{ item.user.name + '(' +
                    encate(item.user.address) + ')' }}</div>
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
          <div class="shuiWrap">
            <div class="banshuiWrap">
              <span class="banshui">royalty : </span><span class="shuiValue">{{ bookInfo.royalty }}</span>
            </div>
            <div class="pingtaishuiWrap">
              <span class="pingtaishui">Platform tax : </span><span class="shuiValue">3%</span>
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
    flex: 1;
    position: relative;

    .issueInfo {
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
            top: 5px;
            display: flex;

            .clockTip {
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

          // justify-content: space-between;
          .cardBottomLeft {
            display: flex;
            justify-content: space-between;

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

              &.isSelf {
                background: #f0f0f0;
                color: #999999;
                cursor: not-allowed;
              }
            }

            .tingshou {
              background: #f0f0f0;
              color: #999999;
              cursor: not-allowed;
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
        .desLog {
          cursor: pointer;

          &:hover {
            text-decoration: underline;
            color: #7d5321 !important;
          }
        }

        .cardBottom {
          text-align: center;
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 31px;

          >div {
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
              overflow: hidden;
              text-overflow: ellipsis;
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
                  color: #7d5321;
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
      width: 90%;
      max-width: 447px;
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
      width: 90%;
      max-width: 447px;
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

        .shuiWrap {
          display: flex;
          justify-content: flex-end;
          font-size: 15px;
          color: #999999;
          margin-bottom: 35px;

          .banshuiWrap {
            position: relative;
            padding: 0 10px;
            margin-right: 10px;

            .banshui {}

            &::after {
              content: "";
              height: 60%;
              position: absolute;
              top: 50%;
              right: 0;
              width: 1px;
              background-color: gray;
              transform: translateY(-50%);
            }
          }

          .pingtaishuiWrap {
            .pingtaishui {}

          }



          .shuiValue {}
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