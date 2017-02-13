define(function (require) {
    var app = require('app');

/**
 * 微博账号行为数据查询
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('wbAccountDetails',function(trshttpServer){

       var options = {};
       options.method = 'post';
       
       var params = {
          "serviceid": "wcm61_monitor",
          "methodName": "wbAccountDataToJson"
       }

       var accountUtil = {

           queryaccount: function(accountId){
                params.accountId = encodeURIComponent(accountId);
                return trshttpServer.httpServer('/wcm/rbcenter.do',options,params);
           }
       }
       return accountUtil;
})

/**
 * 微博综合评分
 */
app.factory('wbAccountScore',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
            "serviceid": "wcm61_monitor",
            "methodName": "wbAccountScoreToJson"
       }
       
       var wbAccountScoreUtil = {
           queryAccountScore: function(accountId){
             
             params.accountId = encodeURIComponent(accountId);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return wbAccountScoreUtil;
})

    
/**
 * 微博内容列表
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('weiboViewSer',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
          "serviceid": "wcm61_monitor",
          "methodName": "wbQueryToJson"
       }
        
       var weibolistUtil = {
           queryweibolist: function(obj){
                angular.extend(params, obj);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return weibolistUtil;
})

/**
 * 评分分布雷达图
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('wbradarMap', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbAccountRadarToJson"
    }

    var radarMapUt = {
      queryradarMap: function(accountId) {

        params.accountId = encodeURIComponent(accountId);
        return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
      }
    }
    return radarMapUt;
  })
  /**
   * 微博转发评论趋势折线图
   * @param  {Object} trshttpServer){                    var options [description]
   * @return {[type]}                  [description]
   */
app.factory('wbforwordlinesMap', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbAccountCommentAndForwardToJson"
    }

    var forwordlinesUt = {
      queryforwordlinesMap: function(accountId) {

        params.accountId = encodeURIComponent(accountId);
        return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
      }
    }
    return forwordlinesUt;
  })
  /**
   * 账号粉丝变化趋势图
   * @param  {Object} trshttpServer){                    var options [description]
   * @return {[type]}                  [description]
   */
app.factory('wbfanslineMap', function(trshttpServer) {

  var options = {};
  options.method = 'post';

  var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbFansAccountScoreTrendToJson"
  }

  var fanslineMapUt = {
    queryfanslineMap: function(accountId) {

      params.accountId = encodeURIComponent(accountId);
      return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
    }
  }
  return fanslineMapUt;
})  
})