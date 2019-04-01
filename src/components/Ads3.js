import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 大图广告
 * @function Ads3
 */
export default props => {
  const { title, source, images, imageW, imageH, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title">{title}</h1>
      <Img clsname="img-wrap"
        width={imageW}
        height={imageH}
        url={images[0]} />
      <Info
        ads
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}