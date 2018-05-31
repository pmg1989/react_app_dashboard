import React, { Component } from 'react'
import { InputNumber } from 'antd'
import debounce from 'lodash.debounce'

class InputOrder extends Component {
  constructor(props) {
    super(props)

    this.handleChange = debounce(this.handleChange, 1000)
  }

  handleChange(params) {
    this.props.onChange(params)
  }

  render() {
    const { defaultValue, onChange } = this.props

    return (
      <InputNumber defaultValue={defaultValue} min={1} onChange={::this.handleChange} />
    )
  }
}

export default InputOrder
