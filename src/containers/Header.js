import React from 'react'
import { connect } from 'react-redux'

import { switchChannel } from '../actions/header'
import { prepareFetchData } from '../actions/body'

// 页面头部频道部分
class Header extends React.Component {
  constructor(props) {
    super(props)

    // hover开始的定时器
    this.hoverTimer = null
    // 鼠标离开后的定时器，暂无对应的事件
    this.outTimer = null
    // 鼠标hover时间，hover时间达到目标时间后触发频道切换
    this.duration = 300;
    [
      'handleClick',
      'handleMouseEnter',
      'handleMouseLeave'
    ].forEach(key => this[key] = this[key].bind(this))
  }

  /**
   * @description 频道点击
   * @param {Event} e
   */
  handleClick(e) {
    let target = e.target;
    let cid = target.dataset['cid'];
    let cname = target.dataset['cname']
    this.props.onChannelClick(cid);
    let data = {
      pid: 'channels',
      c: cid,
      f: cname
    }
    _.setTTLog('click', data, e)
  }

  /**
   * @description 鼠标hover
   * @param {Event} e
   * @returns
   */
  handleMouseEnter(e) {
    let target = e.target;
    clearTimeout(this.outTimer);
    if (target.dataset['cid'] == this.props.currentChannel) return;
    this.hoverTimer = setTimeout(target.click.bind(target), this.duration)
  }

  /**
   * @description 鼠标离开
   * @param {Event} e
   */
  handleMouseLeave(e) {
    clearTimeout(this.hoverTimer);
    this.outTimer = setTimeout(() => {}, this.duration)
  }

  render() {
    const { currentChannel, display, data }  = this.props;
    return (
      <div className='header'
        style={{
          display: display ? 'block' : 'none'
        }}>
        <div className="wrap">
          { data.map((item, index) => {
            const { cid, cname } = item;
            const activeClassName = cid == currentChannel ? ' active' : '';
            return <div className="channel"
              key={index}>
              <a
                data-cid={cid}
                data-cname={cname}
                className={'title' + activeClassName}
                onClick={this.handleClick}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                { cname }
              </a>
            </div>
          }) }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.get('channels').toJS()
}

const mapDispatchToProps = dispatch => {
  return {
    onChannelClick : cid => {
      console.log('Header-->:', cid)
      dispatch(switchChannel(cid));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)