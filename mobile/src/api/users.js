import { POST,GET,PUT,PATCH} from '@/utils/request'
import API from './api'

// 登陆
export const userLogin = (param) => {
  return POST(API.yuan_users_login, param)
}

//用户详情
export const userDetail = (param) => {
  return GET(API.yuan_users_detail, param)
}

//修改用户信息
export const userUpdate = (id,param) => {
  return PUT(`${API.yuan_users_update}/${id}`, param)
}

//twitter 校验
export const twitterAuth = (param) => {
  return PUT(API.yuan_users_auth, param)
}

//发送twitter 并授权
export const twitterShare = (param) => {
  return PUT(API.yuan_users_share, param)
}


export const addressLogin = (param) => {
  return POST(API.login, param)
}

export const generateNonce = (param) => {
  return POST(API.nonce, param)
}

