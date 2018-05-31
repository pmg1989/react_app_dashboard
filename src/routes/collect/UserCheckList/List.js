import React, {PropTypes} from 'react'
import {Modal, Menu, Tag, Table, Input, Icon, Button,} from 'antd'
import { config } from '../../../utils'
import styles from './list.less'
import {DataTable, DropMenu} from '../../../components/'
import {UPDATE,FORBID,RECOVER} from '../../../constants/options'

const confirm = Modal.confirm

function List ({
  collectUserCheckList:{
    list,
    loading,
    pagination
  },
  updatePower,
  onEditItem,
  onforbid,
  onrecover,
  onShowModal,
}) {
  const handleMenuClick = (key, record) => {
    return {
      [FORBID]: handledisabled,
      [RECOVER]: handleabled,
    } [key](record)
  }

  const handledisabled = (record) =>{
    confirm({
      title: '确认要拒绝通过吗',
      onOk () {
        onforbid(record, 2)
      }
    })
  }

  const handleabled = (record) => {
    onrecover(record, 1)
  }

  const columns = [
    {
      title: '头像',
      dataIndex: 'image',
      key: 'image',
      className: styles.avatar,
      render: (image) => <img style={{ cursor: 'pointer' }} onClick={() => onShowModal({ src: image })} height={30} src={image || config.defaultImage} />
    }, {
      title: '昵称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={RECOVER}>审核通过</Menu.Item>}
            {updatePower && <Menu.Item key={FORBID}>审核拒绝</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    }
  ]
  return (
    <DataTable
      animate={false}
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
  collectUserCheckList: PropTypes.object.isRequired,
  onforbid: PropTypes.func.isRequired,
  onrecover: PropTypes.func.isRequired,
}

export default List
