import { request } from '../../utils'

export async function query (params) {
  return request('/category/list', {
    method: 'get',
    // headers: {
    //   'X-Accept-Version': '4.1'
    // },
    data: params
  })
}

export async function create (params) {
  return request('/category/create', {
    method: 'post',
    data: params
  })
}

export async function update (id,params) {
  return request(`/category/update/${id}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.1'
    },
    data: params
  })
}

export async function remove(id) {
  return request(`/category/delete/${id}`, {
    method: 'delete',
    headers: {
      'X-Accept-Version': '4.1'
    }
  })
}

export async function order (params) {
  return request(`/category/order/${path}`, {
    method: 'patch',
    headers: {
      'X-Accept-Version': '4.1'
    },
    data: params
  })
}