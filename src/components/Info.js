import React from 'react';
import Dislike from './Dislike';

/**
 * @description 新闻附带信息
 * @function Info
 */
export default props => {
  let { ads, date, source, dislike } = props
  return (
    <div className="info">
      {[
        ads ? <span className="ads-icon">广告</span> : null,
        date ? <span className="date">{date}</span> : null,
        source ? <span className="source" title={source}>{source}</span> : null,
        dislike ? <Dislike handleClick={dislike}/> : null
      ]}
    </div>
  )
}