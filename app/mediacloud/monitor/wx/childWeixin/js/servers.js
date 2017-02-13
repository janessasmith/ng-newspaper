define(function (require) {
    var app = require('app');

// 账号运营状况:

/**
 * 数据量
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */

app.factory('wxoperatingSer', function(trshttpServer) {
	
    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wxTotalCountByUnitNameToJson"
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
 * **/
app.factory('wxreadoperatingSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wxReadCountByUnitNameToJson"
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
 * 评论数
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */

app.factory('wxreplyoperatingSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wxCommentCountByUnitNameToJson"
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
 * 账号列表
 * @param  {Object} trshttpServer) {               var options [description]
 * @return {[type]}                [description]
 */
app.factory('wxAccountSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "getWxAccountByUnitNameToJson"
    }

    var wxAxxountUtil = {
        queryAccountList : function(unitName) {

            params.unitName = unitName;
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
app.factory('influenceSer', function(trshttpServer){

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wxOperateByUnitNameToJson"
    }

    var influenceUtil = {
    	 queryInfluences: function(unitName) {
            params.unitName = unitName;
            return trshttpServer.httpServer('/wcm/rbcenter.do', options);
    	}
    }
	return influenceUtil;
})

/**
 * 最新文章
 * @param  {Object} trshttpServer){                 var influence [description]
 * @return {[type]}                  [description]
 */
app.factory('wxLatestArticlesSer', function(trshttpServer){

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wxQueryTimeByUnitNameToJson"
    }

    var latestArticlesUtil = {
         queryLatestArticles: function(obj) {
            delete params.accountType;
            if(obj.accountType){
                params.accountType = obj.accountType;
            }
            params.unitName = obj.unitName;
            params.orderType = obj.orderType;

            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return latestArticlesUtil;
})

/**
 * 微信热度
 * @param  {Object} trshttpServer){                 var influence [description]
 * @return {[type]}                  [description]
 */
app.factory('hotweixinSer', function(trshttpServer) {

    var options = {};
    options.method = 'post';

    var params = {
        "serviceid": "wcm61_monitor",
        "methodName": "wxQueryHotByUnitNameToJson"
    }

    var hotweixinUtil = {
        queryHotweixins: function(obj) {
            delete params.accountType;
            if (obj.accountType) {
                params.accountType = obj.accountType;
            }
            params.unitName = obj.unitName;
            params.orderType = obj.orderType;
            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
        }
    }
    return hotweixinUtil;
})

})