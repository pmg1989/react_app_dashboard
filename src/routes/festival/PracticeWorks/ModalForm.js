import React, { PropTypes, Component } from 'react'
import { Form, Input, Modal, Icon,Button } from 'antd'
import { config } from '../../../utils'
import VideoPlayer from '../../../components/MediaPlayer/VideoPlayer'
import AudioPlayer from '../../../components/MediaPlayer/AudioPlayer'
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
      title: <div><Icon type="info-circle-o" /> 预览 - {curItem.title} / {curItem.user && curItem.user.profile.name} - {curItem.type=='audio' ? '音频' : '视频'}</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onCancel,
      width: 700,
      footer: null
    }

    const AudioPlayerProps = {
      src: curItem.file.full_url,
      autoPlay: false,
      cover: (curItem.cover && curItem.cover.full_url) || config.defaultImage,
      lrcUrl: curItem.practice_song.lyric.full_url
    }

    const VideoPlayerProps = {
      src: curItem.file.full_url,
      autoPlay: false,
      cover: (curItem.cover && curItem.cover.full_url) || config.defaultImage,
      lrcUrl: curItem.practice_song.lyric.full_url
    }

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem hasFeedback>
            {curItem.type=='audio' ? <AudioPlayer {...AudioPlayerProps} /> : <VideoPlayer {...VideoPlayerProps}/>  }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
