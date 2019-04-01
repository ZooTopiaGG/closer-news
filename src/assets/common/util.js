// import jsonp from 'jsonp';
import NT from './native';
const util = {};

// localStorage存取
util.storage = {
  get(key) {
    try {
      return JSON.parse(localStorage[key] || '{}');
    } catch (e) {
      return {};
    }
  },
  set(key, subkey, val) {
    var data = this.get(key);
    data[subkey] = val;
    this.setData(key, data);
  },
  setData(key, data) {
    localStorage[key] = JSON.stringify(data);
  }
};

// 版本比较，ver1 >= ver2返回true
util.isNewer = (ver1, ver2) => {
  if (!ver1 || !ver2) return false;
  let arr1 = ver1.split('.'),
    arr2 = ver2.split('.'),
    len = Math.max(arr1.length, arr2.length),
    val;
  for (let i = 0; i < len; i++) {
    let num1 = parseInt(arr1[i]) || 0,
      num2 = parseInt(arr2[i]) || 0;
    if (num1 > num2) {
      return true;
    } else if (num1 < num2) {
      return false;
    }
  }
  return true;
};

// 版本比较，ver1 <= ver <= ver2返回true
util.compareVersion = (ver1, ver, ver2) => {
  var bool = false;
  if (!ver1 || !ver) {
    return false;
  }
  ver = parseInt(ver.replace(/\./g, ''));
  ver1 = parseInt(ver1.replace(/\./g, ''));
  ver2 = ver2 ? parseInt(ver2.replace(/\./g, '')) : Number.MAX_VALUE;
  bool = (ver >= ver1 && ver <= ver2) ? true : false;
  return bool;
};

// 获取url参数字典数据
util.getQueryObject = (url) => {
  url = url == null ? window.location.href : url;
  let params = url.match(/([^?=&]+)(=([^&]*))/g);
  return params ? params.reduce(
    (a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {}
  ) : {};
};

// 对来自图床的图片url再处理，以满足正常需求的尺寸，url为原始地址，size为目标尺寸（格式为width_height_，例如160_90_）
util.setImgUrl = (url, size) => {
  size = size || '';
  if (!/qh((img[0-4]?)|(msg))\.com/.test(url)) return url;
  const exp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  const sizeExp = /^[0-9_]+$/;
  const path = url.match(exp)[5].split('/');
  if (path.length >= 3 && sizeExp.test(path[1])) {
    const originSize = (size ? '' : '/' + path[0] + '/') + path[1];
    return url.replace(originSize, size);
  } else {
    return url;
  }
};

// 根据给定时间戳，返回距离当前时间点的时间
util.getTimeFromNow = (time) => {
  var diff = (Date.now() - time) / 1000,
    subStr = '前',
    backStr = '';
  if (diff < 60) {
    backStr = '刚刚';
  } else if (diff < 3600) {
    backStr = (diff / 60).toFixed(0) + '分钟' + subStr;
  } else if (diff < 3600 * 24) {
    backStr = (diff / 3600).toFixed(0) + '小时' + subStr;
    // } else if (diff < 3600 * 24 * 7) {
    //   backStr = (diff / (3600 * 24)).toFixed(0) + '天' + subStr;
    // } else if (diff < 3600 * 24 * 30) {
    //   backStr = (diff / (3600 * 24 * 7)).toFixed(0) + '周' + subStr;
  } else {
    backStr = new Date(time).Format('MM-dd');
  }
  return backStr;
};

// gif打点
util.setGifLog = log => {
  let _setLog = (param) => {
    if (/^https?:\/\//.test(param)) {
      new Image().src = param;
    } else if (param.indexOf('undefined') == -1) {
      new Image().src = 'http://dd.browser.360.cn/static/a/' + param + (param.indexOf('?') > -1 ? '&' : '?') + +new Date() + Math.random().toString().replace('0.', '').substr(0, 10) + '&mid=' + NT.getMid();
    }
  }
  if (_.isArray(log)) {
    log.forEach(item => {
      _setLog(item)
    })
  } else if (log) {
    _setLog(log)
  }
};

// tt打点
util.setTTLog = (act, data, el) => {
  var _data = {
    event_name: act,
    para: {
      v: NT.getVersion(),
      mid: NT.getMid(),
      act: act,
      ct: '0'
    },
    extendOtherData: act
  };
  data.f && (data.f = encodeURIComponent(data.f));
  _.extend(_data.para, data);
  el && (_data.el = el);
  se_monitor.customizeLog(_data);
}

// 对象转URL参数
util.parseParam = (param, key, encode) => {
  let _parseParam = (p, k, e) => {
    if (p == null) return '';
    var paramStr = '';
    var t = typeof(p);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + k + '=' + ((e == null || e) ? encodeURIComponent(p) : p);
    } else {
      for (var i in p) {
        var _k = k == null ? i : k + (p instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += _parseParam(p[i], _k, e);
      }
    }
    return paramStr;
  }
  return _parseParam(param, key, encode).substr(1)
};

// 注册客户端接口
util.registerNativeInterface = param => {
  for (let key in param) {
    window[key] = () => {
      console.log('window->', key)
      param[key] && param[key]()
    }
  }
};

// 滚动到顶部
util.scrollToTop = target => {
  let el = target || document.documentElement || document.body;
  let _scrollToTop = () => {
    const c = el.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(_scrollToTop);
      el.scrollTop = c - c / 4;
    }
  }
  _scrollToTop();
};

// 对jsonp的Promise封装
// util.jsonp = (url, opts) => {
//   url = url + (url.indexOf('?') != -1 ? '&' : '?') + '_=' + Math.random();
//   return new Promise((resolve, reject) => {
//     jsonp(url, opts, (err, data) => {
//       console.log('jsonp',url, err, data)
//       err ? reject(err) : resolve(data)
//     })
//   })
// }

export default util;