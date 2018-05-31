import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Modal, Icon, Select, DatePicker, Button } from 'antd'
import moment from 'moment'
import { UploadFile } from '../../../components/'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const format="YYYY-MM-DD HH:mm:ss"

const renderDatePickerDate = (val) => {
  return moment(new Date(+val * 1000).format("yyyy-MM-dd HH:mm:ss"))
}

const PriceSelect = (
  <Select>
    <Option value="">--请选择--</Option>
    <Option value="1">10牛币</Option>
    <Option value="6">60牛币</Option>
    <Option value="12">120牛币</Option>
    <Option value="18">180牛币</Option>
    <Option value="24">240牛币</Option>
    <Option value="58">580牛币</Option>
    <Option value="88">880牛币</Option>
    <Option value="128">1280牛币</Option>
    <Option value="188">1880牛币</Option>
    <Option value="228">2280牛币</Option>
    <Option value="298">2980牛币</Option>
    <Option value="398">3980牛币</Option>
  </Select>
)

const ModalForm = ({
  modal: { curItem, type, visible, loading },
  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue
  },
  onOk,
  onCancel,
}) => {

  const modalFormOpts = {
    title: type === 'create' ? <div><Icon type="plus-circle-o" /> 新建名师课程</div> : <div><Icon type="edit" /> 修改名师课程</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    onCancel,
    width: 800,
    footer: [
      <Button key="back" size="large" onClick={onCancel}>取消</Button>,
      <Button key="draft" size="large" loading={loading} onClick={() => handleOk(0)} type="primary">保存至草稿</Button>,
      <Button key="submit" size="large" loading={loading} onClick={() => handleOk(10)} type="danger">保存并上架</Button>
    ]
  }

  function handleOk (status) {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const rangeValue = values['promotion_start']

      if(!!rangeValue.length) {
        values.promotion_start = parseInt(rangeValue[0].valueOf() / 1000)
        values.promotion_end = parseInt(rangeValue[1].valueOf() / 1000)
      }

      const data = {
        ...values,
        status,
        root_id: curItem.root,
      }
      onOk(data)
    })
  }

  if(!curItem.interests) {
    curItem.interests = []
  }
  if(!curItem.levels) {
    curItem.levels = []
  }
  if(!curItem.teachers) {
    curItem.teachers = []
  }

  const uploadCoverProps = {
    path: 'course',
    accept: 'image',
    fileList: curItem.new_cover_image,
    onUpload: (file) => {
      setFieldsValue({
        new_cover_image_id: file && file.id
      })
    }
  }

  const uploadDescriptionProps = {
    multiple: true,
    path: 'course',
    accept: 'image',
    fileList: curItem.descriptionImages || [],
    onUpload: (files) => {
      const ids = files.map(file => file.id).join(',')
      setFieldsValue({
        descriptionImages: ids
      })
    }
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label='课程名称' hasFeedback {...formItemLayout}>
          {getFieldDecorator('course_title', {
            initialValue: curItem.title,
            rules: [
              {
                required: true,
                message: '请输入课程名称'
              }
            ]
          })(<Input placeholder="请输入课程名称"/>)}
        </FormItem>
        <FormItem label='封面图' hasFeedback {...formItemLayout} extra="图片：建议尺寸：750:492">
          {getFieldDecorator('new_cover_image_id', {
            initialValue: curItem.new_cover_image_id,
            rules: [
              {
                required: true,
                message: '封面图不能为空'
              }
            ]
          })(<Input style={{display: 'none'}}/>)}
          <UploadFile {...uploadCoverProps}></UploadFile>
        </FormItem>
        <FormItem label="课程类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('course_type', {
            initialValue: curItem.type || 'famous_course',
            rules: [
              {
                required: true,
                message: '请选择课程类型'
              }
            ]})
            (<Select>
              <Option value="">--请选择--</Option>
              <Option value="course">明星课程</Option>
              <Option value="famous_course">名师课程</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label='老师账号' hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_id', {
            initialValue: curItem.teacher && curItem.teacher.id || '',
            rules: [
              {
                required: true,
                message: '请选择老师账号'
              }
            ]
          })(<Select>
            <Option value="">--请选择--</Option>
            {curItem.teachers.map((item, key) => (
              <Option key={key} value={`${item.id}`}>{item.name}</Option>
            ))}
          </Select>)}
        </FormItem>
        <FormItem label="课程分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('interest_id', {
            initialValue: curItem.interest && curItem.interest.id || '',
            rules: [
              {
                required: true,
                message: '请选择课程分类'
              }
            ]})
            (<Select>
              <Option value="">--请选择--</Option>
              {!!curItem.interests && curItem.interests.map((item, key) => (
                <Option key={key} value={`${item.id}`}>{item.name_zh}</Option>
              ))}
            </Select>)
          }
        </FormItem>
        <FormItem label="课程难度" hasFeedback {...formItemLayout}>
          {getFieldDecorator('interest_level', {
            initialValue: curItem.level && curItem.level.id.toString() || '',
            rules: [
              {
                required: true,
                message: '请选择课程难度'
              }
            ]})
            (<Select>
              <Option value="">--请选择--</Option>
              {!!curItem.levels && curItem.levels.map((item, key) => (
                <Option key={key} value={`${item.id}`}>{item.title}</Option>
              ))}
            </Select>)
          }
        </FormItem>
        {/*<FormItem label='当前课时数' hasFeedback {...formItemLayout}>
          {getFieldDecorator('lesson_qty', {
            initialValue: curItem.lessons && curItem.lessons.length,
            rules: [
              {
                required: true,
                message: '请输入课时数'
              }
            ]
          })(<InputNumber display min={1} placeholder="请输入课时数" />)}
        </FormItem>*/}
        <FormItem label='课时总数' hasFeedback {...formItemLayout}>
          {getFieldDecorator('lesson_total_qty', {
            initialValue: curItem.lesson_total_qty,
            rules: [
              {
                required: true,
                message: '请输入课时总数'
              }
            ]
          })(<InputNumber min={1} placeholder="请输入课时总数" />)}
        </FormItem>
        {/*<FormItem label='课时总时长' hasFeedback {...formItemLayout}>
          {getFieldDecorator('duration', {
            initialValue: curItem.duration,
            rules: [
              {
                required: true,
                message: '请输入课时总时长'
              }
            ]
          })(<InputNumber min={1} placeholder="请输入课时总时长(秒数)" />)}
        </FormItem>*/}
        <FormItem label="课程售价" hasFeedback {...formItemLayout}>
          {getFieldDecorator('price', {
            initialValue: curItem.price && curItem.price.toString() || '',
            rules: [
              {
                required: true,
                message: '请输入课程售价'
              }
            ]
            })
            (PriceSelect)
          }
        </FormItem>
        <FormItem label="课程原价" hasFeedback {...formItemLayout} extra="可不填写，课程促销期间，需要维护课程原价，然后修改课程售价为促销价">
          {getFieldDecorator('old_price', {
            initialValue: curItem.oldPrice && curItem.oldPrice.toString() || ''
            })
            (PriceSelect)
          }
        </FormItem>
        <FormItem label="促销时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('promotion_start', {
            initialValue: curItem.promotion_start && curItem.promotion_end ? [renderDatePickerDate(curItem.promotion_start), renderDatePickerDate(curItem.promotion_end)] : ''
          })(<RangePicker showTime format={format} />)}
        </FormItem>
        {/*<FormItem label='苹果商店课程销售ID' hasFeedback {...formItemLayout}>
          {getFieldDecorator('iap_identifier', {
            initialValue: curItem.iap_identifier,
            rules: [
              {
                required: true,
                message: '请输入苹果商店课程销售ID'
              }
            ]
          })(<Input placeholder="请输入苹果商店课程销售ID" />)}
        </FormItem>*/}
        <FormItem label="是否免费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('is_free', {
            initialValue: curItem.is_free || '0',
            })
            (<Select>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>)
          }
        </FormItem>
        <FormItem label='虚拟订阅数' hasFeedback {...formItemLayout}>
          {getFieldDecorator('fake_subscribe', {
            initialValue: curItem.fake_subscribe || 0,
            rules: [
              {
                required: true,
                message: '请输入虚拟订阅数'
              }
            ]
          })(<InputNumber min={0} placeholder="请输入虚拟订阅数" />)}
        </FormItem>
        <FormItem label='课程介绍' hasFeedback {...formItemLayout} extra="可上传多图">
          {getFieldDecorator('descriptionImages', {
            initialValue: curItem.descriptionImages && curItem.descriptionImages.map(cur => cur.id).join(','),
            rules: [
              {
                required: true,
                message: '请输入课程介绍'
              }
            ]
          })(<Input style={{display: 'none'}}/>)}
          <UploadFile {...uploadDescriptionProps}></UploadFile>
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
