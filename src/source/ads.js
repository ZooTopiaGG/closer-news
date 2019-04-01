/**
 * @authors liyue (liyue1-s@360.cn)
 * @date    2017-12-10 14:38:00
 * @version 1.0.0
 */

/**
 *广告类相关接口
 */
import NT from '../assets/common/native'
const url = 'https://show-g.mediav.com/s'; // 广告请求接口
const showid = 'k4CoEx'; // 广告showid

const normalW = 86; // 图片宽度
const normalH = 54; // 图片高度
  // MV广告接口
var defaults = {
  showid: 'k4CoEx',//广告对应的类别编号，实例化时必传参数
  type: 1,
  of: 4,
  newf: 1, //返回新的广告数据格式
  impct: 1, //请求的广告数量
  uid: NT.getMid(),
  mid: NT.getMid(),
  scheme: 'https',
  reqtimes: 1
}; 
// 广告数据请求
let getData = req => {
  req = $.extend({}, defaults, req);
  return $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonp: 'jsonp',
    timeout: 30000,
    data: req
  }).then(data => {
    return filterAdsData(data);
  }).catch(() => {
    // return filterAdsData(adsData);
    return []
  })
};
// 信息流广告数据处理
let filterAdsData = data => {
  var impurl = data.impurl,
    param = '',
    d = data.ads || [],
    len = 0,
    filteredData = [],
    str = [];
  while (len < d.length) {
    var item = d[len],
      dot;
    var _data = {};
    _data.imageW = normalW;
    _data.imageH = normalH;
    if (item.type == 2 && item.assets && item.assets.length) { //3张图集广告
      _data.assets = item.assets.slice(0, 3);
      _data.type = 'ads2';
    } else if (item.type == 3) { //单张大图广告
      _data.type = 'ads3';
      _data.imageW = '100%';
      _data.imageH = '100%';
    } else {
      _data.type = 'ads1';
    }
    _data.images = item.img.split('|'); //图片地址
    _data.newsType = 'ads';
    _data.adsTag = true;
    _data.title = item.title.toString().trim();
    _data.source = item.src;
    _data.url = item.curl || 'javascript:void(0);';
    _data.desc = item.desc;
    _data.imptk = item.imptk || [];
    _data.clktk = item.clktk || [];
    _data.clstk = item.clstk || [];
    _data.data_source = 'ads';
    filteredData.push(_data);
    if (len > 1) {
      dot = '.';
    } else {
      dot = '';
    }
    param += item.imparg + dot;
    len += 1;
  }
  // impurl && MV.setLog(impurl + param);
  return filteredData;
};

// 对外暴露的广告打点接口
let setLog = (data, type) => {
  let logs = [];
  const rid = 1;
  const tag = '不喜欢此广告';
  switch(type) {
    case 'show': 
      logs = data.imptk;
      break;
    case 'click':
      logs = data.clktk;
      break;
    case 'dislike':
      logs = data.clstk;
      break;
    default: break;
  }
  logs.forEach(log => {
    let img = new Image();
    if (type == 'dislike') {
      log = log.replace(/__DISLIKE_RULE_ID__/g,rid).replace(/__DISLIKE_TAG__/g,tag);
    } else if (type == 'click') {
      log = log.replace(/__EVENT_TIME_START__/g, window._timestamp_mousedown).replace(/__EVENT_TIME_END__/g, window._timestamp_mouseup);
    }
    img.src = log;
  })
}

export default { getData, setLog }