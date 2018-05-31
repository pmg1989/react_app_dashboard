import React, {PropTypes} from 'react'
import {Icon} from 'antd'
import styles from './List.less'
import {DataTable} from '../../../components/'

function List ({
  orderList: {
    loading,
    list,
    pagination
  }
}) {

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_id',
      key: 'order_id'
    }, {
      title: '商品名称',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '商品金额',
      dataIndex: 'sub_total',
      key: 'sub_total'
    }, {
      title: '优惠金额',
      dataIndex: 'discount',
      key: 'discount'
    }, {
      title: '实付金额',
      dataIndex: 'total',
      key: 'total'
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (value, record) => {
        const isUserCoupon = !!record.coupon.coupon_id || !value
        return (
          <span>
            {!!value && isUserCoupon ? `${value} + ` : value}
            {isUserCoupon ? 'coupon' : ''}
          </span>
        )
      }
    }, {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <span>{
        {
          1: '未支付',
          2: '已完成',
          3: '已取消',
          4: '已超时'
        }[value]
      }</span>
    }, {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      render: (text) => <span>{text == '1'
            ? <span><Icon type="apple-o" style={{ color: 'rgb(160, 160, 160)' }}/> IOS</span>
            : <span><Icon type="android" style={{ color: 'rgb(171, 205, 5)' }}/> Android</span>}</span>
    }, {
      title: '用户昵称',
      dataIndex: 'user_name',
      key: 'user_name'
    }, {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id'
    }, {
      title: '用户手机',
      dataIndex: 'user_phone',
      key: 'user_phone'
    }, {
      title: '支付时间',
      dataIndex: 'paid_at',
      key: 'paid_at'
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }
  ]

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={list}
      loading={loading}
      pagination={pagination}
      rowKey={record => record.order_id}
    />
  )
}

List.propTypes = {
  orderList: PropTypes.object.isRequired
}

export default List
