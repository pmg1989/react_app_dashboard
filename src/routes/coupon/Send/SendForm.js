import React, {PropTypes, Component} from 'react'
import {Form, Input, InputNumber, Button, Select, Spin, Radio, DatePicker, Row, Col, Tabs, Alert} from 'antd'
import debounce from 'lodash.debounce'
import moment from 'moment'
import styles from './SendForm.less'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 16
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 4,
  }
}

function disabledDate(current) {
  // can not select days before today and today
  return current && current.valueOf() < Date.now()
}

class SendForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false,
      type: 1 //逐个验证
    }
    this.queryPhoneList = debounce(this.queryPhoneList, 800)
  }

  queryPhoneList = (key) => {
    this.setState({ fetching: true })
    this.props.onQueryPhoneList({key})
  }

  handleChange = (value) => {
    this.setState({ fetching: false })
    this.props.onResetPhoneList()
  }

  handleTypeChange = (e) => {
    this.setState({type: e.target.value})
  }

  handleCheckSuccess = () => {
    this.props.form.validateFields(['batch'], (errors, values) => {
      if(!errors) {
        this.props.onCheckSuccess(values)
      }
    })
  }

  handleSubmit (e) {
    e.preventDefault()

    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const type = this.state.type
        const data = {
          money: values.money,
          num: values.num,
          batch: values.batch,
          expired: values.expired.format('YYYY-MM-DD'),
          remark: values.remark,
        }
        if(type === 1) {
          data.phone = values.phone1.map(item => item.key).join(',')
        } else {
          data.phone = values.phone2.split('\n').join(',')
        }
        this.props.onOk(data)
      }
    })
  }

  render() {

    const {
      couponSend: {loading, phoneList, phoneFailedList},
      form: {
        getFieldDecorator
      },
      addPower,
      updatePower
    } = this.props

    const { fetching, type } = this.state

    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="发放优惠券" key="1">
          <Form className={styles.CreditForm} onSubmit={::this.handleSubmit}>
            <FormItem label='发放类型' hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: type,
                rules: [
                  {
                    required: true,
                    message: '发放类型不能为空'
                  }
                ],
                onChange: this.handleTypeChange,
              })(<Radio.Group>
                  <Radio value={1}>逐一验证</Radio>
                  <Radio value={2}>批量发放</Radio>
                </Radio.Group>)}
            </FormItem>
            {type === 1 &&
              <FormItem label='手机号码' hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone1', {
                  rules: [
                    {
                      required: true,
                      message: '手机号码不能为空'
                    }
                  ]
                })(<Select
                    mode="multiple"
                    labelInValue
                    placeholder="请逐个输入手机号码进行验证"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onChange={this.handleChange}
                    onSearch={this.queryPhoneList}>
                    {phoneList.map(d => <Option key={d.mobile}>{d.mobile}</Option>)}
                  </Select>)}
              </FormItem>}
            {type === 2 &&
              <FormItem label='手机号码' hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone2', {
                  rules: [
                    {
                      required: true,
                      message: '手机号码不能为空'
                    }
                  ]
                })(<Input type="textarea" placeholder="请批量粘贴手机号(以换行符隔开)" rows={8} />)}
              </FormItem>}
              <FormItem label='发放批次号' hasFeedback {...formItemLayout}>
                {getFieldDecorator('batch', {
                  rules: [
                    {
                      required: true,
                      message: '发放批次号不能为空'
                    }
                  ]
                })(<Input placeholder="请输入发放的批次号" />)}
              </FormItem>
            <FormItem label='发放金额(RMB)' hasFeedback {...formItemLayout}>
              {getFieldDecorator('money', {
                rules: [
                  {
                    required: true,
                    message: '发放金额不能为空'
                  }
                ]
              })(<InputNumber min={1} placeholder="请输入发放的优惠券金额(人民币)" />)}
            </FormItem>
            <FormItem label='发放数量' hasFeedback {...formItemLayout}>
              {getFieldDecorator('num', {
                rules: [
                  {
                    required: true,
                    message: '发放数量不能为空'
                  }
                ]
              })(<InputNumber min={1} placeholder="请输入发放的优惠券数量" />)}
            </FormItem>
            <FormItem label='过期时间' hasFeedback {...formItemLayout}>
              {getFieldDecorator('expired', {
                rules: [
                  {
                    required: true,
                    message: '过期时间不能为空'
                  }
                ]
              })(<DatePicker disabledDate={disabledDate} />)}
            </FormItem>
            <FormItem label='备注' hasFeedback {...formItemLayout}>
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: true,
                    message: '请输入备注'
                  }
                ]
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" className={styles.button} loading={loading} disabled={!addPower}>确认发放</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="检查发放状态" key="2">
          <Form className={styles.CreditForm}>
            <FormItem {...formItemLayout} label="发放批次号" extra="输入批次号，可根据此批次号验证批量发放的手机号是否都发放成功">
              <Row gutter={20}>
                <Col span={18}>
                  {getFieldDecorator('batch', {
                    rules: [{
                      required: true,
                      message: '发放批次号不能为空'
                    }],
                  })(
                    <Input size="large" />
                  )}
                </Col>
                <Col span={6}>
                  <Button size="large" type="danger" onClick={this.handleCheckSuccess}>验证发放状态</Button>
                </Col>
              </Row>
            </FormItem>
            {!!phoneFailedList.length &&
              <FormItem {...formItemLayout} label="未发送信息">
                <Alert message={`手机号 ${phoneFailedList.join(',')} 发送失败`}
                  type="error"
                  showIcon
                />
              </FormItem>
            }
          </Form>
        </TabPane>
      </Tabs>

    )
  }
}

export default Form.create()(SendForm)
