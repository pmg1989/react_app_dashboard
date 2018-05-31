import React, { Component, PropTypes } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Media, Player, controls, utils } from 'react-media-player'
import classnames from 'classnames'
import PlayPause from './PlayPause'
import MuteUnmute from './MuteUnmute'
import styles from './MediaPlayer.less'

import $ from "jquery"
import lyric from './lyric'
import styles2 from './lyric.less'
let lyricContainer

const { CurrentTime, Progress, SeekBar, Duration, Volume, Fullscreen } = controls
const { formatTime } = utils

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const panner = audioContext.createPanner()

panner.setPosition(0, 0, 1)
panner.panningModel = 'equalpower'
panner.connect(audioContext.destination)

class AudioPlayer extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    cover: PropTypes.string,
    lrcUrl: PropTypes.string
  }

  static defaultProps = {
    autoPlay: true
  }

  static lrcList = []
  static lrcListLength = 0

  state = {
    lyricList: [],
    lrcStatus: true, // true： 两行歌词；false：多行歌词
    lrcClick: true
  }

  componentDidMount() {
    const source = audioContext.createMediaElementSource(this._player.instance)
    source.connect(panner)
    panner.connect(audioContext.destination)

    if(!!this.props.lrcUrl) {
      lyricContainer = document.getElementById('lyricContainer')
      lyric.getLyric(this.props.lrcUrl, (lyricList) => {
        AudioPlayer.lrcList = lyricList
        AudioPlayer.lrcListLength = lyricList.length
        this.setState({ lyricList })
      })
    }
  }

  handleTimeUpdate(e) {
    if(!!this.props.lrcUrl) {
      const { currentTime, duration } = e
      const oldTop = this.state.lrcStatus ? 0 : 200
      for (let i = AudioPlayer.lrcListLength - 1; i >= 0; i -= 1) {
        if (currentTime > AudioPlayer.lrcList[i].time - 0.5) { /* preload the lyric by 0.50s*/
          const line = $(`#line-${i}`)
          if(line) {
            line.addClass('current-line-1').siblings('p').removeClass('current-line-1')
            lyricContainer.style.top = `${oldTop - line[0].offsetTop}px`
          }
          break
        }
      }
    }
  }

  render() {

    const { lyricList, lrcStatus } = this.state
    const { lrcUrl } = this.props

    const boxProps = {
      className: styles2.box,
      onClick: () => {
        if (this.state.lrcClick) {
          this.setState(prevState => ({
            lrcStatus: !prevState.lrcStatus
          }))
        }
      },
      style: {
        background: `url('${this.props.cover}') no-repeat center center`,
        backgroundSize: 'cover',
      },
    }

    return (
      <div>
        {!!lrcUrl &&
          <div {...boxProps}>
            <div className={styles2.container}>
              <div className={classnames(styles2.lyric_wrapper, { [styles2.nomarl]: !lrcStatus })}>
                <div className={styles2.lyric_container} id="lyricContainer">
                  {lyricList.map((item, key) => (
                    <p key={key} id={`line-${key}`}>{item.text}</p>
                  ))}
                  {lyricList.length === 0 && <p>歌词加载中...</p>}
                </div>
              </div>
            </div>
          </div>
        }
        <Media>
          <div>
            <Player
              autoPlay={this.props.autoPlay}
              ref={c => this._player = c}
              src={this.props.src}
              useAudioObject
              crossOrigin="anonymous"
              onTimeUpdate={::this.handleTimeUpdate}
            />
            <div className={styles["media-controls"]}>
              <div className={styles["media-control-group"]}>
                <PlayPause className={classnames(styles["media-control"], styles["media-control--play-pause"])}  />
                <CurrentTime className={classnames(styles["media-control"], styles["media-control--current-time"])}  />
              </div>
              <SeekBar className={classnames(styles["media-control"], styles["media-control--volume-range"])}  />
              <Duration className={classnames(styles["media-control"], styles["media-control--duration"])}  />
              <div className={styles["media-control-group"]} >
                <MuteUnmute className={classnames(styles["media-control"], styles["media-control--mute-unmute"])} />
                <Volume className={classnames(styles["media-control"], styles["media-control--volume"])} />
              </div>
            </div>
            {/* <input type="range" defaultValue="0" min="-1" max="1" step="any" onChange={this._handlePannerChange} /> */}
          </div>
        </Media>
      </div>

    )
  }
}

export default AudioPlayer
