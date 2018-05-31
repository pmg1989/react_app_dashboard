import { request } from '../../utils'

export async function queryList (params) {
  return request('/dashboard-coupon/send-log', {
    method: 'get',
    data: params
  })
}

export async function queryDetail (params) {
  return request('/dashboard-coupon/batch-detail', {
    method: 'get',
    data: params
  })
}
