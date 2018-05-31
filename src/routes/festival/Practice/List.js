import React, {PropTypes} from 'react'
import {Modal, Menu, Tag, InputNumber} from 'antd'
import { config } from '../../../utils'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE, STATUS, DELETE, CHANGESCORE, SHELT, SHELTOFF} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
  festivalPractice: {
    list,
    loading,
    pagination
  },
  updatePower,
  deletePower,
  sheltPower,
  sheltoffPower,
  onDeleteItem,
  onEditItem,
  onStatusItem,
  onSheltItem,
  onOrderSet,
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
    onSheltItem({ id: record.id, status: 1 })
  }

  const handleSheltOffItem =(record) =>{
    confirm({
      title:'你确定要下架吗',
      onOk () {
        onSheltItem({ id: record.id, status: 0 })
      }
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [SHELT]:handleSheltItem,
      [SHELTOFF]:handleSheltOffItem,
      [DELETE]: handleDeleteItem,
    } [key](record)
  }

  const curTime = parseInt(new Date().getTime() / 1000)

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '曲目名称',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '曲目封面图',
      dataIndex: 'cover',
      key: 'cover',
      render: (cover) => (
        <img height={100} src={cover && cover.full_url || config.defaultImage} />
      )
    }, {
      title: '原唱或作者',
      dataIndex: 'actor',
      key: 'actor'
    }, {
      title: '上传时间',
      dataIndex: 'ctime',
      key: 'ctime',
      render: (value) => (
        <span>{new Date(value * 1000).format("yyyy-MM-dd HH:mm:ss")}</span>
      )
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const dic = {1: '已上架', 2: '草稿中', 0: '已下架'}
        const dicColor = {1: '#2db7f5', 2: '#87d068', 0: '#f50'}
        return (
          <span><Tag color={{0: 'red', 1: 'green'}[record.type]}>{ {0: '练习曲目', 1: '比赛曲目'}[record.type]}</Tag><br /><br /><Tag color={dicColor[status]}>{dic[status]}</Tag></span>
        )
      }
    }, {
      title: '排序',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => (
        <InputNumber defaultValue={text} min={0} onChange={(value) => onOrderSet({ orderNo: value, id: record.id })} />
      )
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {record.status !== 1 && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}
            {record.status !== 0 && sheltoffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}
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
      paginationType={1}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  festivalPractice: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List
