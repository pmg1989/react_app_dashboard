import { request } from '../../utils'

export async function query (params) {
  return request('/topic/list', {
    method: 'get',
    data: params
  })
}

export async function setTop (params) {
  return request('/topic-recommend/save', {
    method: 'post',
    data: params
  })
}
