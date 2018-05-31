import React,{PropTypes,Component} from 'react'
import {Modal, InputNumber, Menu} from 'antd'
import {Link} from 'dva/router'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE,DELETE} from '../../../constants/options'

const confirm = Modal.confirm

function List({
  courseCategory:{
    loading,
    list,
    pagination
  },
    detailPower,
    updatePower,
    deletePower,
    onOrderItem,
    oneditItem,
    onDeleteItem
}) {

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: oneditItem,
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const handleDeleteItem = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk () {
        onDeleteItem(record.id)
      }
    })
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
      title:'课程编号',
      dataIndex: 'id',
      key:'id'
    },{
      title:'课程类型',
      dataIndex: 'type',
      key: 'type'
    },{
      title: '排序',
      dataIndex: 'course_order',
      key: 'course_order',
      render: (text,record) => (
        <InputNumber defaultValue={text} min={1} onChange={(value) => handleOrderSet(value, record)} />
      )
    },{
      title: '操作',
      key: 'operation',
      render:(text,record) => (
        <DropMenu>
          <Menu onClick={({key})=>handleMenuClick(key,record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {deletePower && <Menu.Item key={DELETE}>删除</Menu.Item>}
          </Menu>
        </DropMenu>
      )
    }
  ]

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={list}
      loading={loading}
      pagination={pagination}
      paginationType={1}
      rowKey={record => record.id}

    />
  )
}

List.propTypyes = {
  courseCategory:PropTypes.object.isRequired,
  onOrderItem:PropTypes.func.isRequired,
  onEditItem:PropTypes.func.isRequired,
}

export default List