import React from 'react'
import {Modal, InputNumber, Menu, Tag} from 'antd'
import {Link} from 'dva/router'
import styles from './List.less'
import {DataTable, DropMenu, InputOrder} from '../../../components/'
import {UPDATE, SHELT, SHELTOFF, DELETE} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
  courseTeacher: {
    loading,
    list,
    pagination
  },
  detailPower,
  sheltPower,
  sheltOffPower,
  updatePower,
  deletePower,
  onEditItem,
  onSheltItem,
  onOrderItem
}) {

  const handleDeleteItem = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk () {
        onDeleteItem(record.id)
      }
    })
  }

  const handleSheltItem =(record) => {
    onSheltItem({ root_id: record.root, status: 10 })
  }

  const handleSheltOffItem =(record) =>{
    confirm({
      title:'你确定要下架吗',
      onOk () {
        onSheltItem({ root_id: record.root, status: 0 })
      }
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      "link": () => {},
      [UPDATE]: onEditItem,
      [SHELT]:handleSheltItem,
      [SHELTOFF]:handleSheltOffItem,
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const handleOrderSet = (value, record) => {
    const item = {
      root_id: record.root,
      course_order: value
    }
    onOrderItem(item)
  }

  const columns = [
    {
      title: '课程编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '课程标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <span>{title}</span><br /><span>(课时数：{record.lesson_qty})</span><br />
          <span>更新时间：{new Date(record.updated_at * 1000).format("yyyy-MM-dd HH:mm:ss")}</span>
        </div>
      )
    }, {
      title: '课程封面',
      dataIndex: 'new_cover_image',
      key: 'new_cover_image',
      render: (new_cover_image) => (
        <img height={100} src={new_cover_image} />
      )
    }, {
      title: '分级',
      dataIndex: 'interest',
      key: 'interest',
      render: (interest, record) => (
        <span>{interest && interest.nameChinese} {' '} {record.level.name}</span>
      )
    }, {
      title: '老师',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => (
        <span>{teacher && teacher.name}</span>
      )
    }, {
      title: '售价(牛币)',
      dataIndex: 'nb_price',
      key: 'nb_price'
    }, {
      title: '订阅数',
      dataIndex: 'subscribe',
      key: 'subscribe',
      render: (subscribe, record) => (
        <span className={styles.text_left}>真实数：{subscribe}<br/> 虚拟数：{record.fake_subscribe}</span>
      )
    }, {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type',
      render: (type, record, index) => (
        <span>{type} <br /><br /> {index < 4 && <Tag color="#f50">首页</Tag>}</span>
      )
    }, {
      title: '排序',
      dataIndex: 'course_order',
      key: 'course_order',
      render: (text, record) => (
        <InputOrder defaultValue={text} onChange={(value) => handleOrderSet(value, record)} />
      )
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑课程</Menu.Item>}
            {updatePower && <Menu.Item key={'link'}><Link to={`/course/teacher/${record.root}?lesson_status=10`}>编辑课时</Link></Menu.Item>}
            {record.status === '0' && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}
            {record.status === '10' && sheltOffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}
            {/* {deletePower && <Menu.Item key={DELETE}>删除</Menu.Item>} */}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    }
  ]

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={list}
      loading={loading}
      pagination={pagination}
      rowKey={record => record.id}
    />
  )
}

export default List
