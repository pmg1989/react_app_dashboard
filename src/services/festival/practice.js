import { request } from '../../utils'

export async function query (params) {
  return request('/api/music/practice-songs', {
    method: 'get',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: {...params, order: 'created'}
  })
}

export async function create (params) {
  return request('/api/music/practice-song', {
    method: 'post',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: params
  })
}

export async function update (id, params) {
  return request(`/api/music/practice-song/${id}`, {
    method: 'put',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: params
  })
}

export async function shelt (id, status) {
  return request(`/api/music/practice-song/${id}/status/${status}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.0'
    }
  })
}

export async function remove (id) {
  return request(`/api/music/practice-song/${id}`, {
    method: 'delete',
    headers: {
      'X-Accept-Version': '4.0'
    }
  })
}
