import { request } from '../../utils'

export async function get (params) {
  return request('/topic/detail', {
    method: 'get',
    data: params
  })
}

export async function create (params) {
  return request('/topic/save', {
    method: 'post',
    data: params
  })
}

export async function update (params) {
  return request('/api/admin', {
    method: 'delete',
    data: params
  })
}
