import React from 'react'
import { Form, Input, Button, Radio } from 'antd'
import styles from './Content.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
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
  collectUpgrade,
  onOk,
 }) => {

  const { ios, android, loading } = collectUpgrade

  const handleSubmit = (e) => {
    e.preventDefault()

    validateFields((errors, values) => {
      if (!errors) {
        onOk(values)
      }
    })
  }

  return (
    <Form className={styles.container} onSubmit={handleSubmit}>
      <FormItem label='IOS最新版本' hasFeedback {...formItemLayout}>
        {getFieldDecorator('ios.version', {
          initialValue: ios.version,
          rules: [
            {
              required: true,
              message: '请输入IOS最新版本'
            }
          ]
        })(<Input placeholder="请输入IOS最新版本" />)}
      </FormItem>
      <FormItem label='IOS更新类型' hasFeedback {...formItemLayout}>
        {getFieldDecorator('ios.updateType', {
          initialValue: ios.updateType,
          rules: [
            {
              required: true,
              message: '请选择更新类型'
            }
          ]
        })(<RadioGroup>
            <Radio value={0}>不更新</Radio>
            <Radio value={1}>选择更新</Radio>
            <Radio value={2}>强制更新</Radio>
          </RadioGroup>)}
      </FormItem>
      <FormItem label='IOS更新内容' hasFeedback {...formItemLayout}>
        {getFieldDecorator('ios.content', {
          initialValue: ios.content,
          rules: [
            {
              required: true,
              message: '请输入IOS更新内容'
            }
          ]
        })(<TextArea rows={5} placeholder="请输入IOS更新内容" />)}
      </FormItem>
      <FormItem label='Android最新版本' hasFeedback {...formItemLayout}>
        {getFieldDecorator('android.version', {
          initialValue: android.version,
          rules: [
            {
              required: true,
              message: '请输入Android最新版本'
            }
          ]
        })(<Input placeholder="请输入Android最新版本" />)}
      </FormItem>
      <FormItem label='Android更新类型' hasFeedback {...formItemLayout}>
        {getFieldDecorator('android.updateType', {
          initialValue: android.updateType,
          rules: [
            {
              required: true,
              message: '请选择更新类型'
            }
          ]
        })(<RadioGroup>
            <Radio value={0}>不更新</Radio>
            <Radio value={1}>选择更新</Radio>
            <Radio value={2}>强制更新</Radio>
          </RadioGroup>)}
      </FormItem>
      <FormItem label='Android更新内容' hasFeedback {...formItemLayout}>
        {getFieldDecorator('android.content', {
          initialValue: android.content,
          rules: [
            {
              required: true,
              message: '请输入Android更新内容'
            }
          ]
        })(<TextArea rows={5} placeholder="请输入Android更新内容" />)}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" className={styles.button} loading={loading} disabled={!updatePower}>确认修改</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(Content)
