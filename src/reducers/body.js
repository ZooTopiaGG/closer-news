import * as actions from '../actions/body'
import Immutable from 'immutable'


/**
 * @description reducers：contents
 * @param {*} state
 * @param {*} action
 * @returns
 */
let contents = (state, action) => {
  let { type, payload } = action;
  switch(type) {
    case actions.REQUEST_BEGIN: {
      const { cid, type } = payload;
      // curChannelParams所处的位置
      let curChannelParamsIn = ['data', cid]
      let curChannelParams = state.getIn(curChannelParamsIn)
      let toggleRefresh = curChannelParams.get('toggleRefresh');
      if (type == 'refresh') {
        state = state.set('isRefreshing', true)
        curChannelParams = curChannelParams.set('toggleRefresh', !toggleRefresh)
      }
      curChannelParams = curChannelParams.set('isFetching', true)
      state = state.set('windowClosed', false)
      state = state.setIn(curChannelParamsIn, curChannelParams)
      return state
    };
    case actions.REQUEST_SUC: {
      let { cid, loadType, newsCount, adsCount, data, prePosition, currentCount } = payload;
      let curChannelParamsIn = ['data', cid]
      let curChannelParams = state.getIn(curChannelParamsIn);
      let isRefreshing = false;
      let showTopTip = false;
      let isFetching = false;
      let showBottomTip = false;
      let times = curChannelParams.get('times') + 1;
      let logData = curChannelParams.get('logData');
      let fetchTime = Date.now();
      data.forEach((item, index) => {
        const id = cid + '-' + times + '-' + index;
        item.id = id;
        logData = logData.push(id);
      })
      let curData = curChannelParams.get('data')
      let nextData = Immutable.fromJS(data)
      console.log('reducers-->suc', data)
      if (loadType == 'refresh') {
        showTopTip = true;
        curData = nextData.concat(curData)
      } else {
        currentCount == 0 && (showBottomTip = true);
        curData = curData.concat(nextData)
      }
      curChannelParams = curChannelParams.merge({
        isFetching,
        showTopTip,
        showBottomTip,
        currentCount,
        prePosition,
        adsCount,
        newsCount,
        times,
        fetchTime,
        logData,
        data: curData
      })
      state = state.merge({
        isRefreshing,
        showTopTip,
        showBottomTip
      })
      state = state.setIn(['data', cid], curChannelParams)
      return state
    };
    case actions.UPDATE_SHOW_LOG: {
      let { cid, logData } = payload;
      logData = Immutable.List(logData)
      state = state.setIn(['data', cid, 'logData'], logData)
      return state
    };
    case actions.REMOVE_DATA: {
      const { cid, id } = payload
      // curChannelData所处的位置，即state.data[cid].data
      let curChannelDataIn = ['data', cid, 'data']
      let curChannelData = state.getIn(curChannelDataIn)
      curChannelData = curChannelData.filterNot(item => item.get('id') == id)
      console.log('reducers:body-->',id)
      state = state.setIn(curChannelDataIn, curChannelData)
      return state
    };
    case actions.TRIGGER_HINT: {
      const { cid, bool } = payload
      // curChannelParams所处的位置
      let curChannelParamsIn = ['data', cid]
      let curChannelParams = state.getIn(curChannelParamsIn)
      if (!bool) {
        curChannelParams = curChannelParams.set('fetchTime', Date.now())
      }
      state = state.set('isHinting', bool)
      state = state.setIn(curChannelParamsIn, curChannelParams)
      return state;
    };
    case actions.HIDE_TOP_TIP: {
      // curParams所处的位置
      let curParamsIn = ['data', payload]
      let curParams = state.getIn(curParamsIn)
      curParams = curParams.set('showTopTip', false)
      state = state.setIn(curParamsIn, curParams)
      return state
    };
    case actions.CLOSE_WINDOW: {
      state = state.merge({
        windowClosed: true,
        isHinting: false
      })
      return state
    };
    default: return state;
  }
}

let fetchParams = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case actions.CLEAR_FETCH_PARAMS: {
      return state
    };
    default: return state;
  }
}
export default {
  fetchParams,
  contents
}