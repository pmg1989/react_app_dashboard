import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-user/list', {
    method: 'get',
    data: {...params,type:'teacher'}
  })
}

export async function forbid (params,id,status) {
  return request('/dashboard-user/forbidden', {
    method: 'post',
    data: {...params,user_id:id,act:(status==10?'up':'down')}
  })
}

export async function update (params) {
  return request('/dashboard-user/teacher-brand', {
    method: 'post',
    data: params
  })
}

export async function create (params) {
  return request('/dashboard-user/teacher-brand', {
    method: 'post',
    data: params
  })
}