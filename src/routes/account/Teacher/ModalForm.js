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

  handleOk() {
    const { modal, onOk, form: { validateFields } } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = values
      if(!values.mobile) {
        data.mobile = modal.curItem.mobile
      }
      console.log(data);

      onOk(data,modal.curItem.id)
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
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 新建老师账户</div> : <div><Icon type="edit" /> 编辑老师账户</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      width: 1000,
      onOk: ::this.handleOk,
      onCancel,

    }

    return (
      <Modal {...modalFormOpts}>
        <Form>
          {(type==='create') &&
            <FormItem label='输入手机号' hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobile', {
              initialValue: curItem.mobile,
              rules: [
                {
                  required: true,
                  message: '曲目标题不能为空'
                }
              ]
            })(<Input placeholder="请输入手机号"/>)}
            </FormItem>
          }

          <FormItem label='认证信息' hasFeedback {...formItemLayout}>
            {getFieldDecorator('brand', {
              initialValue: curItem.brand,
              rules: [
                {
                  required: true,
                  message: '认证信息不能为空'
                }
              ]
            })(<Input placeholder="请输入认证信息" />)}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
