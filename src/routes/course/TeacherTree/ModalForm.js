import React, { PropTypes, Component } from 'react'
import { Form, Input, InputNumber, Modal, Icon, Select, Button, Radio } from 'antd'
import {UploadFile, Upload} from '../../../components/'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

class ModalForm extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  handleOk (status) {
    const { root_id, modal: { curItem }, onOk, form: { validateFieldsAndScroll } } = this.props
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        ...values,
        root_id,
        lesson_id: curItem.id,
        status,
      }
      onOk(data)
    })
  }

  render() {

    const {
      modal: { curItem, type, visible, loading },
      form: {
        getFieldDecorator
      },
      onCancel
    } = this.props

    const modalFormOpts = {
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 新建课时</div> : <div><Icon type="edit" /> 修改课时</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      onCancel,
      width: 800,
      footer: [
        <Button key="back" size="large" onClick={onCancel}>取消</Button>,
        <Button key="draft" size="large" loading={loading} onClick={() => this.handleOk(0)} type="primary">保存至下架</Button>,
        <Button key="submit" size="large" loading={loading} onClick={() => this.handleOk(10)} type="danger">保存并上架</Button>
      ]
    }

    const uploadCoverProps = {
      path: 'course',
      accept: 'image',
      fileList: curItem.cover_image,
      onUpload: (file) => {
        this.props.form.setFieldsValue({
          cover_image: file ? file.id : ''
        })
      }
    }

    const uploadResourceProps = {
      type: 'famous_course',
      accept: 'video',
      files: curItem.resource,
      allowDelete: true,
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          resource: file ? file.id : ''
        })
      }
    }

    const uploadFullScoresProps = {
      multiple: true,
      path: 'course',
      accept: 'image',
      fileList: curItem.full_scores || [],
      onUpload: (files) => {
        const ids = files.map(file => file.id).join(',')
        this.props.form.setFieldsValue({
          full_scores: ids
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
        this.props.form.setFieldsValue({
          descriptionImages: ids
        })
      }
    }

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem label='课时名称' hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: curItem.title,
              rules: [
                {
                  required: true,
                  message: '请输入课时名称'
                }
              ]
            })(<Input placeholder="请输入课时名称"/>)}
          </FormItem>
          {/*<FormItem label='封面图' hasFeedback {...formItemLayout} extra="图片：建议尺寸 300 x 300">
            {getFieldDecorator('cover_image', {
              initialValue: curItem.cover_image_id,
              rules: [
                {
                  required: true,
                  message: '封面图不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <UploadFile {...uploadCoverProps}></UploadFile>
          </FormItem>
          <FormItem label='课时权重' hasFeedback {...formItemLayout} extra="课时权重是体现当前课时在所有课时的权重比，整数型，所有权重相加必须为95！">
            {getFieldDecorator('progress_rate', {
              initialValue: curItem.progress_rate,
              rules: [
                {
                  required: true,
                  message: '请输入课时权重'
                }
              ]
            })(<InputNumber min={1} placeholder="请输入课时权重" />)}
          </FormItem>*/}
          <FormItem label='课时时长' hasFeedback {...formItemLayout}>
            {getFieldDecorator('duration', {
              initialValue: curItem.duration,
              rules: [
                {
                  required: true,
                  message: '请输入课时时长'
                }
              ]
            })(<InputNumber min={1} placeholder="请输入课时时长(秒数)" />)}
          </FormItem>
          <FormItem label='曲谱上传' hasFeedback {...formItemLayout} extra="可上传多图">
            {getFieldDecorator('full_scores', {
              initialValue: curItem.full_scores && curItem.full_scores.map(cur => cur.id).join(',')
            })(<Input style={{display: 'none'}}/>)}
            <UploadFile {...uploadFullScoresProps}></UploadFile>
          </FormItem>
          <FormItem label='课时资源' hasFeedback {...formItemLayout} extra='请上传MP4格式课时资源'>
            {getFieldDecorator('resource', {
              initialValue: curItem.resource && curItem.resource.id
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadResourceProps}></Upload>
          </FormItem>
          <FormItem label="是否免费试听" hasFeedback {...formItemLayout}>
            {getFieldDecorator('is_free', {
              initialValue: curItem.isFree ? 1 : 0,
              })
              (<RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>)
            }
          </FormItem>
          <FormItem label='课时介绍' hasFeedback {...formItemLayout} extra="可上传多图">
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
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
}

export default Form.create()(ModalForm)
