import React, { PropTypes, Component } from 'react'
import { Form, Input,InputNumber, Button, Tabs, Row, Col } from 'antd'
import LzEditor from 'react-lz-editor'
import {UploadFile} from '../../../components/'
import styles from './TopicForm.less'
import Cookie from '../../../utils/cookie'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const tailFormItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 6,
    }
}

const baseURL = newband.app.admin.API_HOST

class TopicForm extends Component {

  static propTypes = {
    topicAdd: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      upImage: props.topicAdd.model.image,
      content: props.topicAdd.model.content
    }
  }

  componentWillUnmount() {
    this.props.form.resetFields() //必须项，编辑后如未确认保存，关闭时必须重置数据
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.topicAdd.model.image && !!nextProps.topicAdd.model.image) {
      this.setState({
        upImage: nextProps.topicAdd.model.image,
        content: nextProps.topicAdd.model.content
      })
    }
  }

  handleSubmit(e, object = {}) {
    e.preventDefault()
    const { status } = object
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        values.id = this.props.id
        values.status = status || 2
        this.props.onOk(values)

        setTimeout(() => {
          const iframe = document.getElementById('preContent')
          iframe.src = iframe.src
        }, 1000)
      }
    })
  }

  handleUpload(file) {
    const upImage = file ? file.url : ''
    this.setState({ upImage: upImage })
    this.props.form.setFieldsValue({
      image: upImage
    })
  }

  receiveHtml = (content) => {
    //this.setState({ content })
    this.props.form.setFieldsValue({
      content: content
    })
  }

  handleContentChange = (e) => {
    this.setState({content: e.target.value})
  }

  handleChangeTabs(key) {
    if(key == '3') {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          const old_status = this.props.topicAdd.model.status
          values.id = this.props.id
          values.status = old_status || 2
          this.props.onOk(values, true)

          setTimeout(() => {
            const iframe = document.getElementById('preContent')
            iframe.src = iframe.src
          }, 1000)
        }
      })
    }
  }

  checkMaxLength1(rule, value, callback) {
    if (value && value.length > 60) {
      callback('摘要字数要小于60个字符');
    } else {
      callback();
    }
  }

  checkMaxLength2(rule, value, callback) {
    if (value && value.length > 10) {
      callback('关键字字数要小于10个字符');
    } else {
      callback();
    }
  }

  checkMaxLength3(rule, value, callback) {
    if (value && value.length > 30) {
      callback('标题字数要小于30个字符');
    } else {
      callback();
    }
  }

  render() {

    const Upload = () => (
      <UploadFile fileList={upImage} onUpload={::this.handleUpload} path="topic"></UploadFile>
    )

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

    const {
      topicAdd: { model, loading },
      id,
      form: {
        getFieldDecorator
      },
      updatePower
    } = this.props

    const { upImage } = this.state

    return (
      <Row>
        <Col span={18}>
          <Form className={styles.topicForm} onSubmit={::this.handleSubmit}>
            <FormItem label='标题' hasFeedback {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: model.title,
                rules: [
                  {
                    required: true,
                    message: '请输入专题标题'
                  },
                  {
                    validator: ::this.checkMaxLength3,
                  }
                ]
              })(<Input placeholder="请输入专题标题" />)}
            </FormItem>
            <FormItem label='作者' hasFeedback {...formItemLayout} extra="不在APP内显示">
              {getFieldDecorator('author', {
                initialValue: model.author
              })(<Input placeholder="请输入作者信息" />)}
            </FormItem>
            <FormItem label='封面图片' hasFeedback {...formItemLayout} extra="封面图片建议尺寸：750像素 * 320像素">
              {getFieldDecorator('image', {
                initialValue: model.image,
                rules: [
                  {
                    required: true,
                    message: '封面图片不能为空'
                  }
                ]
              })(<Input style={{display: 'none'}}/>)}
              <Upload />
            </FormItem>
            <FormItem label='摘要' hasFeedback {...formItemLayout}>
              {getFieldDecorator('summary', {
                initialValue: model.summary,
                rules: [
                  {
                    required: true,
                    message: '请输入摘要，小于60个字符'
                  },
                  {
                    validator: ::this.checkMaxLength1,
                  }
                ]
              })(<Input placeholder="请输入摘要，小于60个字符" type="textarea" rows={3} max={60}/>)}
            </FormItem>
            <FormItem label='关键词' hasFeedback {...formItemLayout} extra="只能填写一个">
              {getFieldDecorator('keywords', {
                initialValue: model.keywords,
                rules: [
                  // {
                  //   required: true,
                  //   message: '关键词，只能填写一个，小于10个字符'
                  // },
                  {
                    validator: ::this.checkMaxLength2,
                  }
                ]
              })(<Input placeholder="请输入关键词，只能填写一个，小于10个字符" />)}
            </FormItem>
            <FormItem label='阅读次数' hasFeedback {...formItemLayout} extra="显示的阅读次数 = 虚拟阅读次数 + 实际阅读次数">
              {getFieldDecorator('readTimes', {
                initialValue: model.readTimes,
                rules: [
                  {
                    required: true,
                    message: '请输入阅读次数'
                  }
                ]
              })(<InputNumber placeholder="请输入阅读次数" />)}
            </FormItem>
            <FormItem label='正文内容' hasFeedback {...formItemLayout}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="内容编辑" key="1">
                  <LzEditor
                    active={true}
                    autoSave={false}
                    cbReceiver={::this.receiveHtml}
                    uploadConfig={uploadConfig}
                    importContent={this.state.content}
                    fullScreen={false}
                    convertFormat="html"/>
                </TabPane>
                <TabPane tab="源码编辑" key="2">
                  {getFieldDecorator('content', {
                    initialValue: model.content,
                    rules: [
                      {
                        required: true,
                        message: '请输入正文内容'
                      }
                    ],
                    onChange :this.handleContentChange
                  })(<Input type="textarea" placeholder="可直接编辑源码" autosize autosize={{ minRows: 15 }}/>
                  )}
                </TabPane>
                {/* <TabPane tab="手机预览" key="3" disabled={!model.id}>
                  <div className={styles.phone}>
                    <iframe id="preContent" name="preContent" className={styles.iframe} frameBorder="0" scrolling="yes" src={model.share_url}></iframe>
                  </div>
                  <div className={styles.statusbar}></div>
                </TabPane> */}
              </Tabs>
            </FormItem>
            {model.share_url &&
              <FormItem label='链接地址' hasFeedback {...formItemLayout} extra="可以复制到手机浏览器预览">
                {model.share_url}
              </FormItem>
            }
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" className={styles.button} loading={loading} disabled={!updatePower}>{ !!id ? '修改专题-草稿': '新增专题-草稿' }</Button>
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button onClick={(e) => this.handleSubmit(e, { status: 1 })} type="danger" size="large" className={styles.button} loading={loading} disabled={!updatePower}>{ !!id ? '修改专题-上架': '新增专题-上架' }</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={6}>
          <div className={styles.phoneBox}>
            <div className={styles.phone}>
              <iframe id="preContent" name="preContent" className={styles.iframe} frameBorder="0" scrolling="yes" src={model.share_url}></iframe>
            </div>
            <div className={styles.statusbar}></div>
          </div>
        </Col>
      </Row>

    )
  }
}

export default Form.create()(TopicForm)
