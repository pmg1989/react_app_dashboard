const qs = require('qs')
const Mock = require('mockjs')
import mockStorge from '../../src/utils/mockStorge'
import { getBody } from '../utils'

const dic = {
  1: {"1":[1,2],"2":[1],"3":[1],"4":[1],"5":[1],"6":[1],"7":[1],"8":[1],"9":[1],"10":[1],"11":[1],"21":[1,2,3,4,5],"22":[1,2,3,4,5],"23":[1,2,3,4,5,12],"31":[1,2,4],"41":[1,2],"42":[1,2],"51":[1,2,3,4,5,6],"61":[1,2,3,4,5],"71":[1,2,4,6],"72":[2,4],"73":[1,2,3,4,5,6],"81":[1,2,3,4,5],"91":[1,2,3],"101":[1,2,3,4,5,9,10,11],"102":[2,3,4],"111":[1,2,3,4,5,9,10],"112":[1,2,3,4,5,9,10],"114":[1,2,3,4,5],"115":[1,2,3,4,6,9,10],"116":[1,2,3,4,6,9,10],"117":[1,2,3,4,8,9,10]},
  2: {
    1: [1],
    2: [1],
    3: [1],
    4: [1, 3, 4],
    5: [1, 2, 3, 4, 5],
    6: [1],
    7: [1, 4]
  },
  3: {
    1: [1],
    6: [1],
    7: [1, 4]
  }
}

let dataKey = mockStorge('AccountRoleList', Mock.mock({
  'data|3': [
    {
      'id|+1': 1,
      'name|+1': ["管理员", "教师", "学生"],
      'power|+1':[dic[1], dic[2], dic[3]]
    }
  ],
  page: {
    total: 3,
    current: 1
  }
}))

let dataKeyPL = mockStorge('AccountPowerList', Mock.mock({
  data: dic
}))

let roleListData = global[dataKey]
let powerList = global[dataKeyPL]

module.exports = {

  'GET /dashboard-admin-role/list' (req, res) {
    const page = qs.parse(req.query)
    const pageSize = page.pageSize || 10
    const currentPage = page.page || 1

    let data
    let newPage

    let newData = roleListData.data.concat()

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
      data = roleListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      roleListData.page.current = currentPage * 1
      newPage = roleListData.page
    }
    res.json({success: true, list: data, page: {...newPage, pageSize: Number(pageSize)}})
  },

  'POST /dashboard-admin-role/edit' (req, res) {
    const curItem = getBody(req)

    if(curItem.id) {
      roleListData.data = roleListData.data.map(function (item) {
        if (item.id === curItem.id) {
          return {...curItem, power: JSON.parse(curItem.power)}
        }
        return item
      })

      global[dataKeyPL].data[curItem.id] = JSON.parse(curItem.power)
    } else {
      curItem.id = roleListData.data.length + 1
      roleListData.data.push({...curItem, power: JSON.parse(curItem.power)})

      roleListData.page.total = roleListData.data.length
      roleListData.page.current = 1
    }

    global[dataKey] = roleListData

    res.json({success: true, data: roleListData.data, page: roleListData.page})
  },

  'POST /dashboard-admin-role/del' (req, res) {
    const deleteItem = getBody(req)

    roleListData.data = roleListData.data.filter(function (item) {
      return item.id !== deleteItem.id
    })

    roleListData.page.total = roleListData.data.length

    global[dataKey] = roleListData

    res.json({success: true, data: roleListData.data, page: roleListData.page})
  },

}
