import { request } from '../../utils'

export async function queryList (params) {
  return request('/dashboard-course/list', {
    method: 'get',
    data: params
  })
}

export async function queryCourseParameter (params) {
  return request('/dashboard-course/parameter', {
    method: 'get',
    data: params
  })
}

export async function getDetail(id, params, isShare) {
  return request(`/course-detail/${id}`, {
    method: 'get',
    data: params,
  })
}

export async function addEdit (params) {
  return request('/dashboard-course/edit-root', {
    method: 'post',
    data: params
  })
}

export async function shelt (params) {
  return request(`/dashboard-course/status`, {
    method: 'post',
    data: params
  })
}

export async function order (params) {
  return request('/dashboard-course/edit-detail', {
    method: 'post',
    data: params
  })
}
