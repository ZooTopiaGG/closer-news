import React from 'react'

/**
 * @description 不感兴趣组件
 * @function Dislike
 */
export default props => {
  const handleDislike = e => {
    e.preventDefault();
    e.stopPropagation();
    props.handleClick();
  }

  return (
    <div className="dislike"
      onClick={handleDislike}>
      <span className="dislike-desc">不感兴趣</span>
      <i className="dislike-icon"></i>
    </div>
  )
}