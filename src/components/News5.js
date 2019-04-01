import React from 'react'
import Info from './Info'

/**
 * @description 段子
 * @function News5
 */
export default props => {
  const { duanzi, source, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title">{duanzi}</h1>
      <Info
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}