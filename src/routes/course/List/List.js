import React, {PropTypes} from 'react'
import {Modal, InputNumber, Menu} from 'antd'
import {Link} from 'dva/router'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE, DELETE} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
  courseList: {
    loading,
    list,
    pagination
  },
  detailPower,
  updatePower,
  deletePower,
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

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: () => {},
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const handleOrderSet = (value, record) => {
    const item = {
      node_id: record.id,
      detail_id: record.detail_id,
      detail: {
        course_order: value
      }
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
      key: 'title'
    }, {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type'
    }, {
      title: '课程数',
      dataIndex: 'lesson_qty',
      key: 'lesson_qty'
    }, {
      title: '排序',
      dataIndex: 'course_order',
      key: 'course_order',
      render: (text, record) => (
        <InputNumber defaultValue={text} min={1} onChange={(value) => handleOrderSet(value, record)} />
      )
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}><Link to={`/course/tree?root_id=${record.id}`}>编辑</Link></Menu.Item>}
            {deletePower && <Menu.Item key={DELETE}>删除</Menu.Item>}
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

List.propTypes = {
  courseList: PropTypes.object.isRequired,
  onOrderItem: PropTypes.func.isRequired
}

export default List
