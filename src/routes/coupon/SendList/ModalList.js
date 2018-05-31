import React, { PropTypes, Component } from 'react'
import { Modal, Table, Icon,Button, Tag } from 'antd'

const ModalList = ({ modal: { curItem: { list = [] }, type, visible, loading }, onCancel }) => {

  const modalFormOpts = {
    title: <div><Icon type="info-circle-o" />发放详情</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onCancel,
    width: 900,
    footer: null
  }

  const columns = [
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '发放数量',
      dataIndex: 'send_num',
      key: 'send_num'
    }, {
      title: '已使用数量',
      dataIndex: 'has_used',
      key: 'has_used'
    }, {
      title: '发放状态',
      dataIndex: 'status',
      key: 'status',
      render(status) {
        return <span>{status ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>}</span>
      }
    }
  ]

  return (
    <Modal {...modalFormOpts}>
      <Table
        size="small"
        bordered={true}
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: list.length,
        }}
        animate={false}
        scroll={{x: 800}}
        rowKey={record => record.phone}
      />
    </Modal>
  )
}

export default ModalList
