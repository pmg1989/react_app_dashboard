//https://github.com/lenage/react-qiniu
//git@github.com:lenage/react-qiniu.git

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent-bluebird-promise'

function isFunction (fn) {
  const getType = {}
  return fn && getType.toString.call(fn) === '[object Function]'
}

class UploadQiniu extends Component {

  static propTypes = {
      onDrop: PropTypes.func.isRequired,
      token: PropTypes.string.isRequired,
      // called before upload to set callback to files
      onUpload: PropTypes.func,
      size: PropTypes.number,
      supportClick: PropTypes.bool,
      accept: PropTypes.string,
      multiple: PropTypes.bool,
      // Qiniu
      uploadUrl: PropTypes.string,
      uploadKey: PropTypes.string,
      prefix: PropTypes.string,
      xtype: PropTypes.string.isRequired
  }

  static defaultProps = {
      supportClick: true,
      multiple: true,
      uploadUrl: window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com'
  }

  constructor(props) {
    super(props)

    this.state = { isDragActive: false }
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    })
  }

  onDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'

    this.setState({
      isDragActive: true
    })
  }

  onDrop(e) {
      e.preventDefault()

      this.setState({
        isDragActive: false
      })

      let files
      if (e.dataTransfer) {
        files = e.dataTransfer.files
      } else if (e.target) {
        files = e.target.files
      }

      const maxFiles = (this.props.multiple) ? files.length : 1

      if (this.props.onUpload) {
        files = Array.prototype.slice.call(files, 0, maxFiles)
        this.props.onUpload(files, e)
      }

      for (let i = 0; i < maxFiles; i++) {
        files[i].preview = URL.createObjectURL(files[i])
        files[i].request = this.upload(files[i])
        files[i].uploadPromise = files[i].request.promise()
      }

      if (this.props.onDrop) {
        files = Array.prototype.slice.call(files, 0, maxFiles)
        this.props.onDrop(files, e)
      }
  }

  onClick() {
    if (this.props.supportClick) {
      this.open()
    }
  }

  open() {
    let fileInput = ReactDOM.findDOMNode(this.refs.fileInput)
    fileInput.value = null
    fileInput.click()
  }

  upload(file) {
    if (!file || file.size === 0) return null
    var key = file.preview.split('/').pop() + '.' + file.name.split('.').pop()
    if (this.props.prefix) {
      key = this.props.prefix + '/' + key
    }

    if(this.props.uploadKey) {
      key = this.props.uploadKey
    }

    const r = request
        .post(this.props.uploadUrl)
        .field('key', key)
        .field('token', this.props.token)
        .field('x:filename', file.name)
        .field('x:size', file.size)
        .field('x:type', this.props.xtype)
        .attach('file', file, file.name)
        .set('Accept', 'application/json')

    if (isFunction(file.onprogress)) {
      r.on('progress', file.onprogress)
    }
    return r
  }

  render() {
    const { className, multiple, accept, children } = this.props

    const qiniuProps = {
      className: className,
      onClick: ::this.onClick,
      onDragLeave: ::this.onDragLeave,
      onDragOver: ::this.onDragOver,
      onDrop: ::this.onDrop
    }

    return (
      <div {...qiniuProps}>
        <input style={{ display: 'none' }} type="file" multiple={multiple} ref='fileInput' onChange={::this.onDrop} accept={accept} />
        {children}
      </div>
    )
  }
}

export default UploadQiniu
