/**
 *  接口统一管理
 */

export default {
  /**
   * 商品相关接口
   */
  yuan_product_list: "/products/list", // 商品列表

  /**
   * 用户相关接口
   */
  yuan_users_login: "/users/login", // 登陆

  /**
   * 用户详情
   */
  yuan_users_detail: "/users/current",

  /**
   * 修改用户信息
   */
  yuan_users_update: "/users",

  /**
   * twitter校验
   */
  yuan_users_auth: "/users/auth",
  /**
   * twitter发送并授权
   */
  yuan_users_share: "/users/share ",

  /**
   * 书籍相关 编辑
   */
  yuan_books: "/books ",
  /**
   * 书籍信息查询
   */
  yuan_books_info: "/issues",
  /**
   * 草稿
   */
  yuan_drafts: "/drafts",

  /**
   * 书籍收藏
   */
  yuan_book_wish: "/wishlists",

  /**
   * 书籍收藏取消
   */
  yuan_book_wish_remove: "/wishlists/remove",
  /**
   * 二级市场 挂单 列表
   */
  yuan_book_trades: "/trades",
  /**
   * 二级市场 活动交易 列表
   */
   yuan_book_transactions: "/transactions",
   /**
   * 二级市场 趋势 列表
   */
  yuan_book_trend: "/transactions/trend",

  /**
   * 根据地址获取nonce
   */
  nonce: '/nonce',
  
  /**
   * 登录
   */
  login: '/login',
  
};
