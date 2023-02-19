import { request } from '@utils/request'

// 作者详情-详情接口
export const queryAuthorDetail = (params) => {
  return request({
    url: `/users/${params.id}`,
    method: 'GET',
    params
  })
}

//作者详情-关注
export const handleFollow = (data) => {
  return request({
    url: `/fans`,
    method: 'POST',
    data
  })
}

//作者详情-取消关注
export const removeFollow = (data) => {
  return request({
    url: `/fans/remove`,
    method: 'POST',
    data
  })
}

// 作者详情-发布的书籍
export const queryPublishedBooks = (params) => {
  return request({
    url: `/issues`,
    method: 'GET',
    params
  })
}

// 作者详情-交易记录
export const queryActivity = (params) => {
  return request({
    url: `/transactions`,
    method: 'GET',
    params
  })
}

// 作者详情-个人藏品
export const queryCollection = (params) => {
  return request({
    url: `/assets`,
    method: 'GET',
    params
  })
}




