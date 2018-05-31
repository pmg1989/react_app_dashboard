import { request } from '../../utils'

export async function query(params) {
  return request('/dashboard-user/verify-todos', {
    method: 'get',
    data: params
  })
}

export async function forbid(params, id, status) {
  return request('/dashboard-user/verify-profile', {
    method: 'post',
    data: params
  })
}