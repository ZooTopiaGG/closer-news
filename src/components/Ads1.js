import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 单图广告
 * @function Ads1
 */
export default props => {
  const { title, source, images, imageW, imageH, handleDislike } = props;
  return (
    <React.Fragment>
      <div className="left clearfix">
        <h1 className="title">{title}</h1>
        <Img clsname="img-wrap"
          width={imageW}
          height={imageH}
          url={images[0]} />
      </div>
      <Info
        ads
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}