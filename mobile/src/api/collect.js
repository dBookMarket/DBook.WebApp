import { request } from '@utils/request'

//收集管理-个人收藏品
export const queryCollection = (params) => {
  return request({
    url: `/assets/current`,
    method: 'GET',
    params
  })
}
//收集管理-挂单列表
export const queryPendingOrders = (params) => {
  return request({
    url: `/trades/current`,
    method: 'GET',
    params
  })
}

//收集管理-个人总收益
export const queryEarnings = (params) => {
  return request({
    url: `/benefits/total`,
    method: 'GET',
    params
  })
}
