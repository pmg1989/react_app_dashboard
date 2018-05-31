import { request } from '../../utils'

export async function query(params) {
    return request('/dashboard-badword/list', {
        method: 'get',
        data: params
    })
}

export async function update(params) {
    return request('/dashboard-badword/list', {
        method: 'post',
        data: params
    })
}
