import { request } from '../../utils'

export async function getSendList (params) {
  return request('/sendsearch', {
    method: 'put',
    data: params
  })
}

export async function sendStatus (params) {
  return request('/sendstatus', {
    method: 'put',
    data: params
  })
}
