import React from 'react'
import {Menu} from 'antd'
import {UPDATE} from '../../../constants/options'
import {DataTable, DropMenu} from '../../../components/'
import styles from './List.less'

const List = ({
  couponSendList: {
    loading,
    list,
    pagination
  },
  updatePower,
  onUpdateItem
}) => {

  const handleMenuClick = (key, record) => {

    return {
      [UPDATE]: onUpdateItem,
    } [key](record)
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '批次号',
      dataIndex: 'batch',
      key: 'batch'
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render(phones, record) {
        return (
          <div>
            {!!phones && phones.split(',').map((phone, key) => (
              <p key={key}>{phone}</p>
            ))}
            {record.phone_is_more && <span>......</span>}
          </div>
        )
      }
    }, {
      title: '金额',
      dataIndex: 'money',
      key: 'money'
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num'
    }, {
      title: '发放时间',
      dataIndex: 'createtime',
      key: 'createtime'
    }, {
      title: '过期时间',
      dataIndex: 'expired',
      key: 'expired'
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    }, {
      title: '备注',
      key: 'operation',
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({key}) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>查看详情</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
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
