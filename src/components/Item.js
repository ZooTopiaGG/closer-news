import React from 'react'
import News1 from './News1'
import News2 from './News2'
import News3 from './News3'
import News4 from './News4'
import News5 from './News5'
import News6 from './News6'
import Ads1 from './Ads1'
import Ads2 from './Ads2'
import Ads3 from './Ads3'
import Media from './Media'
import NT from '../assets/common/native'

/**
 * @description 判断数据类型
 * @function Item
 */
export default props => {
  let _item = null;
  const { data, doClick, doDislike } = props;

  function handleClick(e) {
    e.preventDefault();
    if (!/https?/.test(data.url)) {
      return;
    }
    const _data = Object.assign({}, data)
    // 广告落地url替换宏，详见http://pages.juxiao.mediav.com/mdoc/pc_api/HTML/SceneWindowClientDockingDoc/#toc31__anchor
    if (_data.newsType == 'ads') {
      let rect = _item && _item.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      let urls = [data.url, ...data.clktk].join(' ');
      urls = urls.replace(
        /__EVENT_TIME_START__/g, 
        window._timestamp_mousedown
      ).replace(
        /__EVENT_TIME_END__/g, 
        window._timestamp_mouseup
      ).replace(
        /__OFFSET_X__/g,
        x
      ).replace(
        /__OFFSET_Y__/g,
        y
      ).split(' ');
      _data.url = urls[0]
      _data.clktk = urls.slice(1);
    }
    console.log(_data)
    // 在新标签页中打开url
    NT.openUrl(_data.url)
    // 执行打点的逻辑
    doClick(_data, e)
  }

  function handleDislike(e) {
    doDislike(data)
  }

  let ComponentItem = null;
  switch(data.type) {
    case 'news1':
      ComponentItem = News1;break;
    case 'news2':
      ComponentItem = News2;break;
    case 'news3':
      ComponentItem = News3;break;
    case 'news4':
      ComponentItem = News4;break;
    case 'news5':
      ComponentItem = News5;break;
    case 'news6':
      ComponentItem = News6;break;
    case 'ads1':
      ComponentItem = Ads1;break;
    case 'ads2':
      ComponentItem = Ads2;break;
    case 'ads3':
      ComponentItem = Ads3;break;
    case 'media':
      ComponentItem = Media;break;
    default: 
      ComponentItem = null;break;
  }
  if (ComponentItem) {
    return (
      <a id={data.id}
        ref={r=>_item=r}
        className={"list " + data.type}
        href={data.url}
        onClick={handleClick}>
        <ComponentItem 
          handleDislike={handleDislike}
          { ...data }/>
      </a>
    )
  } else {
    return null
  }
}
