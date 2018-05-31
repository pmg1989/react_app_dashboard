import { request } from '../../utils'

export async function query (params) {
  return request('/dashboard-course/list', {
    method: 'get',
    data: params
  })
}
