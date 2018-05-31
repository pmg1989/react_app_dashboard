/**
 * Created by NEWBAND on 2017/6/20.
 */

import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-accompany/list', {
    method: 'get',
    data: params
  })
}


export async function save (params) {
  return request('/dashboard-accompany/save', {
    method: 'post',
    data: params
  })
}

export async function update (params) {
  return request('/dashboard-accompany/save', {
    method: 'post',
    data: params
  })
}