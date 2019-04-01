let nt = {};
let init = () => {
  if (!nt.SID) {
    try {
      nt.SID = external.GetSID(window);
    } catch (e) {
      if (process.env.NODE_ENV == 'development') {
        nt.SID = '{CB23B7F9-C4D6-43B1-AC47-F1E33AB75ACE}'
      }
    }
  }
  if (!nt.MID) {
    try {
      nt.MID = external.GetMID(nt.SID);
    } catch (e) {
      nt.MID = MakeMID();
    }
  }
  if (!nt.VERSION) {
    try {
      nt.VERSION = external.GetVersion(nt.SID);
    } catch (e) {
      if (process.env.NODE_ENV == 'development') {
        nt.VERSION = '9.1.0.362'
      }
    }
  }
};

let AppCmd = (fnName, param, callback) => {
  try {
    var _callback = function(id, ret) {
      callback && callback.call && callback.call(nt, ret);
      callback = null;
    };
    external.AppCmd(nt.SID, '', 'todaybuy', fnName, param, function(id, list) {
      try {
        list = JSON.parse(list);
      } catch (e) {}
      _callback(id, list);
    });
    return true;
  } catch (e) {
    window.console && console.warn('external.AppCmd(' + fnName + ')');
    return false;
  }
};
let MakeMID = (len, radix) => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}
nt.getMid = () => nt.MID;
nt.getVersion = () => nt.VERSION;
nt.getSid = () => nt.SID;
nt.setting = () => AppCmd('setting');
nt.close = () => AppCmd('close');
nt.getTag = tag => AppCmd('GetTag', tag);
nt.openUrl = url => window.open(url, '_blank');// : external.AppCmd(nt.SID, "", "openurl", url, "1.1", function(code, msg) {});
nt.setMute = type => {
  type = type ? 'open' : 'close';
  external.AppCmd(nt.SID, "", "opentabmute", type, "", function(code, msg) {});
}
init();
window.NT = nt;

export default nt;