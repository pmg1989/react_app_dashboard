import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-competition/list', {
    method: 'get',
    data: params
  })
}

export async function save (params) {
  return request('/dashboard-competition/save', {
    method: 'post',
    data: params
  })
}

export async function queryCourse (params) {
  return request('/dashboard-course/list', {
    method: 'get',
    data: params
  })
}
