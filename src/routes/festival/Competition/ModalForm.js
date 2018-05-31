import React, { PropTypes, Component } from 'react'
import { Form, Input, InputNumber, Modal, Icon, DatePicker, Select, Tabs, Button, Tag } from 'antd'
import moment from 'moment'
import LzEditor from 'react-lz-editor'
import { validPhone } from '../../../utils/utilsValid'
import { Upload } from '../../../components/'
import Cookie from '../../../utils/cookie'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
const TabPane = Tabs.TabPane

const format="YYYY-MM-DD HH:mm:ss"
const baseURL = newband.app.admin.API_HOST

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const renderDatePickerDate = (val) => {
  return moment(new Date(+val * 1000).format("yyyy-MM-dd HH:mm:ss"))
}

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agreement: props.modal.curItem.agreement
    }
  }

  static propTypes = {
    modal: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  receiveHtml = (content) => {
    //this.setState({ content })
    this.props.form.setFieldsValue({
      agreement: content
    })
  }

  handleContentChange = (e) => {
    this.setState({agreement: e.target.value})
  }

  handleOk(status) {
    const { modal, onOk, form: { validateFields } } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if(!!modal.curItem.id) {
        values.id = modal.curItem.id
      }
      const rangeValue1 = values['notice_date_start']
      if(!!rangeValue1.length) {
        values.notice_date_start = parseInt(rangeValue1[0].valueOf() / 1000)
        values.notice_date_end = parseInt(rangeValue1[1].valueOf() / 1000)
      }
      const rangeValue2 = values['upload_date_start']
      if(!!rangeValue2.length) {
        values.upload_date_start = parseInt(rangeValue2[0].valueOf() / 1000)
        values.upload_date_end = parseInt(rangeValue2[1].valueOf() / 1000)
      }
      const rangeValue3 = values['vote_date_start']
      if(!!rangeValue3.length) {
        values.vote_date_start = parseInt(rangeValue3[0].valueOf() / 1000)
        values.vote_date_end = parseInt(rangeValue3[1].valueOf() / 1000)
      }
      values.status = status
      onOk(values)
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

    const uploadConfig = {
      QINIU_URL: "https://up.qbox.me", //上传地址，现在暂只支持七牛上传
      QINIU_IMG_TOKEN_URL: `${baseURL}v2/file/upload-token?access_token=${Cookie.get('access_token')}`, //请求图片的token
      QINIU_PFOP: {
        url: "http://www.yourServerAddress.mobi/doQiniuPicPersist.do" //七牛持久保存请求地址
      },
      QINIU_VIDEO_TOKEN_URL: `${baseURL}/file/uploadToken`, //请求媒体资源的token
      QINIU_FILE_TOKEN_URL: `${baseURL}/file/uploadToken`, //其他资源的token的获取
      QINIU_IMG_DOMAIN_URL: "//bbs.nwbasset.com", //图片文件地址的前缀
      QINIU_DOMAIN_IMG_URL: "//bbs.nwbasset.com", //图片文件地址的前缀
      QINIU_DOMAIN_VIDEO_URL: "//bbs.nwbasset.com", //视频文件地址的前缀
      QINIU_DOMAIN_FILE_URL: "//bbs.nwbasset.com", //其他文件地址前缀
    }

    const modalFormOpts = {
      title: type === 'create' ? <div><Icon type="plus-circle-o" /> 添加大赛</div> : <div><Icon type="edit" /> 修改大赛</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      width: 800,
      onCancel,
      footer: [
        <Button key="back" size="large" onClick={onCancel}>取消</Button>,
        <Button key="draft" size="large" loading={loading} onClick={() => this.handleOk(3)} type="primary">保存至草稿</Button>,
        <Button key="submit" size="large" loading={loading} onClick={() => this.handleOk(1)} type="danger">保存并上架</Button>
      ]
    }

    const uploadCoverProps = {
      type: 'competition_cover',
      accept: 'image',
      files: curItem.cover_file_detail || {},
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          cover_file_id: file.id
        })
      }
    }

    const uploadDetailCoverProps = {
      type: 'competition_cover',
      accept: 'image',
      files: curItem.detail_cover_file_detail || {},
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          detail_cover_file_id: file.id
        })
      }
    }

    const uploadDetailFileProps = {
      type: 'competition_file',
      accept: 'video',
      files: curItem.detail_file_detail || {},
      onSussess: (file) => {
        this.props.form.setFieldsValue({
          detail_file_id: file.id
        })
      }
    }

    return (
      <Modal {...modalFormOpts}>
        <Form>
          <FormItem label='大赛名称' hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: curItem.title,
              rules: [
                {
                  required: true,
                  message: '请输入大赛名称'
                }
              ]
            })(<Input placeholder="请输入大赛名称" />)}
          </FormItem>
          <FormItem label='大赛期数' hasFeedback {...formItemLayout}>
            {getFieldDecorator('tag', {
              initialValue: curItem.tag,
              // rules: [
              //   {
              //     required: true,
              //     message: '请输入大赛期数'
              //   }
              // ]
            })(<Input placeholder="请输入大赛期数" />)}
          </FormItem>
          <FormItem label='练习曲目' hasFeedback {...formItemLayout} extra='可输入筛选并选择练习曲目'>
            {getFieldDecorator('practiceId', {
              initialValue: curItem.practiceId,
              rules: [
                {
                  required: true,
                  message: '练习曲目不能为空'
                }
              ]
            })(<Select
                showSearch
                placeholder="可输入筛选并选择练习曲目"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                // filterOption={(input, option) => {
                //   console.log(input, option.props.children[0]);
                //   return true
                // }}
                >
                {curItem.practiceList && curItem.practiceList.map(d =>
                  <Option key={d.id} value={`${d.id}`}><Tag color={{0: 'red', 1: 'green'}[d.type]}>{ {0: '练习曲目', 1: '比赛曲目'}[d.type]}</Tag> - {d.title}</Option>)
                }
              </Select>)}
          </FormItem>
          <FormItem label='大师课程' hasFeedback {...formItemLayout} extra='可输入筛选并选择大师课程'>
            {getFieldDecorator('courseId', {
              initialValue: curItem.course_detail && curItem.course_detail.root,
              rules: [
                {
                  required: true,
                  message: '大师课程不能为空'
                }
              ]
            })(<Select
                showSearch
                placeholder="可输入筛选并选择大师课程"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                {curItem.courseList && curItem.courseList.map(d => <Option key={d.id} value={`${d.id}`}>{d.title}</Option>)}
              </Select>)}
          </FormItem>
          <FormItem label='举办方' hasFeedback {...formItemLayout}>
            {getFieldDecorator('organizer', {
              initialValue: curItem.organizer,
              // rules: [
              //   {
              //     required: true,
              //     message: '请输入举办方'
              //   }
              // ]
            })(<Input placeholder="请输入举办方" />)}
          </FormItem>
          <FormItem label='列表页封面图' hasFeedback {...formItemLayout} extra="图片：建议尺寸 710px * 392px">
            {getFieldDecorator('cover_file_id', {
              initialValue: curItem.cover_file_detail && curItem.cover_file_detail.id,
              rules: [
                {
                  required: true,
                  message: '列表页封面图不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadCoverProps}></Upload>
          </FormItem>
          <FormItem label='详情页封面图' hasFeedback {...formItemLayout} extra="图片：建议尺寸 750px * 750px">
            {getFieldDecorator('detail_cover_file_id', {
              initialValue: curItem.detail_cover_file_detail && curItem.detail_cover_file_detail.id,
              rules: [
                {
                  required: true,
                  message: '详情页封面图不能为空'
                }
              ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadDetailCoverProps}></Upload>
          </FormItem>
          <FormItem label='视频资源' hasFeedback {...formItemLayout} extra="视频：建议比例为16：9">
            {getFieldDecorator('detail_file_id', {
              initialValue: curItem.detail_file_detail && curItem.detail_file_detail.id,
              // rules: [
              //   {
              //     required: true,
              //     message: '视频资源不能为空'
              //   }
              // ]
            })(<Input style={{display: 'none'}}/>)}
            <Upload {...uploadDetailFileProps}></Upload>
          </FormItem>
          <FormItem label="预告时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('notice_date_start', {
              initialValue: curItem.notice_date_start && curItem.notice_date_end ? [renderDatePickerDate(curItem.notice_date_start), renderDatePickerDate(curItem.notice_date_end)] : '',
              rules: [
                {
                  required: true,
                  message: '预告时间不能为空'
                }
              ]
            })(<RangePicker showTime format={format} />)}
          </FormItem>
          <FormItem label="作品可上传时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('upload_date_start', {
              initialValue: curItem.upload_date_start && curItem.upload_date_end ? [renderDatePickerDate(curItem.upload_date_start), renderDatePickerDate(curItem.upload_date_end)] : '',
              rules: [
                {
                  required: true,
                  message: '作品可上传时间不能为空'
                }
              ]
            })(<RangePicker showTime format={format} />)}
          </FormItem>
          <FormItem label="可投票时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vote_date_start', {
              initialValue: curItem.vote_date_start && curItem.vote_date_end ? [renderDatePickerDate(curItem.vote_date_start), renderDatePickerDate(curItem.vote_date_end)] : '',
              rules: [
                {
                  required: true,
                  message: '可投票时间不能为空'
                }
              ]
            })(<RangePicker showTime format={format} />)}
          </FormItem>
          <FormItem label='活动介绍' hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: curItem.description,
              rules: [
                {
                  required: true,
                  message: '请输入活动介绍'
                }
              ]
            })(<Input placeholder="请输入活动介绍" type="textarea" rows={8} />)}
          </FormItem>
          <FormItem label='参赛协议' hasFeedback {...formItemLayout}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="内容编辑" key="1">
                <LzEditor
                  active={true}
                  autoSave={false}
                  cbReceiver={::this.receiveHtml}
                  uploadConfig={uploadConfig}
                  importContent={this.state.agreement}
                  fullScreen={false}
                  convertFormat="html"/>
              </TabPane>
              <TabPane tab="源码编辑" key="2">
                {getFieldDecorator('agreement', {
                  initialValue: curItem.agreement || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入参赛协议'
                  //   }
                  // ],
                  onChange :this.handleContentChange
                })(<Input type="textarea" placeholder="可直接编辑源码" autosize autosize={{ minRows: 15 }}/>
                )}
              </TabPane>
            </Tabs>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
