import React, { Component } from 'react'
import { InputNumber, Icon } from 'antd'
import styles from './EditableCell.less'

class EditableCell extends Component {

  state = {
    value: this.props.value,
    editable: false
  }

  handleChange = (e) => {
    if(e.target) {
      const value = e.target.value
      this.setState({ value })
    } else {
      this.setState({ value: e })
    }
  }

  check = () => {
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }

  cancel = () => {
    this.setState({ editable: false, value: this.props.value })
  }

  edit = () => {
    this.setState({ editable: true })
  }

  render() {

    const { value, editable } = this.state
    return (
      <div className={styles.editable_box}>
        {
          editable ?
            <div className={styles.flex_box}>
              <InputNumber
                className={styles.cell_input}
                min={0}
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon type="check" onClick={this.check} />
              <Icon type="close" onClick={this.cancel} />
            </div>
            :
            <div className={styles.flex_box}>
              <span className={styles.cell_text}>{value}</span>
              <Icon type="edit" onClick={this.edit} />
            </div>
        }
      </div>
    );
  }
}

export default EditableCell
