import React, { PropTypes, Component } from 'react'
import { Form, Modal, Icon } from 'antd'
const FormItem = Form.Item

class ModalForm extends Component {

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
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

    const isReadable = type==='detail'

    const modalFormOpts = {
      title: <div><Icon type="info-circle-o" /> 预览 - 头像</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onCancel,
      width: 500,
      footer: null
    }

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem hasFeedback>
            <img style={{ display: 'block', width: 300, height: 300, margin: '0 auto' }} src={curItem.src} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
