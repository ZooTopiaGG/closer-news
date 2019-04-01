import React from 'react'
import Info from './Info';

/**
 * @description 无图新闻
 * @function News1
 */
export default props => {
  const { title, date, source, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title" title={title}>{title}</h1>
      <Info
        date={date}
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}