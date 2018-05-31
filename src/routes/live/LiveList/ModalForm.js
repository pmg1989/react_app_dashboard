import React, {PropTypes, Component} from 'react'
import {Form, Input, Modal, Icon, Select, InputNumber, Tabs, DatePicker, Card} from 'antd'
import moment from 'moment'
import {validPhone} from '../../../utils/utilsValid'
import {UploadFile} from '../../../components/'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const RangePicker = DatePicker.RangePicker

const format="YYYY-MM-DD HH:mm:ss"

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

class ModalForm extends Component {

  state = {
    curTab: "1"
  }

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  handleChangeTabs = (curTab) => {
    this.setState({curTab: curTab})
  }

  handleOk = () => {
    const { modal: { curItem }, form: { validateFields }, onOk } = this.props

    validateFields((errors, values) => {
      if (errors) {
        if(errors.lesson) {
          const keyLength = Object.keys(errors).length
          if(keyLength > 1) {
            this.setState({curTab: '1'})
          } else {
            this.setState({curTab: '2'})
          }
        } else {
          this.setState({curTab: '1'})
        }
        return
      }
      const data = {
        ...values,
      }
      data.base.id = curItem.base.id
      data.base.detail_id = curItem.base.detail_id

      data.lesson && data.lesson.map((cur, i) => {
        const rangeValue = cur['end_time']
        if(!!rangeValue.length) {
          cur.start_time = rangeValue[0].format(format)
          cur.end_time = rangeValue[1].format(format)
          cur.id = curItem.lesson[i].id
          cur.detail_id = curItem.lesson[i].detail_id
        }
        return cur
      })
      onOk(data)
    })
  }

  handleUpload = () => {

  }

  render() {

    const {
      modal: { loading, curItem, type, visible },
      form: {
        getFieldDecorator,
        resetFields
      },
      onCancel
    } = this.props

    const { base={}, lesson=[] } = curItem

    const modalFormOpts = {
      title: {
        create: <div><Icon type="plus-circle-o" /> 新建直播信息</div>,
        update: <div><Icon type="edit" /> 修改直播信息</div>,
        detail: <div><Icon type="info-circle-o" /> 查看直播信息</div>
      }[type],
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onOk: this.handleOk,
      onCancel,
      afterClose: () => {
        resetFields() //必须项，编辑后如未确认保存，关闭时必须重置数据
        this.setState({curTab: '1'})
      }
    }
    if (type === 'detail') {
      modalFormOpts.footer = null
    }

    const extendsList = lesson.map((item, key) => (
      <Card key={key} bodyStyle={{padding: '10px 0 0 0'}} style={{marginBottom: '10px'}}>
        <FormItem label='课程标题' hasFeedback {...formItemLayout}>
          {getFieldDecorator(`lesson[${key}].title`, {
            initialValue: item.title,
            rules: [
              {
                required: true,
                message: '课程标题不能为空'
              }
            ]
          })(<Input disabled={type === 'detail'}/>)}
        </FormItem>
        <FormItem label="开课时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator(`lesson[${key}].end_time`, {
            initialValue: item.start_time && item.end_time ? [moment(item.start_time), moment(item.end_time)] : '',
            rules: [
              {
                required: true,
                message: '开课时间不能为空'
              }
            ]
          })(<RangePicker showTime format={format} disabled={type === 'detail'}/>)}
        </FormItem>
      </Card>
    ))

    const Upload = () => (
      <UploadFile disabled fileList={base.syllabus} onUpload={::this.handleUpload}></UploadFile>
    )

    return (
      <Modal {...modalFormOpts}>
        <Form layout='horizontal'>
          <Tabs activeKey={this.state.curTab} size="small" onChange={this.handleChangeTabs}>
            <TabPane tab="基本信息" key="1">
              <FormItem label='系列课程名称' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.title', {
                  initialValue: base.title,
                  rules: [
                    {
                      required: true,
                      message: '系列课程名称不能为空'
                    }
                  ]
                })(<Input disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='课程价格' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.price', {
                  initialValue: base.price,
                  rules: [
                    {
                      required: true,
                      message: '课程价格不能为空'
                    }
                  ]
                })(<InputNumber min={0} step={1} disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='课程原价' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.old_price', {
                  initialValue: base.old_price,
                  rules: [
                    {
                      required: true,
                      message: '课程原价不能为空'
                    }
                  ]
                })(<InputNumber min={0} step={1} disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='包含课时' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.lesson_qty', {
                  initialValue: base.lesson_qty,
                  rules: [
                    {
                      required: true,
                      message: '包含课时不能为空'
                    }
                  ]
                })(<InputNumber min={1} disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='人数限制' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.quota', {
                  initialValue: base.quota,
                  rules: [
                    {
                      required: true,
                      message: '人数限制不能为空'
                    }
                  ]
                })(<InputNumber min={1} disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='七牛云ID' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.qiniu_id', {
                  initialValue: base.qiniu_id,
                  rules: [
                    {
                      required: true,
                      message: '七牛云ID不能为空'
                    }
                  ]
                })(<Input disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='老师姓名' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.teacher_name', {
                  initialValue: base.teacher_name
                })(<Input disabled/>)}
              </FormItem>
              <FormItem label='老师介绍' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.teacher_description', {
                  initialValue: base.teacher_description
                })(<Input type="textarea" rows={5} disabled/>)}
              </FormItem>
              <FormItem label='课程描述' hasFeedback {...formItemLayout}>
                {getFieldDecorator('base.description', {
                  initialValue: base.description,
                  rules: [
                    {
                      required: true,
                      message: '课程描述不能为空'
                    }
                  ]
                })(<Input type="textarea" rows={5} disabled={type === 'detail'}/>)}
              </FormItem>
              <FormItem label='课程大纲' hasFeedback {...formItemLayout}>
                <Upload />
              </FormItem>
            </TabPane>
            <TabPane tab="课时信息" key="2">
              {extendsList}
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
