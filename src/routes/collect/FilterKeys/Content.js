import React from 'react'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const tailFormItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 6,
    }
}

const Content = ({
  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue
  },
  updatePower,
  collectFilterKeys,
  onOk,
 }) => {

  const { loading, content } = collectFilterKeys

  const handleSubmit = (e) => {
    e.preventDefault()

    validateFields((errors, values) => {
      if (!errors) {
        onOk(values)
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem label='过滤关键字' hasFeedback {...formItemLayout}>
        {getFieldDecorator('content', {
          initialValue: content,
          rules: [
            {
              required: true,
              message: '请输入过滤关键字'
            }
          ]
        })(<TextArea rows={40} placeholder="请输入过滤关键字" />)}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button style={{ width: '100%' }} type="primary" htmlType="submit" size="large" loading={loading} disabled={!updatePower}>确认修改</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(Content)
