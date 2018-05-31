import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-user/list', {
    method: 'get',
    data: params
  })
}

export async function get (params) {
  return request('/api/userItem', {
    method: 'get',
    data: params
  })
}

export async function create (params) {
  return request('/api/user', {
    method: 'post',
    data: params
  })
}

export async function remove (params) {
  return request('/api/user', {
    method: 'delete',
    data: params
  })
}

export async function update (params) {
  return request('/api/user', {
    method: 'put',
    data: params
  })
}

export async function getScoreInfo (params) {
  return request('/balance/search', {
    method: 'post',
    data: params
  })
}

export async function changeScore (params) {
  return request('/balance/change', {
    method: 'post',
    data: params
  })
}
