import React from 'react'
import { connect } from 'react-redux'

import Header from './Header'
import Body from './Body'



/**
 * @description 主组件
 * @class App
 * @extends {React.Component}
 */
class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='main'>
        <Header />
        <Body />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(App)