import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 单图新闻
 * @function News2
 */
export default props => {
  const { title, date, source, images, imageW, imageH, handleDislike } = props;
  return (
    <React.Fragment>
      <div className="left clearfix">
        <h1 className="title" title={title}>{title}</h1>
        <Img clsname="img-wrap"
          width={imageW}
          height={imageH}
          url={images[0]} />
      </div>
      <Info
        date={date}
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}