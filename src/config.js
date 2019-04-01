export default {
  /** 
   *  频道列表的展现配置
   *  @channels: 频道配置
   *    @default: 默认资讯类新闻
   *    @video: 视频类新闻
   *      @display: 是否显示频道列表
   *      @currentChannel: 默认频道
   *      @data: 频道列表
   *        @cid: 频道编号
   *        @cname: 频道名称
   */ 
  channels: {
    default: {
      display: true,
      currentChannel: 'youlike',
      data: [{
        cid: 'youlike',
        cname: '推荐'
      }, {
        cid: 'fun',
        cname: '娱乐'
      }, {
        cid: 'militery',
        cname: '军事'
      }, {
        cid: 'pictures',
        cname: '美图'
      }, {
        cid: 'funny',
        cname: '搞笑'
      }]
    },
    video: {
      display: false,
      currentChannel: 'video',
      data: [{
        cid: 'video',
        cname: '视频'
      }]
    }
  },
  /*  每个频道单独配置广告
   *  @showid: 广告的showid
   *  @open: 是否插入广告(广告开关)
   *  @firstPosition: 首条广告的位置
   *  @intervalCount: 广告插入的间隔数
   */
  ads: {
    youlike: {
      showid: 'YerBig',
      open: true,
      firstPosition: 2,
      intervalCount: 3
    },
    fun: {
      showid: 'YerBig',
      open: true,
      firstPosition: 2,
      intervalCount: 3
    },
    militery: {
      showid: 'YerBig',
      open: true,
      firstPosition: 2,
      intervalCount: 3
    },
    pictures: {
      showid: 'JlRRv0',
      open: true,
      firstPosition: 3,
      intervalCount: 3
    },
    funny: {
      showid: 'JlRRv0',
      open: true,
      firstPosition: 3,
      intervalCount: 3
    },
    video: {
      showid: 'UyIiAZ',
      open: false,
      firstPosition: 2,
      intervalCount: 3
    }
    
  }
}