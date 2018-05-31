import React, { PropTypes, Component } from 'react'
import { Form, Input, Modal, Icon,Button } from 'antd'
import { validPhone } from '../../../utils/utilsValid'
import { Upload } from '../../../components/'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

class ModalForm extends Component {

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  handleOk() {
    const { modal, onOk, form: { validateFields } } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if(!!modal.curItem.id) {
        values.id = modal.curItem.id
      }
      values.status=3;
      onOk(values)
    })
  }
  render() {

    const {
      modal: { curItem, type, loading, visible },
      form: {
        getFieldDecorator,
        resetFields
      },
      onCancel
    } = this.props

    const modalFormOpts = {
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 添加伴奏</div> : <div><Icon type="edit" /> 修改伴奏</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onOk: ::this.handleOk,
      onCancel,
      width: 1000
    }

    const uploadCoverProps = {
      type: 'accompany_cover',
      accept: 'image',
      files: curItem.cover_file_detail||{},
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          cover_file_id: file.id
        })
      }
    }

    const uploadFileProps = {
      type: 'accompany',
      files: curItem.audio_file_detail||{},
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          audio_file_id: file.id
        })
      }
    }

    return (
      <Modal {...modalFormOpts}>
        <Form>

          <FormItem label='封面上传' hasFeedback {...formItemLayout} extra="图片：建议尺寸 710px * 329px">
            {getFieldDecorator('cover_file_id', {
              initialValue: curItem.cover_file_detail && curItem.cover_file_detail.id,
              rules: [
                {
                  required: true,
                  message: '封面图不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadCoverProps}></Upload>
          </FormItem>

          <FormItem label='音频文件上传' hasFeedback {...formItemLayout}>
            {getFieldDecorator('audio_file_id', {
              initialValue: curItem.audio_file_detail && curItem.audio_file_detail.id,
              rules: [
                {
                  required: true,
                  message: '音/视频包不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadFileProps}></Upload>
          </FormItem>

          <FormItem label='歌名' hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: curItem.title,
              rules: [
                {
                  required: true,
                  message: '曲目标题不能为空'
                }
              ]
            })(<Input placeholder="请输入歌名" />)}
          </FormItem>

          <FormItem label='原唱信息' hasFeedback {...formItemLayout}>
            {getFieldDecorator('actor', {
              initialValue: curItem.actor,
              rules: [
                {
                  required: true,
                  message: '原唱或作者不能为空'
                }
              ]
            })(<Input placeholder="请输入原唱或作者" />)}
          </FormItem>

          <FormItem label='歌曲时长' hasFeedback {...formItemLayout}>
            {getFieldDecorator('time_long', {
              initialValue: curItem.time_long,
              rules: [
                {
                  required: true,
                  message: '时长不能为空'
                }
              ]
            })(<Input placeholder="请输入时长" />)}
          </FormItem>

          <FormItem label='演唱技巧文案' hasFeedback {...formItemLayout}>
            {getFieldDecorator('skill', {
              initialValue: curItem.skill,
              rules: [
                {
                  required: true,
                  message: '文案至少5个字,不超过100字'
                }
              ]
            })(<Input placeholder="请输入文案" type="textarea" rows={8} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
