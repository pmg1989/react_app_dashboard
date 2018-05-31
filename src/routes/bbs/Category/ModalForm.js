import React, { PropTypes, Component } from 'react'
import { Form, Input, InputNumber, Radio, Modal, Icon } from 'antd'
import { validPhone } from '../../../utils/utilsValid'
import { UploadFile } from '../../../components/'

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
  constructor(props) {
    super(props)
    this.state = {
      upImage: ''
    }
  }

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.modal.curItem.imgurl && !! nextProps.modal.curItem.imgurl) {
      this.setState({ upImage: nextProps.modal.curItem.imgurl })
    }
  }

  handleOk() {
    const { modal, onOk, form: { validateFields } } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        ...values,
        cid: modal.curItem.cid
      }
      onOk(data)
    })
  }

  handleUpload = (file) => {
    const upImage = file ? file.url : ''
    this.setState({ upImage })
    this.props.form.setFieldsValue({
      imgurl: upImage
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

    const { upImage } = this.state

    const modalFormOpts = {
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 新建分类</div> : <div><Icon type="edit" /> 修改分类</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onOk: ::this.handleOk,
      onCancel,
      afterClose: () => {
        resetFields() //必须项，编辑后如未确认保存，关闭时必须重置数据
        this.setState({ upImage: '' })
      }
    }

    const Upload = () => (
      <UploadFile fileList={upImage} onUpload={this.handleUpload} path="bbs"></UploadFile>
    )

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem label='分类名称' hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: curItem.name,
              rules: [
                {
                  required: true,
                  message: '分类名称不能为空'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label='图片路径' hasFeedback {...formItemLayout}>
            {getFieldDecorator('imgurl', {
              initialValue: curItem.imgurl,
              rules: [
                {
                  required: true,
                  message: '图片路径不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
