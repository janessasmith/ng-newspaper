define(function (require) {
    var app = require('app');

  /**
 * 微博账号运营状况
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('scmSituation', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_monitor",
         "methodName":"wbOperateAllToJson"
    }
    var situationUtil = {
        querySituation: function(accountType) {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);//'monitor/scm/operation/data/situation.json'
        }
    }
    return situationUtil;
})

/**
 * 微博账号排行
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('scmSeniority', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_monitor",
         "methodName":"wbOperateQueryToJson"
    }
    var seniorityUtil = {
        querySenioritys: function(accountType) {
            delete params.accountType;
            if(!angular.isUndefined(accountType)){
               params.accountType = accountType;
            }
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return seniorityUtil;
})

/**
 * 微博集团监控账号列表
 * @param  {[type]} trshttpServer){               return function name(){      };} [description]
 * @return {[type]}                  [description]
 */
app.factory('wbjtUnitViewSer', function(trshttpServer) {

  var options = {};
  options.method = 'post';

  var params = {
    "serviceid": "wcm61_monitor",
    "methodName": "getAllUnitToJson"
  }

  var wbjtUnitViewUtil = {
    queryJtwbUnits: function() {
      return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
    }
  }

  return wbjtUnitViewUtil;
})

/**
 * 最新微博
 * @param  {Object} ){                    var options [description]
 * @return {[type]}     [description]
 */
app.factory('newWeibo', function(trshttpServer) {

  var options = {};
  options.method = 'post';

  var params = {
    "serviceid": "wcm61_monitor",
    "methodName": "wbQueryByTimeToJson"
  }

  var newWeiboUtil = {
    queryNewWeibos: function(accountType) {
      delete params.accountType;
      if(accountType){
          params.accountType = accountType;
      }
      return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
    }
  }

  return newWeiboUtil;
})

/**
 * 热点新闻
 * @param  {Object} ) {               var options [description]
 * @return {[type]}   [description]
 */
app.factory('hotwbNews', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbQueryByHotToJson"
    }

    var hotnewsUtil = {
        queryHotnews: function(accountType) {
            delete params.accountType;
            if(accountType){
                params.accountType = accountType;
            }
            return trshttpServer.httpServer('/wcm/rbcenter.do',options,params);
        }
    }

    return hotnewsUtil;
})

 //微博运营综合状况图:
 
/**
 * 微博数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wboperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbTotalCountToJson"
    }

    var operationUtil = {
      
        queryOperations: function() {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return operationUtil;
})

/**
 * 评论数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wbcommentoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbCommentCountToJson"
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
app.factory('wblikesoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbLikesCountToJson"
    }

    var likesoperationUtil = {
     
        //点赞数
        querylikesCount:function() {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return likesoperationUtil;
})

/**
 * 转发数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wbforwordoperation', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
      "serviceid": "wcm61_monitor",
      "methodName": "wbForwardCountToJson"
    }

    var replyoperationUtil = {
        //转发数
        queryreplyCount:function() {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return replyoperationUtil;
})
});
