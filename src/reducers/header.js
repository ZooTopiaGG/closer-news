import { SWITCH_CHANNEL, CLEAR_FETCH_PARAMS } from '../actions/header'


/**
 * @description reducers：channels
 * @param {*} state
 * @param {*} action
 * @returns
 */
let channels = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SWITCH_CHANNEL: {
      console.log('reducers:header-->', state)
      const switchTime = state.get('currentChannel') == payload ? state.get('switchTime') : Date.now()
      state = state.merge({
        currentChannel: payload,
        switchTime
      })
      return state
    };
    default: return state;
  }
}

export default {
  channels
}