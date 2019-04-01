import React from 'react'
import { connect } from 'react-redux'

/**
 * @description 页面头部功能按钮，该部分功能后由客户端实现，本组件废弃
 * @class Banner
 * @extends {React.Component}
 */
class Banner extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { title } = this.props;
    return (
      <div className='banner'>
        <span className='title'>{ title }</span>
        <a className='refresh'></a>
        <a className='setting'></a>
        <a className='lock'></a>
        <a className='close'></a>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.info
}

export default connect(mapStateToProps)(Banner)