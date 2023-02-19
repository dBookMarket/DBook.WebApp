import { request } from '@utils/request'

// 首页-搜索接口
export const searchBooks = (params) => {
  return request({
    url: '/issues',
    method: 'GET',
    params
  })
}

// 首页-登录
export const login = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

// 首页-退出登录
export const logout = (data) => {
  return request({
    url: '/logout',
    method: 'POST',
    data
  })
}


