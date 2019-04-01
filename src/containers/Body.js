import React from 'react'
import { connect } from 'react-redux'

import Content from '../components/Content' 
import { prepareFetchData, updateShowLog, triggerHint, removeDataById, hideTopTip, closeWindow } from '../actions/body'

/**
 * @description 页面内容部分
 * @class Body
 * @extends {React.Component}
 */
class Body extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggleResize: false
    }
    // 锁定时间间隔
    this.fetchInterval = 2e3

    // 注册防抖动的doFetchData
    this.doFetchData = _.debounce(props.doFetchData, this.fetchInterval, {
      leading: true,
      trailing: false
    });
    [
      'handleRefresh',
      'handleResize'
    ].forEach(key => this[key] = this[key].bind(this))
  }

  componentDidMount() {
    const { channels, contents, doFetchData } = this.props
    const cid = channels.currentChannel;

    // 页面首次加载时触发一次数据请求
    this.doFetchData(cid, 'refresh')

    // 注册客户端接口
    _.registerNativeInterface({
      refresh: () => this.doFetchData(this.props.channels.currentChannel, 'refresh'),
      close: () => this.props.closeWindow()
    })

    // 每隔30s查看是否需要显示“有数据更新”提示条
    setInterval(() => {
      // console.log(this.props.contents.windowClosed)
      !this.props.contents.windowClosed && this.checkTips()
    },3e4)

    // 窗口resize事件
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  /**
   * @description 页面resize的时候触发
   */
  handleResize() {
    this.setState(preState => {
      return {
        toggleResize: !preState.toggleResize
      }
    })
  }

  /**
   * @description 刷新按钮事件
   */
  handleRefresh() {
    const cid = this.props.channels.currentChannel
    this.doFetchData(cid, 'refresh')
  }

  /**
   * @description 提示条
   */
  checkTips() {
    const cid = this.props.channels.currentChannel
    const switchTime = this.props.channels.switchTime
    const { isHinting } = this.props.contents
    const { fetchTime } = this.props.contents.data[cid]
    const time = Date.now() - Math.max(switchTime, fetchTime);
    if (time >= 4.2e5 && !isHinting) {
      this.props.triggerHint(cid, true)
    }
  }

  render() {
    const { channels, contents } = this.props;
    const displayHint = contents.isHinting && !contents.windowClosed
    return (
      <div className="body" ref="body">
        <Hinting 
          display={displayHint}
          handleRefresh={this.handleRefresh} />
        <div className="wrapper">
          {channels.data.map((item, index) => {
            const cid = item.cid;
            const display = cid == channels.currentChannel;
            const content = contents.data[cid];
            return <Content 
              key={index}
              updateShowLog={this.props.doDeleteLog}
              isRefreshing={contents.isRefreshing}
              fetchData={this.doFetchData}
              triggerHint={this.props.triggerHint}
              removeDataById={this.props.doRemoveDataById}
              hideTopTip={this.props.doHideTopTip}
              display={display}
              switchTime={channels.switchTime}
              toggleResize={this.state.toggleResize}
              channel={item}
              content={content}/>
          })}
        </div>
      </div>
    )
  }
}

/**
 * @description 提示条，定义为无状态组件
 * @param {object} props
 * @returns <Pure Component>
 */
const Hinting = props => {
  const { display, handleRefresh } = props
  return (
    <div className="hinting"
      style={{
        display: display ? 'block' : 'none'
      }}>
      <div className="hinting-wrap">
        您有未读新闻，
        <a className="hinting-link"
          onClick={handleRefresh}>点击查看</a>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return state.toJS()
}

const mapDispatchToProps = dispatch => {
  return {
    doFetchData: (cid, type) => {
      dispatch(prepareFetchData(cid, type))
    },
    doDeleteLog: (cid, logData) => {
      dispatch(updateShowLog(cid, logData))
    },
    doRemoveDataById: (cid, id) => {
      dispatch(removeDataById(cid, id))
    },
    triggerHint: (cid, bool) => {
      dispatch(triggerHint(cid, bool))
    },
    doHideTopTip: cid => {
      dispatch(hideTopTip(cid))
    },
    closeWindow: () => {
      dispatch(closeWindow())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)