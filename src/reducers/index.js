import { combineReducers } from 'redux-immutable'

import header from './header'
import body from './body'

/**
 * 合并所有reducers
 * 因项目中用到了immutable.js，故combineReducers用的是redux-immutable
 */
export default combineReducers(
  Object.assign(
    header,
    body
  )
)