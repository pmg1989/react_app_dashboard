/**
 * Created by NEWBAND on 2017/6/27.
 */
import { request } from '../../utils'

export async function query (params) {
  return request('/api/music/songs', {
    method: 'get',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: { ...params, mode: 'backend' }
  })
}

export async function update (params,id,status) {
  return request(`/api/music/song/${id}/status/${status}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.0'
    },
    data: params
  })
}

export async function updateIntern (path) {
  return request(`/api/music/song/${path}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.0'
    }
  })
}
