import { prepareFetchData } from './body'

const SWITCH_CHANNEL = 'SWITCH_CHANNEL';

/**
 * 频道切换时
 * @cid: 目标频道的频道编号
 */
let switchChannel = cid => {
  return (dispatch, getState) => {
    let state = getState();
    console.log('actions:header-->', cid)
    dispatch({
      type: SWITCH_CHANNEL,
      payload: cid
    })
    // console.log('actions:header-->',isNoData(cid, state),cid == state.channels.currentChannel)
    if (isNoData(cid, state) || cid == state.getIn(['channels', 'currentChannel'])) {
      console.log('actions:header-->','isNoData')

      // 如目标频道没有任何数据，则触发数据请求
      dispatch(prepareFetchData(cid, 'refresh'))
    } 
  }
}

/**
 * 查看某频道下是否没有数据
 * @cid 所查频道编号
 * @state 数据容器
 */
let isNoData = (cid, state) => {
  // return state.contents.data[cid].data.length == 0;
  return state.getIn(['contents', 'data', cid, 'data']).size == 0
}

export {
  SWITCH_CHANNEL,

  switchChannel
}