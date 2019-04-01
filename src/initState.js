// import _ from './assets/common/util'
import Immutable from 'immutable'
import base64 from './assets/common/base64'
import NT from './assets/common/native'

import config from './config'
import WC from './assets/data/worldcup'
WC.init()

// 客户端版本号
const VER = NT.getVersion();
const params = _.getQueryObject();
let cacheData = _.storage.get('sidenews_cache');
let channelsData = params.type == 'video' ? config.channels.video : config.channels.default
// 广告参数
let adsParams = config.ads;
let initState = null
let contentsData = {}
// 获取外链数据
let data = JSON.parse(base64.decode(params.data || '') || '{}');

channelsData.switchTime = Date.now()
channelsData.data.forEach((item, index) => {
  contentsData[item.cid] = {
    times: 0,
    adsCount: 0,
    newsCount: 0,
    prePosition: 0,
    logData: [],
    data: []
  }
})

if (!_.isNewer(VER, '9.2')) {
  // 只在9.2上显示广告
  // adsParams = {};
};
// 通过外链打开的侧边栏，单独打点
if (Object.keys(data).length > 0) {
  _.setTTLog('track', {
    pid: 'open-by-link',
    c: data.refer_title,
    f: data.refer_url
  })
};

initState = {
  // 请求相关数据
  fetchParams: data,
  // 频道相关数据
  channels: channelsData,
  // 内容相关数据
  contents: {
    isRefreshing: false,
    isHinting: false,
    data: contentsData,
    adsParams: adsParams
  }
}

// window.JQ = $;

export default Immutable.fromJS(initState)
// export default initState