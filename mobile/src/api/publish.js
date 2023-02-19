import { request } from '@utils/request'

// 出版管理-个人详情
export const queryUserInfo = (params) => {
  return request({
    url: `/users/current`,
    method: 'GET',
    params
  })
}


// 出版管理-草稿列表
export const queryDraftList = (params) => {
  return request({
    url: `/drafts`,
    method: 'GET',
    params
  })
}

// 出版管理-草稿删除
export const deleteDraft = (id) => {
  return request({
    url: `/drafts/${id}`,
    method: 'DELETE',
  })
}

// 出版管理-即将上架列表
export const queryTobeList = (params) => {
  return request({
    url: `/books`,
    method: 'GET',
    params
  })
}

// 出版管理-即将上架删除
export const deleteTobeList = (id) => {
  return request({
    url: `/books/${id}`,
    method: 'DELETE',
  })
}

// 出版管理-上架成功列表
export const queryAvalibableList = (params) => {
  return request({
    url: `/issues/current`,
    method: 'GET',
    params
  })
}

// 出版管理-上架成功删除
export const DeleteAvalibable = (id) => {
  return request({
    url: `/issues/${id}`,
    method: 'DELETE',
  })
}

// 出版管理-上架成功重新上架
export const relistAvalibable = (id) => {
  return request({
    url: `/issues/${id}/resale`,
    method: 'PATCH',
  })
}

// 出版管理-个人收益列表
export const queryEarningList = (params) => {
  return request({
    url: `/benefits/total`,
    method: 'GET',
    params
  })
}
