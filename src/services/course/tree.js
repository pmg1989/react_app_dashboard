import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-course/detail/', {
    method: 'get',
    data: params
  })
}

export async function get(params) {
  return request('/course-tree/one-node/', {
    method: 'get',
    data: params
  })
}

export async function update (params) {
  return request('/dashboard-course/save-node', {
    method: 'post',
    data: params
  })
}
