import util from './util'

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
Date.prototype.Format = function(fmt) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  if (this == 'Invalid Date') return '';
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

// 数据乱序，比使用sort方法乱序更准确
Array.prototype.shuffle = function() {
  var input = this;
  for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
};

// 初始化，并发送展现打点
se_monitor.init({
  project: '360se_sidenews',
  basePar: {
    pid: 'sidenews_all',
    mid: NT.getMid(),
    v: NT.getVersion()
  },
  isOpenClick: false
});

// 禁止右键菜单
document.oncontextmenu = () => false;
// 添加全局监听
document.addEventListener('mousedown', () => window._timestamp_mousedown = Date.now())
document.addEventListener('mouseup', () => window._timestamp_mouseup = Date.now())


// 生产环境下禁止console.log
if (window.console) {
  let log = window.console.log;
  window.console.log = process.env.NODE_ENV == 'production' ? () => {} : log
};

// 将工具集挂载到lodash上
_.extend(_, util);

window.LODS = _;
