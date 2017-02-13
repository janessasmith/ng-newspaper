define(function (require) {
    var app = require('app');

/**
 * 账号数据查询
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('accountcx',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
	          "serviceid": "wcm61_monitor",
	          "methodName": "wxAccountDataToJson"
       }
       
       var accountUtil = {
           queryaccountcx: function(accountId){
        	   params.accountId = encodeURIComponent(accountId);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return accountUtil;
})

/**
 * 微信综合评分
 */
app.factory('wxAccountScore',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
	          "serviceid": "wcm61_monitor",
	          "methodName": "wxAccountScoreToJson"
       }
       
       var wxAccountScoreUtil = {
           queryAccountScore: function(accountId){
        	   
        	   params.accountId = encodeURIComponent(accountId);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return wxAccountScoreUtil;
})

/**
 * 账号粉丝变化情况
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('countcx',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
	          "serviceid": "wcm61_monitor",
	          "methodName": "wxAccountUserDataToJson"
       }
       
       var countcxUtil = {
           querycountcx: function(accountName){
        	   params.accountName = encodeURIComponent(accountName);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return countcxUtil;
})

/**
 * 微信列表查询
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('weixinlistSer',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
	          "serviceid": "wcm61_monitor",
	          "methodName": "wxQueryToJson"
       }

       var weixinlistCxUtil = {
           queryweixinlist: function(obj){
                angular.extend(params, obj);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return weixinlistCxUtil;
})

/**
 * 账号阅读数对比
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('publiccount',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
	          "serviceid": "wcm61_monitor",
	          "methodName": "wxAccountReadCompareToJson"
       }
       
       var publiccountUtil = {
           querypubliccount: function(accountId){
        	   params.accountId = encodeURIComponent(accountId);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return publiccountUtil;
})

/**
 * 账号阅读数，点赞数统计
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('totalcount',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
          "serviceid": "wcm61_monitor",
          "methodName": "wxAccountReadandLikesToJson"
       }
       
       var totalcountUtil = {
           querytotalcount: function(accountId){
        	   params.accountId = encodeURIComponent(accountId);
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }
       return totalcountUtil;
})
/**
 * 评分分布雷达图
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('radarMap', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
	      "serviceid": "wcm61_monitor",
	      "methodName": "wxAccountRadarToJson"
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
   * 账号综合评分趋势图
   * @param  {Object} trshttpServer){                    var options [description]
   * @return {[type]}                  [description]
   */
app.factory('accountlineMap', function(trshttpServer) {

  var options = {};
  options.method = 'post';

  var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wxAccountScoreTrendToJson"
  }

  var accountlineMapUt = {
    queryaccountlineMap: function(accountId) {
      params.accountId = encodeURIComponent(accountId);
      return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
    }
  }
  return accountlineMapUt;
})

})