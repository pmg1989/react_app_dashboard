import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-parameter/info', {
    method: 'get',
    data: params
  })
}

export async function save (params) {
  return request('/dashboard-parameter/save', {
    method: 'post',
    data: params
  })
}

export async function queryCourseSourse (params) {
  return request('/dashboard-course/list-detail', {
    method: 'get',
    data: params
  })
}

export async function queryCourse (params) {
  return request('/course-search', {
    method: 'get',
    data: params
  })
}
