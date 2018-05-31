import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-contest/list', {
    method: 'get',
    data: params
  })
}

export async function save (params) {
  return request('/dashboard-contest/save', {
    method: 'post',
    data: params
  })
}

export async function update (params,id,status) {
  return request(`/api/music/work/${id}/status/${status}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: params
  })
}

export async function getContestList (params) {
  return request('/api/music/works', {
    method: 'get',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: { ...params, mode: 'backend' }
  })
}

export async function updateIntern (path) {
  return request(`/api/music/work/${path}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.0'
    }
  })
}