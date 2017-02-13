define(function (require) {
    var app = require('app');

/**
 * 集团微信账号运营情况
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('wxSituation', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_monitor",
         "methodName":"wxOperateAllToJson"
    }
    var situationUtil = {
        querySituation: function(accountType) {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);//'monitor/wx/operation/data/situation.json'
        }
    }

    return situationUtil;
})

/**
 * 微信账号榜单
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('wbSeniority', function(trshttpServer){
    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wxOperateQueryToJson"
    }

    var seniorityUtil = {
        querySenioritys: function(accountType) {
            delete params.accountType;
            if(accountType){
                params.accountType = accountType;
            }
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return seniorityUtil;
})


/**
 * 微信集团监控账号列表
 * @param  {[type]} trshttpServer){               return function name(){      };} [description]
 * @return {[type]}                  [description]
 */
app.factory('wxjtUnitViewSer', function(trshttpServer) {

  var options = {};
  options.method = 'post';

  var params = {
    "serviceid": "wcm61_monitor",
    "methodName": "getAllUnitToJson"
  }

  var wxjtUnitViewUtil = {
    queryJtwbUnits: function() {
      return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
    }
  }

  return wxjtUnitViewUtil;
})

/**
 * 最新微信
 * @param  {Object} ){                    var options [description]
 * @return {[type]}     [description]
 */
app.factory('newWeixin',function(trshttpServer){

       var options = {};
       options.method = 'post';

       var params = {
         "serviceid": "wcm61_monitor",
         "methodName": "wxQueryByTimeToJson"
       }

       var newWeixinUtil = {
           queryNewWeibos: function(accountType){
        	    delete params.accountType;
                if(accountType){
                    params.accountType = accountType;
                }
                return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
           }
       }

       return newWeixinUtil;
})

/**
 * 热点新闻
 * @param  {Object} ) {               var options [description]
 * @return {[type]}   [description]
 */
app.factory('wxHotNews', function(trshttpServer) {

    var options = {};
    options.method = 'get';

    var params = {
       "serviceid": "wcm61_monitor",
       "methodName": "wxQueryByHotToJson"
    }

    var hotnewsUtil = {
        queryHotnews: function(accountType) {
        	delete params.accountType;
            if(accountType){
                params.accountType = accountType;
            }
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return hotnewsUtil;
})

/**
 * 微信运营综合状况图
 * @param  {Object} ) {               var options [description]
 * @return {[type]}   [description]
 */


/**
 * 微信数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wxoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wxTotalCountToJson"
    }

    var operationUtil = {
      
        queryOperations: function() {
      
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return operationUtil;
})

/**
 * 阅读数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wxreadoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wxReadCountToJson"
    }

    var readoperationUtil = {
      
        //阅读数
        queryreadCount:function() {
           
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return readoperationUtil;
})

/**
 * 评论数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wxcommentoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wxCommentCountToJson"
    }

    var commentoperationUtil = {
      
        //评论数
        querycommentCount:function() {
           
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return commentoperationUtil;
})

/**
 * 点赞数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wxlikesoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wxLikesCountToJson"
    }

    var likesoperationUtil = {
     
        //点赞数
        querylikesCount:function() {
            
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return likesoperationUtil;
})

})