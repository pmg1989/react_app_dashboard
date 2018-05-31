import React, { PropTypes, Component } from 'react'
import { Form, Input, Modal, Icon, InputNumber, Radio, Checkbox, DatePicker, Select, Spin } from 'antd'
import moment from 'moment'
import debounce from 'lodash.debounce'
import {UploadFile} from '../../../components/'
import styles from './ModalForm.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const format="YYYY-MM-DD HH:mm:ss"

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 15
  }
}

const renderExtra = (page) => {
  return {
    'home': '首页banner 建议尺寸为 750 * 320（比例 75：32)',
    'main': '首页广告位 建议尺寸为 750*140（比例 75：14)',
    'startup': '启动页 建议尺寸为 750 * 1334',
    'festival': '练习页banner 建议尺寸为 750 * 200（比例 15：4)'
  }[page]
}

const getAppUrl = (url, type) => {
  if(!url) {
    return ''
  }
  if(url.indexOf('?') > -1) {
    if(type === 1) {
      return url.split('=')[type]
    }
    return `${url.split('=')[type]}=`
  }
  return type === 1 ? '' : url
}

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: props.page || 'home',
      curType: props.modal.curItem.type,
      fetching: false
    }
    this.queryCourse = debounce(this.queryCourse, 800)
  }

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  handleOk () {
    const { modal: { curItem }, form: { validateFields, getFieldValue, setFields }, onOk } = this.props

    function checkRequired() {
      const id = getFieldValue('data_url')
      const appprefix = getFieldValue('appprefix')
      const needID = ['nbapp://mobile/wallet', 'nbapp://mobile/coupon', 'nbapp://mobile/my_course'].every(cur => cur !== appprefix)

      if(needID && !id) {
        setFields({
          data_url: {
            value: '',
            errors: [new Error('请输入相关ID')]
          }
        })
        return false
      }

      if(!needID && !!id) {
        setFields({
          data_url: {
            value: id,
            errors: [new Error('钱包页/优惠券页/我的课程页不需要ID')]
          }
        })
        return false
      }

      return true
    }

    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if(values.type === 'inside' && !checkRequired()) {
        return
      }

      const data = values

      if(!!curItem.id) {
        data.id = curItem.id
      }
      const rangeValue = values['expired_at']
      if(!!rangeValue.length) {
        data.started_at = rangeValue[0].format(format)
        data.expired_at = rangeValue[1].format(format)
      }
      data.os = data.os.join(',')
      if(data.type === 'course_list') {
        if(!!curItem.id) {
          data.data_tag = curItem.data_tag
        }
        data.course_ids = data.course_ids.map(item => item.key).join(',')
      }
      if(data.type === 'inside') {
        data.data_url = `${data.appprefix}${data.data_url}`
        delete data.appprefix
      }
      onOk(data)
    })
  }

  checkRequired(rule, value, callback) {
    const id = this.props.form.getFieldValue('data_url')
    const appprefix = this.props.form.getFieldValue('appprefix')
    const needID = ['nbapp://mobile/wallet', 'nbapp://mobile/coupon', 'nbapp://mobile/my_course'].every(cur => cur !== appprefix)

    if (needID && !id) {
      callback('请输入相关ID')
    } else if (!needID && !!id) {
      callback('钱包页/优惠券页/我的课程页不需要ID')
    } else {
      callback()
    }

  }

  handleTypeChange = (e) => {
    this.setState({ curType: e.target.value })
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }

  queryCourse = (key) => {
    this.setState({ fetching: true })
    this.props.onQueryCourse({key})
  }

  handleChange = (value) => {
    this.setState({ fetching: false })
    this.props.onResetCourse()
  }

  handleUpload = (file) => {
    this.props.form.setFieldsValue({
      image: file ? file.url : ''
    })
  }

  render() {
    const {
      modal: { curItem, type, loading, visible },
      form: {
        getFieldDecorator,
        resetFields
      },
      onCancel,
      onQueryCourse
    } = this.props
    const { curType, fetching, page } = this.state

    const modalFormOpts = {
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 新建轮播图</div> : <div><Icon type="edit" /> 修改轮播图</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onOk: ::this.handleOk,
      onCancel,
      width: 800,
      afterClose() {
        resetFields() //必须项，编辑后如未确认保存，关闭时必须重置数据
      }
    }

    const selectBefore = getFieldDecorator('appprefix', {
      initialValue: getAppUrl(curItem.data_url, 0)
      })(
      <Select style={{ width: 300 }}>
        <Option value="nbapp://mobile/base_course_detail?id=">综合课程详情页</Option>
        <Option value="nbapp://mobile/course_detail?id=">名师／明星课程详情页</Option>
        <Option value="nbapp://mobile/user_detail?id=">老师／用户主页</Option>
        <Option value="nbapp://mobile/topic_detail?id=">专题详情页</Option>
        <Option value="nbapp://mobile/competition_detail?id=">大赛详情页</Option>
        <Option value="nbapp://mobile/competition_work_detail?id=">大赛作品播放页</Option>
        <Option value="nbapp://mobile/practice_work_detail?id=">练习作品播放页</Option>
        <Option value="nbapp://mobile/bbs_detail?id=">用户帖子详情页</Option>
        <Option value="nbapp://mobile/wallet">钱包页</Option>
        <Option value="nbapp://mobile/coupon">优惠券页</Option>
        <Option value="nbapp://mobile/my_course">我的课程页</Option>
      </Select>
    )

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem label='投放位置' hasFeedback {...formItemLayout}>
            {getFieldDecorator('page', {
              initialValue: curItem.page || this.props.page || 'home',
              rules: [
                {
                  required: true,
                  message: '页面位置不能为空'
                }
              ],
              onChange: this.handlePageChange,
            })(
              <Select disabled={!!curItem.id}>
                <Option value="home">首页</Option>
                <Option value="main">首页广告位</Option>
                <Option value="startup">启动页</Option>
                <Option value="festival">练习页</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='图片路径' hasFeedback {...formItemLayout} extra={renderExtra(page)}>
            {getFieldDecorator('image', {
              initialValue: curItem.image,
              rules: [
                {
                  required: true,
                  message: '图片路径不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <UploadFile fileList={curItem.image} onUpload={this.handleUpload} path={`banner-${page}`}></UploadFile>
          </FormItem>
          <FormItem label='投放系统' hasFeedback {...formItemLayout}>
            {getFieldDecorator('os', {
              initialValue: curItem.os && curItem.os.split(','),
              rules: [
                {
                  required: true,
                  message: '投放系统不能为空'
                }
              ]
            })(<CheckboxGroup options={['ios', 'android']} />)}
          </FormItem>
          <FormItem label='排序位置' hasFeedback {...formItemLayout}>
            {getFieldDecorator('position', {
              initialValue: curItem.position,
              rules: [
                {
                  required: true,
                  message: '排序位置不能为空'
                }
              ]
            })(<InputNumber min={1}/>)}
          </FormItem>
          <FormItem label='投放状态' hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: curItem.status,
              rules: [
                {
                  required: true,
                  message: '投放状态不能为空'
                }
              ]
            })(<Radio.Group>
                <Radio value='1'>正常</Radio>
                <Radio value='0'>下架</Radio>
              </Radio.Group>)}
          </FormItem>
          <FormItem label="投放时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expired_at', {
              initialValue: curItem.started_at && curItem.expired_at ? [moment(curItem.started_at), moment(curItem.expired_at)] : '',
              rules: [
                {
                  required: true,
                  message: '投放时间不能为空'
                }
              ]
            })(<RangePicker showTime format={format} />)}
          </FormItem>
          {page === 'startup' &&
            <FormItem label='显示秒数' hasFeedback {...formItemLayout}>
              {getFieldDecorator('times', {
                initialValue: curItem.times,
                rules: [
                  {
                    required: true,
                    message: '显示秒数不能为空'
                  }
                ]
              })(<InputNumber min={1}/>)}
            </FormItem>}
          <FormItem label='外部分享' hasFeedback {...formItemLayout}>
            {getFieldDecorator('isShare', {
              initialValue: curItem.isShare || '0',
              rules: [
                {
                  required: true,
                  message: '外部分享状态不能为空'
                }
              ]
            })(<Radio.Group>
                <Radio value='1'>支持</Radio>
                <Radio value='0'>不支持</Radio>
              </Radio.Group>)}
          </FormItem>
          <FormItem label='投放类型' hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: curItem.type,
              rules: [
                {
                  required: true,
                  message: '投放类型不能为空'
                }
              ],
              onChange: this.handleTypeChange,
            })(<Radio.Group>
                <Radio value='no_jump'>仅展示</Radio>
                <Radio value='url'>页面跳转</Radio>
                {page !== 'startup' && <Radio value='course_list'>课程列表</Radio>}
                {page !== 'startup' && <Radio value='inside'>APP内跳转</Radio>}
              </Radio.Group>)}
          </FormItem>
          {['url'].indexOf(curType) > -1 &&
            <FormItem label='https://页面路径' hasFeedback {...formItemLayout}>
              {getFieldDecorator('data_url', {
                initialValue: curItem.data_url,
                rules: [
                  {
                    required: true,
                    message: '请输入https://跳转页面路径'
                  }
                ]
              })(<Input placeholder="请输入https://跳转页面路径" />)}
            </FormItem>}
          {curType === 'course_list' &&
            <FormItem label='课程列表' hasFeedback {...formItemLayout}>
              {getFieldDecorator('course_ids', {
                initialValue: curItem.course_ids,
                rules: [
                  {
                    required: true,
                    message: '课程列表不能为空'
                  }
                ]
              })(<Select
                  mode="multiple"
                  labelInValue
                  placeholder="请输入关键字选择课程"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onChange={this.handleChange}
                  onSearch={this.queryCourse}>
                  {curItem.courseList && curItem.courseList.map(d => <Option key={d.tag_id}>{d.title}</Option>)}
                </Select>)}
            </FormItem>
          }
          {['inside'].indexOf(curType) > -1 &&
            <FormItem label='app页面路径' hasFeedback {...formItemLayout} className={styles.addonBox}>
              {getFieldDecorator('data_url', {
                initialValue: getAppUrl(curItem.data_url, 1),
                rules: [
                  {
                    validator: ::this.checkRequired,
                  }
                ]
              })(<Input addonBefore={selectBefore} placeholder="请输入相关ID" />)}
            </FormItem>}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
