import React, { PropTypes, Component } from 'react'
import { Form, Input, InputNumber, Modal, Icon, Radio, Button } from 'antd'
import { validPhone } from '../../../utils/utilsValid'
import { Upload } from '../../../components/'

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

class ModalForm extends Component {

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  handleOk(status) {
    const { modal, onOk, form: { validateFields } } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      values.status = status
      if(!values.orderNo) {
        values.orderNo = 0
      }
      onOk(values, modal.curItem.id)
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
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 添加曲目</div> : <div><Icon type="edit" /> 修改曲目</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      width: 1000,
      onCancel,
      footer: [
        <Button key="back" size="large" onClick={onCancel}>取消</Button>,
        <Button key="draft" size="large" loading={loading} onClick={() => this.handleOk(2)} type="primary">保存至草稿</Button>,
        <Button key="submit" size="large" loading={loading} onClick={() => this.handleOk(1)} type="danger">保存并上架</Button>
      ]
    }

    const uploadCoverProps = {
      type: 'practice_song_cover',
      accept: 'image',
      files: curItem.cover,
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          cover: file.id
        })
      }
    }

    const uploadFileProps = {
      type: 'practice_song',
      accept: 'zip',
      files: curItem.file,
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          file: file.id
        })
      }
    }

    const uploadFileLrcProps = {
      type: 'practice_song_lrc',
      accept: 'lrc',
      files: curItem.lyric,
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          lyric: file.id
        })
      }
    }

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem label='曲目标题' hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: curItem.title,
              rules: [
                {
                  required: true,
                  message: '曲目标题不能为空'
                }
              ]
            })(<Input placeholder="请输入曲目标题" />)}
          </FormItem>
          <FormItem label='原唱或作者' hasFeedback {...formItemLayout}>
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
          <FormItem label='节奏' hasFeedback {...formItemLayout}>
            {getFieldDecorator('beats', {
              initialValue: curItem.beats || '',
              // rules: [
              //   {
              //     required: true,
              //     message: '节奏不能为空'
              //   }
              // ]
            })(<Input placeholder="请输入节奏" />)}
          </FormItem>
          <FormItem label='速度' hasFeedback {...formItemLayout} extra='速度的录入范围是：40 ~ 240'>
            {getFieldDecorator('tempo', {
              initialValue: curItem.tempo || '',
              // rules: [
              //   {
              //     required: true,
              //     message: '速度不能为空'
              //   }
              // ]
            })(<InputNumber placeholder="请输入速度" min={40} max={240} />)}
          </FormItem>
          <FormItem label='歌曲时长' hasFeedback {...formItemLayout}>
            {getFieldDecorator('txtDuration', {
              initialValue: curItem.txtDuration || '',
              // rules: [
              //   {
              //     required: true,
              //     message: '歌曲时长不能为空'
              //   }
              // ]
            })(<Input placeholder="请输入歌曲时长" />)}
          </FormItem>
          <FormItem label='曲目类型' hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: curItem.type || 0,
              rules: [
                {
                  required: true,
                  message: '曲目类型不能为空'
                }
              ]
            })(
              <RadioGroup>
                <Radio value={0}>练习曲目</Radio>
                <Radio value={1}>比赛曲目</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label='演唱技巧' hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: curItem.description,
              rules: [
                {
                  required: true,
                  message: '演唱技巧不能为空'
                }
              ]
            })(<Input placeholder="请输入演唱技巧" type="textarea" rows={8} />)}
          </FormItem>
          <FormItem label='封面图' hasFeedback {...formItemLayout} extra="图片：建议尺寸 300px x 300px">
            {getFieldDecorator('cover', {
              initialValue: curItem.cover && curItem.cover.id,
              // rules: [
              //   {
              //     required: true,
              //     message: '封面图不能为空'
              //   }
              // ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadCoverProps}></Upload>
          </FormItem>

          <FormItem label='原唱伴奏压缩包' hasFeedback {...formItemLayout} extra='请上传原唱及伴奏的zip压缩包'>
            {getFieldDecorator('file', {
              initialValue: curItem.file && curItem.file.id,
              rules: [
                {
                  required: true,
                  message: '原唱伴奏压缩包不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadFileProps}></Upload>
          </FormItem>
          <FormItem label='歌词文件' hasFeedback {...formItemLayout} extra='请上传原唱及伴奏的LRC歌词文件'>
            {getFieldDecorator('lyric', {
              initialValue: curItem.lyric && curItem.lyric.id,
              rules: [
                {
                  required: true,
                  message: '歌词文件不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadFileLrcProps}></Upload>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
