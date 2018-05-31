import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'
import Qiniu from './UploadQiniu'
import { Button, Progress, Icon } from 'antd'
import { request, Cookie } from '../../utils'
import styles from './Upload.less'

function renderAccecpt(accept) {
  if(!accept) {
    return null
  }
  if(['image', 'video', 'audio'].find(ext => ext === accept)) {
    return `${accept}/*`
  }
  if(accept === 'zip') {
    return 'application/zip,application/x-zip,application/x-zip-compressed'
  }
  return `.${accept}`
}

class Upload extends Component {

  static propTypes = {
    files: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onSussess: PropTypes.func.isRequired,
    multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    disabled: PropTypes.bool,
    type: PropTypes.string,
    prefix: PropTypes.string,
    accept: PropTypes.string
  }

  renderPropsFiles (props) {
    if(!!props.multiple) {
      return Array.isArray(props.files) ? props.files : []
    } else {
      return props.files && props.files.id ? [props.files] : []
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
      files: this.renderPropsFiles(props),
      token: ''
    }
  }

  static defaultProps = {
    type: 'custom',
    multiple: false,
    disabled: false,
    allowDelete: false,
  }

  handleUploadClick() {
    const tokenName = `qiniu_token`
    const token = Cookie.get(tokenName)
    if(token) {
      this.setState({ token })
    } else {
      request(`/api/extra/qiniu-storage/upload-token/custom`, {
        method: 'get',
        headers: {
          'X-Accept-Version': '4.0'
        },
        data: {}
      }).then((res) => {
        this.setState({ token: res.uptoken })
        Cookie.set(tokenName, res.uptoken)
      })
    }
  }

  handleRemove(id) {
    this.setState(prevState => {
      const files = prevState.files.filter(file => file.id !== id)
      this.props.onSussess(files, true)
      return { files }
    })
  }

  onUpload(files) {
    // set onprogress function before uploading
    files.map(file => {
        file.onprogress = (e) => {
          this.setState({ progress: e.percent.toFixed(0) })
        }
    })
  }

  onDrop(files) {
    const { multiple, onSussess } = this.props

    files.map((file, index) => {
      let item = {
        id: '',
        full_url: file.preview,
        fname: file.name,
        fsize: file.size,
        mime: file.type
      }

      if(!multiple) {
        this.setState({ files: [item] })
      } else {
        this.setState(prevState => {
          return {
            files: [...prevState.files, item]
          }
        })
      }

      file.uploadPromise.then((res) => {
        const data = res.body.data
        const model = {
          id: data.id,
          full_url: data.full_url,
          mime: data.mime,
          fsize: data.fsize,
          fname: data.fname
        }

        if(multiple) {
          this.setState(prevState => {
            const oldFiles = prevState.files.slice(0, prevState.files.length - 1)
            return {
              files: [...oldFiles, model]
            }
          })

          if(index === files.length - 1) {
            setTimeout(() => {
              onSussess(this.state.files)
            }, 0)
          }
        } else {
          onSussess(model)
        }
      })
    })
  }

  render() {

    const { token, files, progress } = this.state
    const { type, uploadKey, multiple, disabled, prefix, accept, allowDelete } = this.props
    const progressing = (progress > 0 && progress < 100)
    const qiniuProps = {
      multiple: false,
      token,
      prefix: prefix || type,
      xtype: type,
      uploadKey,
      className: styles.upload_qiniu,
      onDrop: ::this.onDrop,
      onUpload: ::this.onUpload,
      accept: renderAccecpt(accept)
    }

    return (
      <div>
        <Qiniu {...qiniuProps}>
            <Button disabled={disabled} loading={progressing} icon="upload" size="large" onClick={::this.handleUploadClick}>{progressing ? '正在上传' : '点击上传'}</Button>
        </Qiniu>
        {files.length > 0 &&
          <ul className={classnames(styles.files_box, {[styles.multiple] : multiple})}>
            {files.map((f, key) => {
              let preview = ''
              if (/image/.test(f.mime)) {
                preview = <img src={f.full_url} />
              } else if (/audio/.test(f.mime)) {
                preview = <audio src={f.full_url} controls> </audio>
              } else if (/video/.test(f.mime)) {
                preview = <video src={f.full_url} controls> </video>
              }

              return (
                <li key={key}>
                  {preview}
                  {progress > 0 && <Progress percent={+progress} strokeWidth={5} />}
                  <div className={styles.flex_box}>
                    <span>{f.fname}</span>
                    <span className={styles.size}>
                      {progress > 0 && (f.fsize * progress /1000/100).toFixed(2) + 'KB / '}
                      {(f.fsize/1000).toFixed(2)}KB
                    </span>
                  </div>
                  {(files.length > 1 || allowDelete) && <Icon className={styles.opt_remove} type="close-circle" onClick={() => this.handleRemove(f.id)}/>}
                </li>
              )
            })}
          </ul>
        }
      </div>
    )
  }
}

export default Upload
