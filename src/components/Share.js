import React from 'react'

/**
 * @description 分享组件（未完成，暂无用）
 * @export
 * @class Share
 * @extends {React.Component}
 */
export default class Share extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="share">
        <a className="share-icon"
          onMouseEnter={this.handleMouseEnter}>
        </a>
        <div className="share-wrap"
          style={{
            display: this.state.display
          }}>
          <div className="share-list">
            <a className="share-wx"
              onClick={this.handleWXClick}></a>
            <a className="share-wb"
              onClick={this.handleWBClick}></a>
            <a className="share-qzone"
              onClick={this.handleQzoneClick}></a>
            <a className="share-qq"
              onClick={this.handleQQClick}></a>
          </div>
        </div>
        <div className="share-qrcode">

        </div>
      </div>
    )
  }
}