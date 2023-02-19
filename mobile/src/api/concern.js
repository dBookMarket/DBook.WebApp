import { request } from '@utils/request'

//个人关注-关注书籍列表
export const queryConcernOpus = (params) => {
  return request({
    url: `/wishlists/current`,
    method: 'GET',
    params
  })
}
//个人关注-关注作者列表
export const queryConcernAuthor = (params) => {
  return request({
    url: `/fans/current`,
    method: 'GET',
    params
  })
}
