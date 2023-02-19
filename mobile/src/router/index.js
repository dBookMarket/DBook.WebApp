import Vue from "vue";
import VueRouter from "vue-router";

const userSet = () => import(/* webpackChunkName: "userSet" */ "@/views/userSet");

const bookDetail = () =>import(/* webpackChunkName: "bookDetail" */ "@/views/book-detail");

const editBook = () =>import(/* webpackChunkName: "editBook" */ "@/views/editBook");

const shelfSet = () =>import(/* webpackChunkName: "shelfSet" */ "@/views/shelfSet");

const draftEditor = () =>import(/* webpackChunkName: "draftEditor" */ "@/views/draft-editor");

const pdfH5 = () => import(/* webpackChunkName: "pdfH5" */ "@/views/pdfH5");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/home"),
    meta: {
      title: "home"
    }
  },
  {
    path: "/author-detail",
    name: "authorDetail",
    component: () =>
      import(/* webpackChunkName: "authorDetail" */ "@/views/author-detail"),
    meta: {
      title: "home"
    }
  },
  {
    path: "/concern",
    name: "concern",
    component: () =>
      import(/* webpackChunkName: "concern" */ "@/views/concern"),
    meta: {
      title: "concern"
    }
  },
  {
    path: "/publish-manage",
    name: "publishManage",
    component: () =>
      import(/* webpackChunkName: "publishManage" */ "@/views/publish-manage"),
    meta: {
      title: "publishManage"
    }
  },
  {
    path: "/collect-manage",
    name: "CollectManage",
    component: () =>
      import(/* webpackChunkName: "CollectManage" */ "@/views/collect-manage"),
    meta: {
      title: "CollectManage"
    }
  },
  {
    path: "/userSet",
    name: "userSet",
    component: userSet,
    meta: {
      title: "userSet"
    }
  },
  {
    path: "/book-detail",
    name: "bookDetail",
    component: bookDetail,
    meta: {
      title: "bookDetail"
    }
  },
  {
    path: "/editBook",
    name: "editBook",
    component: editBook,
    meta: {
      title: "editBook"
    }
  },
  {
    path: "/shelfSet",
    name: "shelfSet",
    component: shelfSet,
    meta: {
      title: "shelfSet"
    }
  },
  {
    path: "/draftEditor",
    name: "draftEditor",
    component: draftEditor,
    meta: {
      title: "draftEditor"
    }
  },
  {
    path: "/pdfH5",
    name: "pdfH5",
    component: pdfH5,
    meta: {
      title: "pdf"
    }
  }
];

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("savedPosition", savedPosition);
          resolve(savedPosition);
        }, 500);
      });
    } else {
      return { x: 0, y: 0 };
    }
    // return 期望滚动到哪个的位置 -让页面滚动到顶部
    // return { x: 0, y: 0 }
  },
  mode: "history",
  routes
});

export default router;
