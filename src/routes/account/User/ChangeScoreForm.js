import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, Modal, Icon } from 'antd'
import { validPhone } from '../../../utils/utilsValid'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const ModalForm = ({
  modal: { curItem, visible, loading },
  form: {
    getFieldDecorator,
    validateFields,
    resetFields
  },
  onOk,
  onCancel
}) => {
  function handleOk () {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        ...values,
        id: curItem.id
      }
      onOk(data)
    })
  }

  const modalFormOpts = {
    title: <div><Icon type="edit" /> 积分变换</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
    afterClose() {
      resetFields() //必须项，编辑后如未确认保存，关闭时必须重置数据
    }
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label='用户名：' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: curItem.name,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label='手机号：' hasFeedback {...formItemLayout}>
          {getFieldDecorator('mobile', {
            initialValue: curItem.mobile,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label='邮箱：' hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: curItem.email,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label='积分余额' hasFeedback {...formItemLayout}>
          {getFieldDecorator('balance', {
            initialValue: curItem.balance,
            rules: [
              {
                required: true,
                message: '积分余额不能为空'
              }
            ]
          })(<InputNumber />)}
        </FormItem>
        <FormItem label='变更状态' hasFeedback {...formItemLayout}>
          {getFieldDecorator('action', {
            initialValue: curItem.action,
            rules: [
              {
                required: true,
                message: '变更状态不能为空'
              }
            ]
          })(<Radio.Group>
              <Radio value='1'>增加</Radio>
              <Radio value='-1'>扣除</Radio>
            </Radio.Group>)}
        </FormItem>
        <FormItem label='处理分值' hasFeedback {...formItemLayout}>
          {getFieldDecorator('amount', {
            initialValue: curItem.amount,
            rules: [
              {
                required: true,
                message: '处理分值不能为空'
              }
            ]
          })(<InputNumber placeholder="请输入处理分值" />)}
        </FormItem>
        <FormItem label='处理理由' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: curItem.description,
            rules: [
              {
                required: true,
                message: '处理理由不能为空'
              }
            ]
          })(<Input type="textarea" placeholder="请输入处理理由" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
}

export default Form.create()(ModalForm)
