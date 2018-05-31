import React from 'react'
import {Modal, InputNumber, Menu} from 'antd'
import {Link} from 'dva/router'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE, DELETE, SHELT, SHELTOFF} from '../../../constants/options'
import {defaultImage} from '../../../utils/config'

const confirm = Modal.confirm

function List ({
  courseTeacherTree: {
    loading,
    list
  },
  detailPower,
  updatePower,
  deletePower,
  sheltPower,
  sheltoffPower,
  onEditItem,
  onShelt,
  onSheltOff
}) {

  const handleDeleteItem = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk () {
        onDeleteItem(record.id)
      }
    })
  }

  const handleSheltOffItem =(record) =>{
    confirm({
      title:'你确定要下架吗',
      onOk () {
        onSheltOff(record)
      }
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [SHELT]:onShelt,
      [SHELTOFF]:handleSheltOffItem,
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const columns = [
    {
      title: '课时编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '课时标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '课时封面',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource) => {
        const full_url = resource && resource.full_url
        const thumb = full_url && full_url.indexOf('?') > -1 ? full_url.split('?')[0] : full_url
        return (
          <div>
            {thumb ? <img height={100} src={`${thumb}?vframe/jpg/offset/10|imageView2/1/w/300/h/300`} /> : <img height={100} src={defaultImage} />}
          </div>
        )
      }
    }, {
      title: '课时时长',
      dataIndex: 'duration',
      key: 'duration'
    }, {
      title: '是否免费试听',
      dataIndex: 'isFree',
      key: 'isFree',
      render: (isFree) => (
        <span>{isFree ? '是' : '否'}</span>
      )
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {record.status === '0' && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}
            {record.status === '10' && sheltoffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}
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
      pagination={false}
      rowKey={record => record.id}
    />
  )
}

export default List
