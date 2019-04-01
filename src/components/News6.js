import React from 'react'
import Img from './Img'
import Info from './Info'

/**
 * @description 搞笑频道数据
 * @function News6
 */
export default props => {
  const { title, source, images, imageW, imageH, gif, handleDislike } = props;
  return (
    <React.Fragment>
      <h1 className="title" title={title}>{title}</h1>
      <Img clsname="img-wrap"
        width={imageW}
        height={imageH}
        url={images[0]} 
        gif={gif} />
      <Info
        source={source}
        dislike={handleDislike}
      />
    </React.Fragment>
  )
}