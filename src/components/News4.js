import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 新闻图集类
 * @function News4
 */
export default props => {
  const { title, date, source, images, imageW, imageH, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title" title={title}>{title}</h1>
      <Img clsname="img-wrap"
        width={imageW}
        height={imageH}
        url={images[0]} />
      <Info
        date={date}
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}