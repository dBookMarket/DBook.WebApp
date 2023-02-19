import { POST, GET, PUT, PATCH,request } from "@/utils/request";
import API from "./api";

export const draftsList = param => {
  return GET(API.yuan_drafts, param);
};

//草稿添加保存
export const draftAdd = param => {
  return POST(API.yuan_drafts, param);
};

//草稿详情
export const queryDraftInfo = (id) => {
  return request({
    url: `/drafts/${id}`,
    method: 'GET',
  })
}

//草稿修改
export const editDraft = (data) => {
  return request({
    url: `/drafts/${data.id}`,
    method: 'PUT',
    data,
  })
}

export const tobeListBook = param => {
  return GET(API.yuan_books, param);
};

//添加书籍
export const bookAdd = param => {
  return POST(API.yuan_books, param);
};

//编辑书籍
export const bookUpdate = (data,id) => {
  return request({
    url: `/books/${id}`,
    method: 'PATCH',
    data,
  })
};

//书籍详情页
export const bookInfo = param => {
  return GET(`${API.yuan_books_info}/${param.id}`);
};

//书籍详情页
export const bookDetail = (id) => {
  return request({
    url: `/issues/${id}`,
    method: 'GET',
  })
};
export const bookDetailV2 = (id) => {
  return request({
    url: `/books/${id}`,
    method: 'GET',
  })
};
//书籍出版
export const bookPublish = param => {
  return POST(API.yuan_books_info, param);
};

//收藏
export const bookWished= param => {
  return POST(API.yuan_book_wish, param);
};

//收藏 取消
export const bookWishedRemove= param => {
  return POST(API.yuan_book_wish_remove, param);
};

//二级市场列表
export const bookTrades= param => {
  return GET(API.yuan_book_trades, param);
};
//二级市场 活动
export const bookTransactions= param => {
  return GET(API.yuan_book_transactions, param);
};
//二级市场趋势
export const bookTrend= param => {
  return GET(API.yuan_book_trend, param);
};
// 交易
export const buyBook = (data) => {
  return request({
    url: `/transactions`,
    method: 'POST',
    data,
  })
};




