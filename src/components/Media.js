import React from 'react'
import Video from './Video'
const errPic = require('../assets/imgs/error.png');

/**
 * @description 视频类新闻
 * @function Media
 */
export default props => {
  let _img = null;
  const { id, title, icon, source, url, images, video } = props;
  function handleClick(e) {

  }

  function handleDislike(e) {
    // e.stopPopugation();
  }

  function handleError() {
    _img.src = errPic;
  }

  return (
    <div id={id}
      className="list media"
      // href={url}
      onClick={handleClick}>

      <h1 className="title">{title}</h1>
      
      <div className="media-wrap">
        <Video 
          url={video.url} 
          poster={images[0]}/>
      </div>
      <div className="info">
        <div className="user-icon">
          <img className="user-img" 
          src={icon} 
          ref={r => _img = r}
          onError={handleError}/>
        </div>
        <span className="source" title={source}>{source}</span>
        <div className="dislike"
          onClick={handleDislike}>
          <span className="dislike-desc">不感兴趣</span>
          <i className="dislike-icon"></i>
        </div>
      </div>
    </div>
  )
}