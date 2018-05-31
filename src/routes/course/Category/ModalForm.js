import React,{PropTypes,Component} from 'react'
import {Form, Input , InputNumber, Modal, Icon ,Radio, Button} from 'antd'

const FormItem = Form.Item
const RadioGruop = Radio.Group

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
    form:PropTypes.object.isRequired
  }

  handleOk () {
    const {modal:{curItem}, form: {validateFields},onOk} =this.props

    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = values

      if(!!curItem.id) {
        data.id = curItem.id
      }
      if(!!curItem.title) {
        data.title=curItem.title
      }

      if(!!type) {
        data.type=curItem.type
      }
      onOk(data)
    })

  }


  render() {
    const {
      modal: { curItem, type, loading, visible },
      form: {
        getFieldDecorator
      },
      onCancel
    } = this.props

    const modalFormOpts = {
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 添加课程</div> : <div><Icon type="edit" /> 修改课程</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      width: 1000,
      onOk: ::this.handleOk,
      onCancel,

    }


    return(
      <Modal {...modalFormOpts}>

        <FormItem label='课程类型' hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: curItem.type,
            rules: [
              {
                required: true,
                message: '课程类型为空'
              }
            ]
          })(<Input placeholder="请输入课程类型" />)}
        </FormItem>
      </Modal>
    )
  }


}

export default Form.create()(ModalForm)