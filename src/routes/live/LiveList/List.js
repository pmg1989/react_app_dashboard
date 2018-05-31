import React, {PropTypes} from 'react'
import {Modal, Menu} from 'antd'
import classnames from 'classnames'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {DETAIL, UPDATE, DELETE} from '../../../constants/options'

const confirm = Modal.confirm

function List({
  liveList: {
    loading,
    list,
    pagination
  },
  updatePower,
  detailPower,
  deletePower,
  onDeleteItem,
  onEditItem,
  onDetailItem,
  onStatusItem
}) {

  const handleDeleteItem = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk() {
        onDeleteItem(record.id)
      }
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      [DETAIL]: onDetailItem,
      [UPDATE]: onEditItem,
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const columns = [
    {
      title: '直播编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '系列课程名称',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '课程价格',
      dataIndex: 'price',
      key: 'price'
    }, {
      title: '课程原价',
      dataIndex: 'old_price',
      key: 'old_price'
    }, {
      title: '包含课时',
      dataIndex: 'lesson_qty',
      key: 'lesson_qty'
    }, {
      title: '老师姓名',
      dataIndex: 'teacher_name',
      key: 'teacher_name'
    }, {
      title: '课程状态',
      dataIndex: 'live_status',
      key: 'live_status',
      render: (value) => {
        return {
          1: '待开播',
          2: '直播中',
          3: '已结束'
        }[value]
      }
    }, {
      title: '操作',
      key: 'operation',
      // width: 100,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {detailPower && <Menu.Item key={DETAIL}>详情</Menu.Item>}
            {/*{updatePower && record.live_status === 1 && <Menu.Item key={UPDATE}>编辑</Menu.Item>}*/}
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
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
  liveList: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List
