import React from 'react'
import { findDOMNode } from 'react-dom'

/**
 * @description 视频播放器
 * @class Video
 * @extends {React.Component}
 */
export default class Video extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      soundEnter: false, //鼠标是否hover声音按钮
      soundDisplay: false, //是否隐藏音量调整框
      draging: false, //是否在拖动，拖动进度和声音时
      sounding: false,  //是否在拖动声音
      hasPlay: false, //是否播放过
      sound: 1, //当前音量大小（0~1）
      muted: false, //是否静音
      preload: '1', //是否提前加载
      loop: false, //是否循环播放
      autoPlay: false, //是否自动播放
      playing: false, //是否正在播放
      currentTime: 0, //当前播放进度
      buffered: 0, //当前缓存进度
      duration: 0.1, //视频总时长
      loading: false //正在缓冲
    };
    let handles = [
      'handleLoadStart',
      'handleWaiting',
      'handleCanPlay',
      'handleCanPlayThrough',
      'handlePlaying',
      'handleEnded',
      'handleSeeking',
      'handleSeeked',
      'handlePlay',
      'handlePause',
      'handleProgress',
      'handleDurationChange',
      'handleError',
      'handleSuspend',
      'handleAbort',
      'handleEmptied',
      'handleStalled',
      'handleLoadedMetaData',
      'handleLoadedData',
      'handleTimeUpdate',
      'handleRateChange',
      'handleVolumeChange',
      'togglePlay',
      'toggleMute',
      'handleProgressMouseDown',
      'eventProgressMouseMove',
      'handleProgressClick',
      'handleSoundMouseOver',
      'handleSoundMouseOut',
      'handleSoundMouseDown',
      'eventSoundMouseMove',
      'handleSoundClick',
      'handleFullScreen'
    ];
    handles.forEach(key => this[key] = this[key].bind(this))
  }

  componentDidMount() {
    
  }

  handleLoadStart() {
    console.log('Video:handleLoadStart')

  }

  handleWaiting() {
    console.log('Video:handleWaiting')
    this.setState({
      loading: true
    })
  }

  handleCanPlay() {
    console.log('Video:handleCanPlay')
    this.setState({
      loading: false
    })
  }

  handleCanPlayThrough() {
    console.log('Video:handleCanPlayThrough')
    
  }

  handlePlaying() {
    console.log('Video:handlePlaying')
    
  }

  handleEnded() {
    console.log('Video:handleEnded')
    
  }

  handleSeeking() {
    console.log('Video:handleSeeking')
    
  }

  handleSeeked() {
    console.log('Video:handleSeeked')
    
  }

  handlePlay() {
    this.setState({
      hasPlay: true,
      playing: true
    })
  }

  handlePause() {
    this.setState({
      playing: false,
      loading: false
    })
  }
  handleProgress() {
    console.log('Video:handleProgress')
    const { buffered } = this.video
    if (buffered.length > 0) {
      this.setState({
        buffered: buffered.end(buffered.length-1)
      })
    }
  }
  handleDurationChange() {
    console.log('Video:handleDurationChange')
    
  }
  handleError() {
    const { url } = this.props;
    // $.ajax({
    //   url: url,
    //   dataType: 'jsonp',
    //   data: {
    //     f: 'jsonp'
    //   }
    // }).done(data => {
    //   if (data.errno == 0 && data.data) {
    //     this.video.src = data.data.url
    //   }
    // })
    fetch(url).then(response => response.json()).then(data => {
      if (data.errno == 0 && data.data) {
        this.video.src = data.data.url
      }
    })


  }
  handleSuspend() {
    console.log('Video:handleSuspend')
    
  }
  handleAbort() {
    console.log('Video:handleAbort')
    
  }
  handleEmptied() {
    console.log('Video:handleEmptied')
    
  }
  handleStalled() {
    console.log('Video:handleStalled')
    
  }
  handleLoadedMetaData() {
    const { currentTime, duration } = this.video
    this.setState({
      currentTime,
      duration
    })
  }
  handleLoadedData() {
    console.log('Video:handleLoadedData')
    
  }
  handleTimeUpdate() {
    if (this.state.skiping) return
    const { currentTime } = this.video
    this.setState({
      currentTime
    });
  }
  handleRateChange() {
    console.log('Video:handleRateChange')
    
  }
  handleVolumeChange() {
    console.log('Video:handleVolumeChange')
    
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  toggleMute(e) {
    if (this.state.muted) {
      this.video.muted = false;
    } else {
      this.video.muted = true;
    }
    this.setState(preState => {
      return {
        muted: !preState.muted
      }
    })
  }


  formatTime(time) {
    let _time = '';
    let hour = '';
    let minutes = '';
    let second = '';
    if (typeof time != 'number') return _time;
    if (time == 0) return 0;
    hour = parseInt(time / 3600, 10);
    minutes = parseInt(time % 3600 / 60, 10);
    second = parseInt(time % 60, 10);
    hour = hour > 0 ? hour + ':' : '';
    _time = hour + minutes + ':' + second;
    return _time
  }

  // 进度条拖动时鼠标按下事件
  handleProgressMouseDown(e) {
    // e.stoppropagation();
    // const marginLeft = e.target.style.marginLeft.splilt('px')[0]
    const durationDom = this.duration
    const clientRect = durationDom.getBoundingClientRect();
    console.log('Video-->onMouseDown',clientRect)
    const left = clientRect.left //- parseInt(marginLeft);
    const width = clientRect.width;
    this.setState({
      draging: true,
      skiping: true,
      minProgress: left,
      maxProgress: width + left
    })
    // return
    document.addEventListener('mousemove', this.eventProgressMouseMove)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.eventProgressMouseMove)
      this.video.currentTime = this.state.currentTime
      this.setState({
        draging: false,
        skiping: false
      })
    })
  }

  // 进度条拖动时鼠标拖动事件
  eventProgressMouseMove(e) {
    const state = this.state;
    let moveX = e.clientX;  
    let moveY = e.clientY;  
    let desX = 0;
    console.log('Video-->', moveX,moveY,state.minProgress,state.maxProgress)
    if(moveX < state.minProgress){  
      desX = 0 
    }else if(moveX > state.maxProgress){  
      desX = 1
    }else{  
      var percent = ((moveX - state.minProgress))/(state.maxProgress - state.minProgress);  
      desX = percent;
    } 
    this.setState({
      currentTime: state.duration*desX
    })
  }

  // 进度条点击事件
  handleProgressClick(e) {
    const state = this.state
    let percent = ((e.clientX - state.minProgress))/(state.maxProgress - state.minProgress);  
    let desTime = percent*state.duration;
    this.setState({
      currentTime: desTime
    }) 
    this.video.currentTime = desTime
  }

  handleSoundMouseOver(e) {
    this.setState({
      soundEnter: true,
      soundDisplay: true
    })
  }

  handleSoundMouseOut(e) {
    const shouldDisplay = this.state.sounding;
    this.setState({
      soundEnter: false,
      soundDisplay: shouldDisplay
    })
  }

  handleSoundMouseDown(e) {
    const soundDom = this.sound;
    const clientRect = soundDom.getBoundingClientRect();
    const top = clientRect.top;
    const height = clientRect.height;
    this.setState({
      draging: true,
      sounding: true,
      minSound: top,
      maxSound: height + top
    })
    document.addEventListener('mousemove', this.eventSoundMouseMove)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.eventSoundMouseMove)
      const shouldDisplay = this.state.soundEnter
      this.setState({
        draging: false,
        sounding: false,
        soundDisplay: shouldDisplay
      })
    })
  }

  eventSoundMouseMove(e) {
    const state = this.state;
    let moveX = e.clientX;  
    let moveY = e.clientY;  
    let desY = 0;
    if(moveY < state.minSound){
      desY = 1
    }else if(moveY > state.maxSound){ 
      desY = 0
    }else{  
      var percent = ((state.maxSound - moveY))/(state.maxSound - state.minSound);
      desY = percent;
    }
    this.setState({
      muted: false,
      sound: desY
    }) 
    this.video.volume = desY
  }

  handleSoundClick(e) {
    const soundDom = this.sound
    const clientRect = soundDom.getBoundingClientRect();
    const top = clientRect.top
    const height = clientRect.height;
    let percent = (height - e.clientY + top)/height;
    this.setState({
      sound: percent
    }) 
    this.video.volume = percent
  }

  handleFullScreen(e) {
    this.video.webkitRequestFullScreen();
  }

  render() {
    const { hasPlay, muted, sound, soundDisplay, preload, loop, autoPlay, currentTime, buffered, duration, playing, loading } = this.state;
    const progressPercent = currentTime/duration*100;
    const bufferedPercent = buffered/duration*100;
    const soundPercent = 100*sound;
    const soundClass = (muted || sound == 0) ? 'muted' : 'mute';
    const formatedCurrentTime = new Date(currentTime*1000).Format('mm:ss');
    const formatedDuration = new Date(duration*1000).Format('mm:ss');
    // const controlsTime = ;
    return (
      <div className="player"
        onMouseEnter={this.handleMouseEnter}>
        <video 
          controlsList="nodownload"
          className="video"
          width="100%" height="150px"
          ref={c => { this.video = c; }}
          muted={sound == 0}
          preload={preload}
          loop={loop}
          autoPlay={autoPlay}
          poster={ this.props.poster}
          // onClick={this.togglePlay}
          onLoadStart={this.handleLoadStart}
          onWaiting={this.handleWaiting}
          onCanPlay={this.handleCanPlay}
          onCanPlayThrough={this.handleCanPlayThrough}
          onPlaying={this.handlePlaying}
          onEnded={this.handleEnded}
          onSeeking={this.handleSeeking}
          onSeeked={this.handleSeeked}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onProgress={this.handleProgress}
          onDurationChange={this.handleDurationChange}
          onError={this.handleError}
          onSuspend={this.handleSuspend}
          onAbort={this.handleAbort}
          onEmptied={this.handleEmptied}
          onStalled={this.handleStalled}
          onLoadedMetadata={this.handleLoadedMetaData}
          onLoadedData={this.handleLoadedData}
          onTimeUpdate={this.handleTimeUpdate}
          onRateChange={this.handleRateChange}
          onVolumeChange={this.handleVolumeChange}>
          <source src={this.props.url}  type="video/mp4" />
        </video>
        <div className="controls">
          <div className="controls-main">
            <div 
              className={playing ? "pause" : "play"}
              onClick={this.togglePlay}>
            </div>
            <div className="progress-bar">
              <div className="duration"
                ref={r => this.duration = r}
                onClick={this.handleProgressClick}>
                <div className="buffered"
                  style={{
                    width: bufferedPercent + '%'
                  }}>
                </div>
                <div className="current"
                  style={{
                    width: progressPercent + '%'
                  }}>
                </div>
                <div className="dot"
                  style={{
                    left: progressPercent + '%'
                  }}
                  onMouseDown={this.handleProgressMouseDown}>
                </div>
              </div>
            </div>
            <div className="time">{formatedCurrentTime}/{formatedDuration}</div>
            <div className="sound"
              onMouseEnter={this.handleSoundMouseOver}
              onMouseLeave={this.handleSoundMouseOut}>
              <div className={ soundClass }
                onClick={this.toggleMute}>
              </div>
              <div className={ "sound-wrap" + (soundDisplay ? ' sound-wrap-show' : '')}>
                <div className="sound-progress"
                  ref={r => this.sound = r}
                  onClick={this.handleSoundClick}>
                  <div className="dot"
                    style={{
                      bottom: soundPercent + '%'
                    }}
                    onMouseDown={this.handleSoundMouseDown}>
                  </div>
                </div>
              </div>
            </div>
            <div className="fullscreen"
              onClick={this.handleFullScreen}></div>
          </div>

          <div className="controls-duration"
            style={{
              width: hasPlay ? '100%' : 0
            }}>
            <div className="controls-buffered"
              style={{
                width: bufferedPercent + '%'
              }}>
            </div>
            <div className="controls-current"
              style={{
                width: progressPercent + '%'
              }}></div>
          </div>
          
          { hasPlay ? null : (
            <div className="controls-time">
              {formatedDuration}
            </div>) }

          <div className="controls-loading"
            style={{
              display: loading ? 'block' : 'none'
            }}></div>

          <div className={playing ? "" : "controls-play"}
            onClick={this.togglePlay}></div>
        </div>
      </div>
    )
  }
}