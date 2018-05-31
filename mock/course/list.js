const qs = require('qs')
const Mock = require('mockjs')
import mockStorge from '../../src/utils/mockStorge'
import { getBody } from '../utils'

let dataKey = mockStorge('CourseList', Mock.mock({
  'data|100': [
    {
      'id|+1': 1,
      title: '@ctitle',
      'detail_id|+1': [10, 20, 30],
      'lesson_qty|+1': [100, 200, 300],
      'type|+1': ['basic_course', 'course']
    }
  ],
  page: {
    total: 100,
    current: 1
  }
}))

let ListData = global[dataKey]

module.exports = {

  'GET /dashboard-course/list' (req, res) {
    const page = qs.parse(req.query)
    const pageSize = page.pageSize || 10
    const currentPage = page.page || 1

    let data
    let newPage

    let newData = ListData.data.concat()

    if (page.field) {
      const d = newData.filter(function (item) {
        return item[page.field].indexOf(decodeURI(page.keyword)) > -1
      })

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      newPage = {
        current: currentPage * 1,
        total: d.length
      }
    } else {
      data = ListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      ListData.page.current = currentPage * 1
      newPage = ListData.page
    }
    res.json({success: true, list: data, page: {...newPage, pageSize: Number(pageSize)}})
  },

}
