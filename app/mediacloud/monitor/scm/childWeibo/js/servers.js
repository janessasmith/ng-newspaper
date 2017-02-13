define(function (require) {
    var app = require('app');

// 账号运营状况:
 
/**
 * 数据量
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wboperatingSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wbTotalCountByUnitNameToJson"
    }

    var operating = {
        query: function(unitName) {
            params.unitName = encodeURIComponent(unitName);
            //查询账号运营情况
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return operating;
})

/**
 * 阅读数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wbreadoperatingSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wbReadCountByUnitNameToJson"
    }

    var readoperatingUt = {
        queryread: function(unitName) {
            params.unitName = encodeURIComponent(unitName);
            //查询账号运营情况
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return readoperatingUt;
})
/**
 * 回复数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wbreplyoperatingSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wbCommentCountByUnitNameToJson"
    }

    var replyoperatingUt = {
        queryreply: function(unitName) {
            params.unitName = encodeURIComponent(unitName);
            //查询账号运营情况
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return replyoperatingUt;
})

/**
 * 微博账号列表
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wbAccountSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "getWbAccountByUnitNameToJson"
    }

    var wxAxxountUtil = {
        queryAccountList : function(unitName) {

            params.unitName = encodeURIComponent(unitName);
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return wxAxxountUtil;
})

/**
 * 账号影响力榜单
 * @param  {Object} trshttpServer){                 var influence [description]
 * @return {[type]}                  [description]
 */
app.factory('wbInfluenceSer', function(trshttpServer){

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wbOperateByUnitNameToJson"
    }

    var influenceUtil = {
    	 queryInfluences: function(unitName) {
            params.unitName = encodeURIComponent(unitName);
            return trshttpServer.httpServer('/wcm/rbcenter.do',options,params);
    	}
    }
	return influenceUtil;
})

/**
 * 最新文章
 * @param  {Object} trshttpServer){                 var influence [description]
 * @return {[type]}                  [description]
 */
app.factory('wbLatestArticlesSer', function(trshttpServer){

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wbQueryTimeByUnitNameToJson"
    }

    var latestArticlesUtil = {
         queryLatestArticles: function(obj) {
            delete params.accountType;
            if(obj.accountType){
                params.accountType = encodeURIComponent(obj.accountType);
            }
            params.unitName = encodeURIComponent(obj.unitName);
            params.orderType = obj.orderType;

            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return latestArticlesUtil;
})

/**
 * 微博热度
 * @param  {Object} trshttpServer){                 var influence [description]
 * @return {[type]}                  [description]
 */
app.factory('hotweiboSer', function(trshttpServer){

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wbQueryHotByUnitNameToJson"
    }

    var hotweiboUtil = {
        queryHotweibos: function(obj) {
            delete params.accountType;
            if (obj.accountType) {
                params.accountType = encodeURIComponent(obj.accountType);
            }
            params.unitName = encodeURIComponent(obj.unitName);
            params.orderType = obj.orderType;

            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return hotweiboUtil;
})
})