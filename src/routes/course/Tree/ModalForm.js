import React, { PropTypes } from 'react'
import { Form, Input, Modal, Icon, InputNumber, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const format="YYYY-MM-DD HH:mm:ss"

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const ModalForm = ({
  modal: { loading, curItem, type, visible },
  form: {
    getFieldDecorator,
    validateFields,
    resetFields
  },
  onOk,
  onCancel
}) => {

  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        ...values,
        node_id: curItem.node_id,
        detail_id: curItem.base.detail_id
      }
      if(values.detail.start_time && values.detail.end_time) {
        data.detail.start_time = values.detail.start_time.format(format)
        data.detail.end_time = values.detail.end_time.format(format)
      }
      onOk(data)
    })
  }

  const modalFormOpts = {
    title: type === 'create' ? <div><Icon type="plus-circle-o" /> 新建课程</div> : <div><Icon type="edit" /> 修改课程</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
    afterClose() {
      resetFields() //必须项，编辑后如未确认保存，关闭时必须重置数据
    }
  }

  const { base={}, detail={}, node_id } = curItem

  const getDynamicInput = (key) => {
    switch (key) {
      case 'course_order':
      case 'lesson_qty':
      case 'progress_rate':
      case 'duration':
      case 'interest_level':
        return (
          <InputNumber min={1} />
        )
      case 'price':
      case 'old_price':
      case 'ad_price':
      case 'start':
      case 'end':
        return (
          <InputNumber min={0} step={0.1} />
        )
      case 'description':
        return (
          <Input type="textarea" rows={5} />
        )
      case 'start_time':
      case 'end_time':
        return(
          <DatePicker showTime format={format} />
        )
      default:
        return (
          <Input />
        )
    }
  }

  const DynamicFormItem = Object.keys(detail).map((key, index) => {
    if(!!detail[key]) {
      return (
        <FormItem label={key} hasFeedback {...formItemLayout} key={index}>
          {getFieldDecorator(`detail.${key}`, {
            initialValue: (key === 'start_time' || key === 'end_time') ? moment(detail[key]) : detail[key],
            rules: [
              {
                required: true,
                message: `${key}不能为空`
              }
            ]
          })(getDynamicInput(key))}
        </FormItem>
      )
    }
  })

  return (
    <Modal {...modalFormOpts}>
      <Form layout='horizontal'>
        {!!base.title &&
          <FormItem label='title' hasFeedback {...formItemLayout}>
            {getFieldDecorator('base.title', {
              initialValue: base.title,
              rules: [
                {
                  required: true,
                  message: 'title不能为空'
                }
              ]
            })(<Input />)}
          </FormItem>
        }
        {!!base.qiniu_id &&
          <FormItem label='qiniu_id' hasFeedback {...formItemLayout}>
            {getFieldDecorator('base.qiniu_id', {
              initialValue: base.qiniu_id,
              rules: [
                {
                  required: true,
                  message: 'qiniu_id不能为空'
                }
              ]
            })(<Input />)}
          </FormItem>
        }
        {!!base.quota &&
          <FormItem label='quota' hasFeedback {...formItemLayout}>
            {getFieldDecorator('base.quota', {
              initialValue: base.quota,
              rules: [
                {
                  required: true,
                  message: 'quota不能为空'
                }
              ]
            })(<InputNumber min={1} />)}
          </FormItem>
        }
        {DynamicFormItem}
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
}

export default Form.create()(ModalForm)
