import React, { Component, PropTypes } from 'react'
import { Media, Player, withMediaProps, withKeyboardControls, controls } from 'react-media-player'
import classnames from 'classnames'
import PlayPause from './PlayPause'
import MuteUnmute from './MuteUnmute'
import Fullscreen from './Fullscreen'
import styles from './MediaPlayer.less'

import $ from "jquery"
import lyric from './lyric'
import styles2 from './lyric.less'
let lyricContainer

const { CurrentTime, Progress, SeekBar, Duration, Volume } = controls

class VideoPlayer extends Component {

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
    lyricList: []
  }

  componentDidMount() {
    if(!!this.props.lrcUrl) {
      lyricContainer = document.getElementById('lyricContainer')
      lyric.getLyric(this.props.lrcUrl, (lyricList) => {
        VideoPlayer.lrcList = lyricList
        VideoPlayer.lrcListLength = lyricList.length
        this.setState({ lyricList })
      })
    }
  }

  handleTimeUpdate(e) {
    if(!!this.props.lrcUrl) {
      const { currentTime, duration } = e
      for (let i = VideoPlayer.lrcListLength - 1; i >= 0; i -= 1) {
        if (currentTime > VideoPlayer.lrcList[i].time - 0.5) { /* preload the lyric by 0.50s*/
          const line = $(`#line-${i}`)
          if(line) {
            line.addClass('current-line-1').siblings('p').removeClass('current-line-1')
            lyricContainer.style.top = `${0 - line[0].offsetTop}px`
          }
          break
        }
      }
    }
  }

  render() {
    const { src, autoPlay, lrcUrl, cover } = this.props
    const { lyricList } = this.state

    return (
      <div>
        <Media>
          {({ isFullscreen, playPause }) =>
            <div
              className={classnames(styles['media-player'], { [styles['media-player--fullscreen']]: isFullscreen })}
              tabIndex="0"
            >
              <Player
                autoPlay={autoPlay}
                src={src}
                poster={!!cover ? cover : `${src}?vframe/jpg/offset/0`}
                onClick={() => playPause()}
                onTimeUpdate={::this.handleTimeUpdate}
              />
              <div className={styles["media-controls"]}>
                <div className={styles["media-control-group"]} >
                  <PlayPause className={classnames(styles["media-control"], styles["media-control--play-pause"])}/>
                  <CurrentTime className={classnames(styles["media-control"], styles["media-control--current-time"])} />
                </div>
                <div className={classnames(styles["media-control-group"], styles["media-control-group--seek"])}>
                  <Progress className={classnames(styles["media-control"], styles["media-control--progress"])} />
                  <SeekBar className={classnames(styles["media-control"], styles["media-control--seekbar"])} />
                </div>
                <Duration className={classnames(styles["media-control"], styles["media-control--duration"])} />
                <div className={styles["media-control-group"]} >
                  <MuteUnmute className={classnames(styles["media-control"], styles["media-control--mute-unmute"])} />
                  <Volume className={classnames(styles["media-control"], styles["media-control--volume"])} />
                </div>
                <div className={styles["media-control-group"]} >
                  <Fullscreen className={classnames(styles["media-control"], styles["media-control--fullscreen"])} />
                </div>
              </div>
            </div>
          }
        </Media>
        {!!lrcUrl &&
          <div className={styles2.video_box}>
            <div className={styles2.lyric_wrapper}>
              <div className={styles2.lyric_container} id="lyricContainer">
                {lyricList.map((item, key) => (
                  <p key={key} id={`line-${key}`}>{item.text}</p>
                ))}
                {lyricList.length === 0 && <p>歌词加载中...</p>}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default VideoPlayer
