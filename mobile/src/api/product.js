import { service } from '@/utils/request'
import API from './api'

// 获取商品信息
export const getHomeProduct = (param) => {
  return service.get(API.yuan_product_list, param)
}
