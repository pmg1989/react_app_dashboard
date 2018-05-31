import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-live-course/list', {
    method: 'get',
    data: params
  })
}

export async function get(params) {
  return request('/dashboard-live-course/detail/', {
    method: 'get',
    data: params
  })
}

export async function update (params) {
  return request('/dashboard-live-course/save', {
    method: 'post',
    data: params
  })
}
