const qs = require('qs')
const Mock = require('mockjs')
import mockStorge from '../../src/utils/mockStorge'
import { getBody } from '../utils'

let dataKey = mockStorge('Accompany', Mock.mock({
  'date|100': [
    {
      'id|+1': 1,
      'cover': "",
      'title': "怒放的生命",
      status: '@boolean',
      upload_date_start: '1463405953',
      upload_date_end: '1463405954',
    }
  ],
  loading:false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: null
  }
}))

let AccompanyData = global[dataKey]

module.exports = {



}
