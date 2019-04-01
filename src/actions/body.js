import fetchData from '../source/fetchData'
const REQUEST_BEGIN = 'REQUEST_BEGIN'
const REQUEST_SUC = 'REQUEST_SUC'
const UPDATE_SHOW_LOG = 'UPDATE_SHOW_LOG'
const REMOVE_DATA = 'REMOVE_DATA'
const TRIGGER_HINT = 'TRIGGER_HINT'
const HIDE_TOP_TIP = 'HIDE_TOP_TIP'
const CLOSE_WINDOW = 'CLOSE_WINDOW'
const CLEAR_FETCH_PARAMS = 'CLEAR_FETCH_PARAMS'

/**
 * 准备数据请求
 * @cid 请求数据的频道
 * @loadType 数据加载的方式
 *  refresh: 刷新，数据加载到已有数据的上方,
 *  loadmore: 加载更多，数据拼接到已有数据的下方
 */
let prepareFetchData = (cid, loadType) => {
  return (dispatch, getState) => {
    const state = getState();

    // 如当前频道正在请求，则放弃本次请求
    if (!cid || state.getIn(['contents', 'data', cid, 'isFetching'])) return;

    // 开始请求
    dispatch(requestData(cid, loadType));

    // 隐藏更新提示条
    dispatch(triggerHint(cid, false));
    return fetchData(cid, loadType, state.toJS()).then(data => {
      data = Object.assign({
        cid: cid,
        loadType: loadType
      }, data)
      dispatch(receiveData(data));
      dispatch(clearFetchParams());
    })
  }
}

/**
 * 开始发送异步请求
 * @cid 请求数据的频道
 * @type 数据加载的方式
 *  refresh: 刷新，数据加载到已有数据的上方,
 *  loadmore: 加载更多，数据拼接到已有数据的下方
 */
let requestData = (cid, type) => {
  return {
    type: REQUEST_BEGIN,
    payload: { cid, type }
  }
}

/**
 * 异步请求后返回数据
 * @data 返回的数据
 */
let receiveData = data => {
  return {
    type: REQUEST_SUC,
    payload: data
  }
}

/**
 * 删除保存的请求参数，防止下次请求时带入
 */
let clearFetchParams = () => {
  return {
    type: CLEAR_FETCH_PARAMS
  }
}

/**
 * 更新曝光打点记录的id，已经曝光过就删除，防止进行二次曝光打点
 * @cid 目标频道
 * @logData 新的未曝光的数据id集合
 */
let updateShowLog = (cid, logData) => {
  return {
    type: UPDATE_SHOW_LOG,
    payload: {
      cid,
      logData
    }
  }
}

/**
 * 删除某一条数据（不感兴趣后移除）
 * @cid 数据所在频道
 * @id 数据对应的id
 */
let removeDataById = (cid, id) => {
  return {
    type: REMOVE_DATA,
    payload: {
      cid,
      id
    }
  }
}

/**
 * 是否显示“有新内容提示条，点击刷新”
 * @cid 目标频道
 * @bool {boolean} 是否显示
 */
let triggerHint = (cid, bool) => {
  return {
    type: TRIGGER_HINT,
    payload: { cid, bool }
  }
}

/**
 * 隐藏提示条[暂无更新，本次加载n条数据]
 * @cid 目标频道
 */
let hideTopTip = cid => {
  return {
    type: HIDE_TOP_TIP,
    payload: cid
  }
}

/**
 * 窗口关闭
 */
let closeWindow = () => {
  return {
    type: CLOSE_WINDOW
  }
}

export {
  prepareFetchData,
  requestData,
  receiveData,
  updateShowLog,
  removeDataById,
  triggerHint,
  hideTopTip,
  closeWindow,

  UPDATE_SHOW_LOG,
  REMOVE_DATA,
  REQUEST_BEGIN,
  REQUEST_SUC,
  TRIGGER_HINT,
  HIDE_TOP_TIP,
  CLOSE_WINDOW,
  CLEAR_FETCH_PARAMS
}