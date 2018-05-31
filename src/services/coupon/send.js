import { request } from '../../utils'

export async function queryPhone (params) {
  return request('/dashboard-coupon/mobile', {
    method: 'get',
    data: {...params, pageSize: 10}
  })
}

export async function send (params) {
  return request('/dashboard-coupon/send', {
    method: 'post',
    data: params
  })
}

export async function check (params) {
  return request('/dashboard-coupon/check', {
    method: 'post',
    data: params
  })
}
