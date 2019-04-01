import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import QueueAnim from 'rc-queue-anim';

import NEWS from '../source/news'
import ADS from '../source/ads'

import Item from './Item'

/**
 * @description 某个频道的数据内容
 * @class Content
 * @extends {React.Component}
 */
export default class Content extends React.Component {
  constructor(props) {
    super(props)

    // 页面是否resize过
    this.resized = false
    // 触发滚动
    this.toggleRefresh = false
    // 滚动锁定持续时间
    this.duration = 500
    // 滚动条当前滚动高度
    this.currentScrollTop = 0;
    [
      'handleMouseScroll',
      'triggerMouseScroll',
      'handleClick',
      'handleDislike'
    ].forEach(key => this[key] = this[key].bind(this))
    // 注册节流函数，防止滚动时频繁触发事件
    this.doMouseScroll = _.throttle(this.triggerMouseScroll, this.duration);
  }

  componentWillReceiveProps(nextProps) {
    // 前后两次toggleResize值不相等，则说明resize事件发生
    this.resized = nextProps.toggleResize == this.props.toggleResize ? false : true;
    // 在shouldComponentUpdate中拦截了display为false的render，所以提前在这里控制content是否显示
    this.wrap.style.display = nextProps.display ? 'block' : 'none';
  }

  shouldComponentUpdate(nextProps) {
    // 当前频道没显示时不做处理
    return !!nextProps.display
  }

  componentDidUpdate(preProps, preState) {
    const { toggleRefresh, showTopTip, showBottomTip } = this.props.content;
    // 前后toggleRefresh值不相等，则说明触发刷新
    // this.triggerMouseScroll();
    if (toggleRefresh != this.toggleRefresh) {
      // 刷新时数据加载到最上方，故滚动条位置应该到最上方
      this.wrap.scrollTop = 0;
      // _.scrollToTop(this.wrap);
      this.toggleRefresh = toggleRefresh;
    }
    if (showTopTip) {
      // 如果显示“加载了n条数据”提示条，则2s后自动隐藏
      setTimeout(() => {
        this.props.hideTopTip(this.props.channel.cid)
      },2e3)
    } else if (this.resized || !showBottomTip) {
    // } else if (this.resized) {
      // 如果页面resize了，或者不显示底部提示条，则触发滚动事件，目的是重新计算数据是否曝光
      console.log('triggerMouseScrol-----2');
      this.doMouseScroll()
    }
  }

  /**
   * @description 数据请求
   * @param {String} type refresh/loadMore
   */
  doFetchData(type) {
    this.props.fetchData(this.props.channel.cid, type)
  }

  /**
   * @description 数据点击
   * @param {Object} data
   * @param {Event} e
   */
  handleClick(data, e) {
    const type = 'click';
    let _data = {
      pid: 'channel-'+this.props.channel.cid,
      c: data.title,
      f: data.url,
      data_source: data.data_source
    }

    // 第三方点击打点，包括爆点打点和mv打点
    this.doSetLog(data, type);

    // tt打点
    _.setTTLog(type, _data, e)
  }

  /**
   * @description 内容滚动事件
   * @param {Event} e
   */
  handleMouseScroll(e) {
    const { scrollTop } = e.target
    const { currentScrollTop } = this
    // 每次滚动都记录滚动的位置
    this.currentScrollTop = scrollTop
    // 如果页面是向上滚动，则返回
    if (currentScrollTop > scrollTop) return;
    this.doMouseScroll()
  }

  /**
   * @description 滚动页面时，到底部触发请求；实时检测是否曝光打点
   */
  triggerMouseScroll() {
    const { channel, content, display } = this.props
    if (!display) return
    // logData存储的是还未曝光的页面元素id
    let { logData, data } = content;
    let hasLog = false;
    let newsLogs = [];
    const type = 'show'
    const cid = channel.cid;
    const contentDom = this.content;
    const winHeight = document.documentElement.offsetHeight;
    const { top, height } = contentDom.getBoundingClientRect();
    console.log('Content:triggerMouseScroll-->',cid,top,height, winHeight)
    
    // 滚动到底部时触发新闻请求
    if ((top + height) <= (winHeight + 5) && height > winHeight) {
      this.doFetchData('loadMore')
    }
    
    // 滚动时检测是否需要曝光打点
    logData.forEach((id, index) => {
      const itemEl = document.querySelector('#' + id);
      const itemTop = itemEl && itemEl.getBoundingClientRect().top;
      
      // 距离页面顶部的距离小于页面高度，说明已经出现在用户视野内，或者在用户视野内出现过
      if (itemTop < winHeight) {
        // console.log('Content:logData-->', id, itemTop)
        
        console.log('triggerMouseScrol-----',id);
        // 找出准备曝光的数据
        const desData = data.find(item => item.id == id)

        // 数据源定向打点，即给第三方打点
        logData.splice(index,1)
        hasLog = true;
        if (desData.newsType == 'ads') {
          this.doSetLog(desData, type)
        } else if (desData.newsType == 'news'){
          newsLogs.push(desData);
        }
        // tt打点
        let _data = {
          pid: 'channel-'+cid,
          c: desData.title,
          f: desData.url,
          data_source: desData.data_source
        }
        _.setTTLog('track', _data)
      }
    })
    newsLogs.length && NEWS.setLog(newsLogs, type)
    // 有进行打点，则更新state中的logData，防止重复打点
    hasLog && this.props.updateShowLog(cid, logData);
  }

  /**
   * @description 不感兴趣点击事件
   * @param {Event} data
   */
  handleDislike(data) {
    const type = 'dislike';
    this.props.removeDataById(this.props.channel.cid, data.id)
    this.doSetLog(data, type)
  }

  /**
   * @description 第三方打点
   * @param {Object} data
   * @param {String} type
   */
  doSetLog(data, type) {
    if (data && data.newsType == 'news') {
      NEWS.setLog(data, type)
    } else if (data && data.newsType == 'ads') {
      ADS.setLog(data, type)
    }
  }

  render() {
    const { display, channel, content, isRefreshing } = this.props;
    const { data, showTopTip, currentCount, showBottomTip } = content;
    
    const bottomTip = showBottomTip ? (
      <div className="tip-bottom">
          暂无更新，请稍后再试
      </div>) : null;
    return (
      <div className="container"
        ref={r => this.wrap = r}
        onScroll={this.handleMouseScroll}>
        <Tips className="tip-top"
          currentCount={currentCount}
          showTopTip={showTopTip} />
        <Loading 
          isRefreshing={isRefreshing} />
        <div className="content"
          ref={r => this.content = r}
          data-cid={channel.cid}>
          <QueueAnim component="div" 
            duration="300"
            interval="50"
            animConfig={[
              { opacity: [1, 0]},
              { opacity: [1, 0], translateX: [0, -50] }
            ]}>
            { data.map((item, index) => {
              return <Item 
                key={item.id}
                data={item} 
                doClick={this.handleClick}
                doDislike={this.handleDislike}/>
            })}
            </QueueAnim>
          {bottomTip}
        </div>
      </div>
    )
  }
}

// 数据加载时的Loading组件
const Loading = props => {
  const display = props.isRefreshing ? 'block' : 'none'
  return (
    <div className="loading"
      style={{display}}>
      <i className="icon"></i>
      <span className="msg">推荐中</span>
    </div>
  )
}

// 数据加载完后的Tips提示组件
const Tips = props => {
  const { currentCount, showTopTip, className } = props
  const countTip = currentCount > 0 ? `为您推荐了${currentCount}条内容` : `暂无更新，请稍后再试`;
  return (
    <ReactCSSTransitionGroup
      component="div"
      transitionName="tip-animaition"
      transitionAppear={true}
      transitionEnter={false}
      transitionLeave={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      { 
        showTopTip ? (
        <div className={className}>
          {countTip}
        </div>) : null
      }
    </ReactCSSTransitionGroup>
  )
}
