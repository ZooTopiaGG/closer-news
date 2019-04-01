window.se_monitor = (function(monitor) {
  var baseExtend = {};
  //合并对象属性
  function mix(des, src, override, isClearObjectAttr) {
    for (var i in src) {
      //这里要加一个des[i]，是因为要照顾一些不可枚举的属性
      if (override || !(des[i] || (i in des))) {
        des[i] = src[i];
      }
    }
    return des;
  }
  var Cookie = {
    get: function(key) {
      try {
        var doc = document,
          a, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (a = doc.cookie.match(reg)) {
          return unescape(a[2]);
        } else {
          return "";
        }
      } catch (e) {
        return "";
      }
    },
    set: function(key, val, options) {
      options = options || {};
      var expires = options.expires;
      var doc = document;
      if (typeof(expires) === "number") {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires);
      }

      try {
        doc.cookie =
          key + "=" + escape(val) + (expires ? ";expires=" + expires.toGMTString() : "") + (options.path ? ";path=" + options.path : "") + (options.domain ? "; domain=" + options.domain : "");
      } catch (e) {}
    }
  };
  //重写monitor.data.getBase 方法增加参数
  function newGetbase() {
    var base = {
      p: monitor.util.getProject(),
      u: window.location.href,
      guid: monitor.util.getGuid(),
      id: monitor.util.getGuid(),
      mid: monitor.util.getMid(),
      pid: "", //mini下是分频ID 
      act: "track", //事件类型，click(点击事件), track(展示事件)
      ct: 0 // 点击类型，0(其它)，1(广告)
        // twoChannel: arr1[0],
        // threeChannel: arr2[1],
        // title: document.getElementsByTagName('title')[0] ? document.getElementsByTagName('title')[0].innerHTML : '',
        // from: $utils.getParam("from", location.href) || '',
        // src: $utils.getParam("src", location.href) || ''
    };
    base = mix(base, baseExtend, true);
    return base;
  }

  return {
    /*兼容之前写的pid,twoChannel,threeChannel，作为一级参数，供快速调用。
      如：common_monitor.init({pid:'test',twoChannel:'test',threeeChannel:'test',isOpenLeave:true}),不支持扩展里边的参数monitor.data.getBase
      或  common_monitor.init({isOpenLeave:true,basePar:{pid:'test',twoChannel:'test',threeeChannel:'test'}，trackPar:{},clickPar:{}})，支持扩展monitor.data.getBase其他参数，
      只需在basePar增加其他参数即可，可在
    */
    init: function(conf) {
      if (!Cookie.get('__mid')) {
        try {
          var mid = (external && external.GetMID && external.GetSID && external.GetMID(external.GetSID(window))) || (wdextcmd && wdextcmd.GetMid && wdextcmd.GetMid()) || '';
          if (mid) {
            var expires = 24 * 3600 * 1000 * 300;
            var date = new Date();
            date.setTime(date.getTime() + expires);
            Cookie.set('__mid', mid, {
              expires: date,
              path: '/'
            });
          }
        } catch (e) {}
      }

      monitor.setConf({
        trackUrl: 'http://tt.browser.360.cn/t.html',
        clickUrl: 'http://tt.browser.360.cn/c.html'
      });
      baseExtend = conf.basePar; //用来扩展getBase里边的参数
      monitor.setProject(conf.project);
      monitor.data.getBase = newGetbase;
      monitor.getTrack();
      if (conf.isOpenClick !== false) { //是否开启click打点，默认开启，可以不传isOpenClick
        monitor.getClickAndKeydown();
      }
    },
    customizeLog: function(conf) {
      if (conf && typeof conf == "object") {
        var data = {};
        if (conf.extendOtherData) { //如要携带track基础数据
          if (conf.extendOtherData == "track") {
            data = mix(monitor.data.getTrack(), conf.para, true);
          }
          if (conf.extendOtherData == "click") {
            data = mix(monitor.data.getClick(conf.el), conf.para, true);
          }
        } else {
          data = conf.para;
        }
        monitor.log(data, conf.event_name);
      }
    }
  }
})(window.monitor);