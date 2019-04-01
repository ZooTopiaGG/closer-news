import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 多图广告
 * @function Ads2
 */
export default props => {
  const { title, source, imageW, imageH, assets, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title">{title}</h1>
      <div className="images">
        { assets.map((item, index) => {
          return <Img clsname="img-wrap"
            width={imageW}
            height={imageH}
            key={index}
            url={item.img} />
        })}
      </div>
      <Info
        ads
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}