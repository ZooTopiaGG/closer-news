import NEWS from './news'
import ADS from './ads'
// import config from '../config'

let curThemeConfig = null;

/**
 * @description 数据请求，包括新闻和广告, 根据新闻的数量计算应该请求的广告数量
 * 即先请求新闻数据，再请求广告数据，这里的同步逻辑比较影响体验，如后期广告间隔的新闻数量不那么严格，可新闻和广告异步请求
 * 目前新闻和广告的请求均是用的jQuery.ajax(jsonp)，目前广告接口还不支持CORS，支持以后可全部使用fetch，从项目中去掉jQuery
 * @param {*} cid 频道编号
 * @param {*} loadType 加载的方式refresh/loadmore
 * @param {*} state 全局store
 * @returns
 */
let fetchData = (cid,loadType,state) => {
  const req = {
    cid: cid, // 频道编号
    type: loadType // 新闻加载形式 refresh：加载到列表的上方，loadmore：加载到列表的下方
  };

  // 当前频道的一些必要参数
  curThemeConfig = {
    times: state.contents.data[cid].times,  //请求的次数
    adsCount: state.contents.data[cid].adsCount,  //已加载的广告数量
    newsCount: state.contents.data[cid].newsCount,  //已加载的新闻数量
    prePosition: state.contents.data[cid].prePosition //上次请求最后一条广告下方新闻的数量
  }
  // NEWS是新闻数据，返回的都是promise对象
  return NEWS.getData(cid,state).then(newsData => {
      // console.log('fetchData:',newsData)
    const ads_config = state.contents.adsParams[cid] || {};

    // 当前频道广告参数
    const mvAdsParam = {
      showid: ads_config.showid,  //广告showid值
      open: !!ads_config.open,  //是否开启广告
      first: ads_config.firstPosition,  //第一条广告的位置，从0开始
      interval: ads_config.intervalCount  //广告间隔的新闻数量
    };

    if (!mvAdsParam.open) {
      return {
        currentCount: newsData.length,  //本次请求的新闻数量
        adsCount: curThemeConfig.adsCount,  //广告总数
        newsCount: curThemeConfig.newsCount + newsData.length,  //新闻总数
        prePosition: curThemeConfig.prePosition,  //本次请求最后一条广告下方新闻的数量
        data: newsData  //新闻与广告拼接后的数据
      }
    } else {
      let nextPosition = calculateParam(req, mvAdsParam), // 计算本次请求的首条广告应该插入的位置
        adsReqCount = calculateAdsNum(newsData, req, mvAdsParam), //计算本次应该请求的广告数量
        splicedData = {}, //拼接后的数据
        adsData = [],
        adsReqData = {  //广告请求参数
          showid: mvAdsParam.showid,  //广告showid
          impct: 3, //请求的广告数量
          reqtimes: curThemeConfig.times + 1  //请求的次数
        };
      // console.log('getNextData',nextPosition,newsData.length,adsReqCount);
      if (adsReqCount == 0) {
        splicedData = spliceData(newsData, [], req, nextPosition, mvAdsParam.interval);
        return {
          currentCount: newsData.length,
          adsCount: curThemeConfig.adsCount,
          newsCount: curThemeConfig.newsCount + newsData.length,
          prePosition: curThemeConfig.prePosition + splicedData.prePosition,
          data: splicedData.data
        }
      } else {
        adsReqData.impct = adsReqCount;
        return ADS.getData(adsReqData).then(adsData => {
          splicedData = spliceData(newsData, adsData, req, nextPosition, mvAdsParam.interval);
          // console.info('fetchData-->',adsData)
          return {
            currentCount: newsData.length,
            adsCount: curThemeConfig.adsCount + adsData.length,
            newsCount: curThemeConfig.newsCount + newsData.length,
            prePosition: curThemeConfig.prePosition + splicedData.prePosition,
            data: splicedData.data
          }
        })
      }
    }

  })
};


// 计算需要请求的广告数量
let calculateAdsNum = (data, req, adsParam) => {
  var news_count = data.length,
    firstPosition = adsParam.first,
    interval = adsParam.interval,
    allAdsCount = 0;
  if (req.type == 'loadMore') {
    if (curThemeConfig.newsCount > firstPosition) {
      firstPosition = interval > curThemeConfig.prePosition ? interval - curThemeConfig.prePosition : 0;
    } else if (curThemeConfig.newsCount <= firstPosition) {
      firstPosition = firstPosition - curThemeConfig.newsCount;
    }
  }
  var count = (news_count - firstPosition) / interval;
  allAdsCount = Math.floor(count);
  count > allAdsCount && allAdsCount++;
  return allAdsCount;
};

// 计算广告插入的位置
let calculateParam = (req, adsParam) => {
  var nextPosition;
  if (req.type == 'refresh') {
    nextPosition = adsParam.first;
  } else {
    if (curThemeConfig.newsCount > adsParam.first) {
      nextPosition = adsParam.interval > curThemeConfig.prePosition ? adsParam.interval - curThemeConfig.prePosition : 0;
    } else if (curThemeConfig.newsCount <= adsParam.first) {
      nextPosition = adsParam.first - curThemeConfig.newsCount;
    }
  }
  return nextPosition;
};

// 拼接新闻和广告数据
let spliceData = (newsData, allAdsData, req, nextPosition, interval) => {
  var news_count = newsData.length,
    splicedData = [],
    j = 0,
    lastAdsPosition = 0;
  if (nextPosition >= news_count && allAdsData.length < 1) {
    splicedData = newsData;
    curThemeConfig.prePosition = newsData.length + curThemeConfig.prePosition;
  } else {
    for (var i = 0; i < news_count; i++) {
      if (nextPosition == i || ((i - nextPosition) % interval == 0 && i > nextPosition)) {
        if (allAdsData[j]) {
          splicedData.push(allAdsData[j++]);
          lastAdsPosition = i;
        }
      }
      splicedData.push(newsData[i]);
    }
  }
  return {
    data: splicedData,
    prePosition: news_count - lastAdsPosition
  };
};

export default fetchData