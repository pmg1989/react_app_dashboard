const qs = require('qs')
const Mock = require('mockjs')
import mockStorge from '../../src/utils/mockStorge'
import { getBody } from '../utils'

let dataKey = mockStorge('LiveList', Mock.mock({
  'data|100': [
    {
      'id|+1': 1,
      title: '@ctitle',
      description: '@cparagraph',
      free: '@bool',
      'price|100-9999':100,
      image: "https://o9u2lnvze.qnssl.com/course/basic/http://blog.newband.com/wp-content/uploads/2016/07/bg-200.png?1489545265",
      thumbnail: "https://o9u2lnvze.qnssl.com/course/basic/http://blog.newband.com/wp-content/uploads/2017/01/1.22.2-300x169.jpg?1489545265",
      start: null,
      end: null,
      streaming: null,
      qiniuId: 100
    }
  ],
  page: {
    total: 100,
    current: 1
  }
}))

let ListData = global[dataKey]

module.exports = {

  'GET /live/list' (req, res) {
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
