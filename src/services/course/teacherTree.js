import { request } from '../../utils'

export async function queryList (params) {
  return request('/dashboard-course/list', {
    method: 'get',
    data: params
  })
}

export async function addEdit (params) {
  return request('/dashboard-course/edit-lesson', {
    method: 'post',
    data: params
  })
}
