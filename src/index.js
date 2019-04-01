import './assets/common/monitor_analytic'
import './assets/common/se_monitor'
import 'lodash'
import './assets/common/init'
import './assets/style/index.scss'

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import initState from './initState'
import App from './containers/App'
import reducers from './reducers/index'

let store = createStore(
  reducers,
  initState,
  applyMiddleware(thunkMiddleware)
)

let listener = store.subscribe(() => {
  console.log(`********* New State *********`)
  console.log(store.getState().toJS())
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
