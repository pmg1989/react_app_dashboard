import React, {PropTypes} from 'react'
import {Modal, Menu, Tag} from 'antd'
import styles from './List.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE, STATUS, DELETE, CHANGESCORE, SHELT, SHELTOFF} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
  festivalCompetition: {
    list,
    loading,
    pagination
  },
  updatePower,
  sheltPower,
  sheltoffPower,
  deletePower,
  changeScorePower,
  onDeleteItem,
  onEditItem,
  onSheltItem,
  onStatusItem,
  onChangeScore
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
    record.status = 1
    onSheltItem(record)
  }

  const handleSheltOffItem =(record) =>{
    confirm({
      title:'你确定要下架吗',
      onOk () {
        record.status = 2
        onSheltItem(record)
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
      title: '大赛编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '大赛名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <span>{record.tag} - {text}</span>
    }, {
      title: '大赛封面图',
      dataIndex: 'cover_file_detail',
      key: 'cover_file_detail',
      className: styles.avatar,
      render: (cover_file_detail) => <img height={100} src={cover_file_detail.full_url} />
    }, {
      title: '大赛预告时间',
      dataIndex: 'date',
      key: 'date',
      render: (value, record) => (
        <div>
          <p>{new Date(+record.notice_date_start * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
          <p>~</p>
          <p>{new Date(+record.notice_date_end * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
        </div>
      )
    }, {
      title: '作品可上传时间',
      dataIndex: 'upload_date',
      key: 'upload_date',
      render: (value, record) => (
        <div>
          <p>{new Date(+record.upload_date_start * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
          <p>~</p>
          <p>{new Date(+record.upload_date_end * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
        </div>
      )
    }, {
      title: '可投票时间',
      dataIndex: 'vote_date',
      key: 'vote_date',
      render: (value, record) => (
        <div>
          <p>{new Date(+record.vote_date_start * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
          <p>~</p>
          <p>{new Date(+record.vote_date_end * 1000).format("yyyy-MM-dd HH:mm:ss")}</p>
        </div>
      )
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {

        const dic = {1: '已上架', 2: '已下架', 3: '草稿'}
        const dicColor = {1: '#2db7f5', 2: '#87d068', 3: '#f50'}
        const dicVote = {1: '未开始', 2: '进行中', 3: '已结束'}

        return (
          <div>
            <Tag color={dicColor[record.vote_status]}>{dicVote[record.vote_status]}</Tag><br /><br /><Tag color={dicColor[status]}>{dic[status]}</Tag>
          </div>
        )
      }
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {record.status === '1' && sheltoffPower && <Menu.Item key={SHELTOFF}>下架</Menu.Item>}
            {(record.status === '2' || record.status === '3')  && sheltPower && <Menu.Item key={SHELT}>上架</Menu.Item>}
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
  festivalCompetition: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired
}

export default List
