import NT from '../assets/common/native'

import newsData from '../assets/data/news.json'
import videoData from '../assets/data/video.json'

const imgWidth = 268;
const normalW = 88;
const normalH = 56;

const dataUrl = 'https://mini.browser.360.cn/feed/list';
const logUrl_jrbd = ['https://news.qhstatic.com/srv/c2', 'https://api.look.360.cn/srv/c', 'https://api.look.360.cn/srv/c2']
const logUrl_so = 'https://s.qhupdate.com/so/click.gif';
const log_options_jrbd = {
  //用户唯一标识，浏览器端等于mid
  uid: NT.getMid(),
  //渠道名称，由look方提供
  sign: '360_a0ab86ec',
  market: 'sidenews',
  //客户端版本，等于浏览器客户端版本
  version: NT.getVersion(),
  //设备类型，0为安卓，1为iOS，2为PC 
  device: '2',
  //网络类型1(2G), 2(3G), 3(4G), 4(WIFI), 5(其他)
  net: 5,
  stype: 'portal',
  t: '',
  //当前展现数据所属频道
  channel: '',
  sqid: 1,
  //场景标识，同一个渠道下可用来区分不同的新闻展现场景
  scene: 'tab_home',
  sub_scene: '',
  refer_scene: '',
  refer_subscene: '',
  sid: ''
};
const log_options_so = {
  mod: 'news-flow',
  q: '',
  mid: NT.getMid()
};

let getData = (cid, state) => {
  const times = state.contents.data[cid].times;
  let data = {
      mid: NT.getMid(),
      channel: cid, // 频道编号
      page: times, // 请求的次数
      ref_title: state.fetchParams.refer_title, // 外链打开侧边栏时该网页的title
      ref_url: state.fetchParams.refer_url, // 外链的url
      page_size: 10, // 单词请求的数量
      scene: 'side_bar' //侧边栏的唯一标示
    }
  // ajax返回的是一个promise对象
  return $.ajax({
    url: dataUrl,
    type: 'get',
    dataType: 'jsonp',
    jsonp: 'cb',
    timeout: 30000,
    // jsonpCallback: 'jquery_cb',  //测试用
    data: data
  }).then(data => {
    // if (cid == 'video') {
    //   let _data = filterNewsData(videoData, cid, times);
    //   return _data
    // }
    return filterNewsData(data, cid, times)
  }).catch(() => {
    // return filterNewsData(newsData, cid, times);
    return []
  })

  // return fetch(dataUrl + '?' + _.parseParam(data))
  //   .then(response => response.json()).then(data => {
  //     return filterNewsData(data, cid, times)
  //   }).catch(() => {
  //     // return filterNewsData(newsData, cid, times);
  //     return []
  //   })
}

// 新闻数据处理
let filterNewsData = (data, cid, times) => {
  var _log = [],
    _data = [],
    len = 0;
  if (data.code != 0 || !data.data) return _data;
  var res = data.data || [];
  len = res.length;
  for (var i = 0; i < len; i++) {
    var item = res[i],
      _imgs = [],
      _item = {};
    if (!item.title) continue;
    item.ext = item.ext || {};
    _item.pageno = times;
    _item.images = item.imgs || [];
    _item.gif = item.ext.gif && item.ext.gif.url;
    _item.duanzi = item.ext.duanzi && item.ext.duanzi.text;
    _item.video = item.ext.video || {};
    _item.title = item.title || '';
    _item.url = item.url || "javascript:void(0);";
    _item.source = item.from || '';
    _item.data_source = item.feed_from || 'news';
    
    _item.icon = item.icon || '';
    _item.date = item.time ? _.getTimeFromNow(item.time * 1000) : '';
    _item.newsType = 'news';

    if (_item.data_source == 'jrbd') {
      _item.log = item.ext.jrbd_dot || {};
      _item.log.url = _item.log.u;
    } else if (_item.data_source == 'so_flow_hot') {
      _item.log = item.ext.so_dot || {};
    }

    if (_item.images.length >= 3) {
      _item.type = 'news3';
      _item.log.style = 6;
      _item.images.splice(3);
    } else if (_item.images.length >= 1 && _item.images[0] != '') {
      _item.type = 'news2';
      _item.log.style = 3;
      _item.images.splice(1);
    } else {
      _item.type = 'news1';
      _item.log.style = 4;
      _item.images = [];
    }
    if (cid == 'video') {
      _item.type = 'media';
      _item.log.style = 5;
      if (_item.video.url == '') {
        _item = null;
      }
    } else if (cid == 'funny') {
      _item.type = 'news6';
      _item.log.style = 1;
      if (_item.duanzi != '') {
        _item.type = 'news5'
        _item.log.style = 4;
      }
    } else if (cid == 'pictures') {
      _item.type = 'news4'
      _item.log.style = 1;
    }

    let desImages = [];
    let imgW = 0;
    let imgH = 0;
    let desH = 0;
    let desUrl = '';
    let desSize = null;
    _item.images.forEach(img => {

      // 根据不同新闻类型，处理不同尺寸
      switch(_item.type) {
        case 'news6': {
          const size = _.getQueryObject(img).size || '';
          const wh = size.split('x');
          if (wh[0] && wh[1]) {
            desH = wh[1]*imgWidth/wh[0]
          }
          imgW = imgWidth;
          imgH = desH;
          desSize = '';
          break;
        };
        case 'news4': {
          const size = _.getQueryObject(img).size || '';
          const wh = size.split('x');
          if (wh[0] && wh[1]) {
            desH = wh[1]*imgWidth/wh[0]
          }
          desH = desH > 300 ? 300 : desH;
          imgW = imgWidth;
          imgH = desH;
          desSize = imgW + '_' + imgH + '_';
          break;
        };
        default: {
          imgW = normalW;
          imgH = normalH;
          desSize = imgW + '_' + imgH + '_';
        }
      }
      desUrl = _.setImgUrl(img, desSize);
      desImages.push(desUrl);
    })
    _item.imageW = imgW;
    _item.imageH = imgH;
    _item.images = desImages;
    _item && _data.push(_item);
    // _data[_item.id] = _item;
    // _log.push(_item.log);
  }
  // this.req.view.log && this.setLog(_log, 'show');
  return _data
}

// 爆点数据的展现打点
let setShowLog = (data = []) => {
  let pack = [];
  let logs = Object.assign({}, log_options_jrbd);
  data.forEach(item => {
    let log = item.log || {};
    logs.channel = log.channel;
    pack.push([
      log.gnid || '',
      log.a,
      log.c,
      '',
      log.s,
      log.style,
      '2000',
      log.sid || ''
    ])
  });
  logs.t = Date.now();
  logs.act = 'real_show';
  logs.func = 'pc_news_realshow';
  logs.n = pack.length;
  logs.url_pack = encodeURIComponent(JSON.stringify(pack));
  $.ajax({
    url: logUrl_jrbd[0],
    dataType: 'jsonp',
    data: logs
  })
}

let jrbdLog = (data, type) => {
  let url = '';
  let logs = Object.assign({}, log_options_jrbd, data.log);
  logs.t = Date.now();
  if (type == 'show') {
    setShowLog(data)
  } else {
    switch (type) {
      case 'click':
        url = logUrl_jrbd[1];
        logs.act = type;
        break;
      case 'dislike':
        url = logUrl_jrbd[2];
        logs.act = 'click';
        logs.func = 'dislike';
        break;
      default:
        break;
    }
    // _.jsonp(url + '?' + _.parseParam(logs))
    $.ajax({
      url: url,
      dataType: 'jsonp',
      data: logs
    })
  }
}

// 搜索数据的打点
let soLog = (data, type) => {
  let log = Object.assign({}, log_options_so);
  if (type == 'show') {
    log.type = 'test-news-visible'
    data.forEach(item => {
      log.pageno = item.pageno;
      log.p3 = item.log.tc_show;
      log.random = Math.random();
      setSoLog(log)
    })
  } else {
    log.type = type == 'click' ? 'flow-click' : 'close'
    log.pageno = data.pageno;
    log.p3 = data.log.tc_value;
    log.url = data.url;
    log.random = Math.random();
    setSoLog(log)
  }
}

let setSoLog = data => {
  _.setGifLog(logUrl_so + '?' + _.parseParam(data))
}

// 对外暴露的打点接口，根据source打对应的点
let setLog = (data, type) => {
  let source = Array.isArray(data) ? data[0] && data[0].data_source : data.data_source;
  if (source == 'jrbd') {
    jrbdLog(data, type)
  } else if (source == 'so_flow_hot') {
    soLog(data, type)
  }
}

export default {
  getData,
  setLog
};