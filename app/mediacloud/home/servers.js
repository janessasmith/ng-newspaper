define(function (require) {
    var app = require('app');
/**
 * 最新微信列表
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('homeweixinListSer', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_monitor",
         "methodName":"wxQueryToJson"
    }
    var weinxinListUtil = {
        queryWinxinList: function() {
            params.orderType = 1;
            params.pageSize = 4;
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return weinxinListUtil;
})

/**
 * 微信账号列表
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('homeweixinAccountSer', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_wxaccount",
         "methodName":"queryAccountIndexToJson"
    }
    var weixinAccountUtil = {
        queryWinxinAccounts: function() {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return weixinAccountUtil;
})

/**
 * 最新微博列表
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('homeweiboListSer', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_monitor",
         "methodName":"wbQueryToJson"
    }
    var weiboListUtil = {
        queryWinboList: function() {
            params.orderType = 1;
            params.pageSize = 4;
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return weiboListUtil;
})

/**
 * 微博账号列表
 * @param  {Object} trshttpServer){                 var options [description]
 * @return {[type]}                  [description]
 */
app.factory('homeweiboAccountSer', function(trshttpServer){
    var options = {};
    options.method = 'post';
    var params = {
         "serviceid":"wcm61_scmaccount",
         "methodName":"findAccountsIndexToJson"
    }
    var weixinAccountUtil = {
        queryWeiboAccounts: function() {
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }

    return weixinAccountUtil;
})

app.factory('weinxinContentPreviewSer', function(trshttpServer) {
    var options = {};
    options.method = 'post';
    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "getWxByIdToJson"
    }
    var weinxinContentPreviewUtil = {
        queryWeixinContent: function(wxid) {
            params.wxid = wxid;
            return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
        }
    }
    return weinxinContentPreviewUtil;
})

})