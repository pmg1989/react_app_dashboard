import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-parameter/info', {
    method: 'get',
    data: params
  })
}

export async function update (params) {
  return request('/dashboard-parameter/save', {
    method: 'post',
    data: params
  })
}
