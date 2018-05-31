import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-banner/list', {
    method: 'get',
    data: {...params, pageSize: 100}
  })
}

export async function queryCourse (params) {
  return request('/dashboard-banner/course', {
    method: 'get',
    data: {...params, pageSize: 10}
  })
}

export async function save (params) {
  return request('/dashboard-banner/save', {
    method: 'post',
    data: params
  })
}

export async function refresh (params) {
  return request('/dashboard-banner/refresh', {
    method: 'get',
    data: params
  })
}
