/**
 * 2018世界杯活动逻辑，世界杯结束后可删除，入口在initState.js
 */
var util = {
  getMid2: function(cb) {
    var mid2 = null; //'9107e4a2165701a98c7fff0b5f2adab59d1390ab294b';
    return function(cb) {
      if (mid2) {
        cb && cb(mid2)
        return;
      } else {
        try {
          external.AppCmd(external.GetSID(window), '', 'GetM2', '', '', function(code, data) {
            mid2 = data
            cb && cb(mid2)
          })
        } catch (e) {}
      }
    }
  }(),
  storage: {
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
  },
  format: function(fmt) {
    var date = new Date();
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
    if (date == 'Invalid Date') return '';
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  setLog: function(log) {
    var _setLog = function(param) {
      if (/^https?:\/\//.test(param)) {
        new Image().src = param;
      } else if (param.indexOf('undefined') == -1) {
        new Image().src = 'http://dd.browser.360.cn/static/a/' + param + (param.indexOf('?') > -1 ? '&' : '?') + +new Date() + Math.random().toString().replace('0.', '').substr(0, 10);
      }
    }
    if (Array.isArray(log)) {
      log.forEach(function(item) {
        _setLog(item)
      })
    } else if (log) {
      _setLog(log)
    }
  }
};
var KEY = 'worldcup_event_51013';
var product_id = 5;
var task_id = 51013;
var URL = 'https://arthas.safe.360.cn';
var c = util.storage.get(KEY);
c.link = c.link || 'https://2018worldcup.safe.360.cn';
c.num = c.num || 1;
var today = util.format('yyyyMMdd');
var tab_tpl = [
  '<div class="worldcup">',
  '<div class="wc-dlg">',
  '<div class="wc-dlg-close"></div>',
  '<div class="wc-wrap">',
  '<div class="wc-card">',
  '<div class="wc-card-img"></div>',
  'X',
  '<span class="wc-card-num">1</span>',
  '</div>',
  '<p class="wc-title">您获得了<span class="wc-card-num">1</span>张机会卡</p>',
  '<p class="wc-desc">可用于抽奖或复活</p>',
  '<div class="wc-reward">现金大奖\\手机\\扫地机器人</div>',
  '<div class="wc-btns-1">',
  '<div class="wc-btn0">不感兴趣</div>',
  '<div class="wc-btn1">参与活动</div>',
  '</div>',
  '<div class="wc-btns-2">',
  '<div class="wc-btn2">我知道了</div>',
  '<div class="wc-btn3">活动首页</div>',
  '</div>',
  '</div>',
  '</div>',
  '</div>'
].join('');
var $wc = null;
var $dlg = null;
var times = 0;

var checkCache = function(mid2) {
  if (c.state === false || !mid2) {
    return true;
  }
  if (c.date != today) {
    c.played = false;
    c.closed = false;
  }
  if (c.played || c.closed) {
    return true;
  }
  return false;
}

var init = function() {
  util.getMid2(function(mid2) {
    if (checkCache(mid2)) return
    ajax('entrance', function(res) {
      if (res.errno == 0 || res.errno == 20) {
        $('body').append(tab_tpl);
        $wc = $('.worldcup');
        $dlg = $('.wc-dlg');
        bindEvent();
        if (res.errno == 20) {
          saveCache('state', true);
        }
        if (res.data && res.data.num) {
          saveCache('num', res.data.num);
          $('.wc-card-num').html(c.num);
        }
      } else if (res.errno == 29 || res.errno == 10) {
        saveCache('state', false);
      }
    })
  })
}

var bindEvent = function() {
  $('#root').on('click', '.list', function(e) {
    if (++times == 5 && c.state !== false) {
      if (c.state === true && !c.played) {
        util.setLog('754.9619.gif');
        ajax('getCard', function(res) {
          if (res.errno == 0 || res.errno == 21) {
            if (res.data && res.data.link) {
              saveCache('link', res.data.link);
            }
            saveCache('played', true);
            res.errno == 0 && $dlg.addClass('active');
          }
        })
      } else {
        $dlg.show();
        util.setLog('754.9835.gif');
      }

    }
  })

  $wc.on('click', '.wc-dlg-close', function(e) {
    util.setLog('754.4176.gif');
    $wc.hide();
    if (c.state === true) {
      saveCache('closed', true)
    } else {
      saveCache('state', false);
      ajax('noPrompt', function(res) {})
    }
  }).on('click', '.wc-btn0', function(e) {


    util.setLog('754.2287.gif');
    $wc.hide();
    saveCache('state', false);
    ajax('noPrompt', function(res) {})
  }).on('click', '.wc-btn1', function(e) {
    util.setLog('754.4700.gif');
    ajax('getCard', function(res) {
      if (res.errno == 0 || res.errno == 21) {
        $dlg.hide();
        saveCache('state', true);
        saveCache('played', true);
        if (res.data && res.data.link) {
          saveCache('link', res.data.link);
        }
        window.open(c.link, '_blank');
      }
    })
  }).on('click', '.wc-btn2', function(e) {
    util.setLog('754.9933.gif');
    $wc.hide();
    saveCache('closed', true);
  }).on('click', '.wc-btn3', function(e) {
    util.setLog('754.1223.gif');
    window.open(c.link, '_blank');
    $wc.hide();
    saveCache('closed', true);
  })
}

var saveCache = function(key, value) {
  c[key] = value;
  util.storage.set(KEY, key, value)
  util.storage.set(KEY, 'date', today)
}

var ajax = function(u, cb) {
  util.getMid2(function(mid2) {
    mid2 && $.ajax({
      url: URL + '/worldCupWeb/' + u,
      dataType: 'jsonp',
      data: {
        mid2,
        product_id,
        task_id,
        timestamp: parseInt(Date.now() / 1000)
      }
    }).done(function(res) {
      console.log(res)
      cb && cb(res);
    })
  })
}

export default {
  init
}