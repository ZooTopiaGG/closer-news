import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 多图新闻
 * @function News3
 */
export default props => {
  const { title, date, source, images, imageW, imageH, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title" title={title}>{title}</h1>
      <div className="images">
        { images.map((img, index) => {
          return <Img clsname="img-wrap"
            width={imageW}
            height={imageH}
            key={index}
            url={img} />
        })}
      </div>
      <Info
        date={date}
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}