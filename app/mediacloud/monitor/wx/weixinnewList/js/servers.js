define(function (require) {
    var app = require('app');

/**
 * 微信新闻列表
 * @param  {Object} trshttpServer){                    var options [description]
 * @return {[type]}                  [description]
 */
app.factory('weixinnewlistSer', function(trshttpServer) {

  var options = {};
  options.method = 'post';
  var params = {
    "serviceid": "wcm61_monitor",
    "methodName": "wxQueryToJson"
  }

  var weixinnewlistUtil = {
    queryWeixinnewlist: function(obj) {
          if (obj.accountType) {
            params.accountType = encodeURIComponent(obj.accountType);
          }
          if (obj.unitName) {
            params.unitName = encodeURIComponent(obj.unitName);
          }
          if (obj.accountId) {
            params.accountId = encodeURIComponent(obj.accountId);
          }
          if (obj.startTime) {
            params.startTime = obj.startTime;
          }
          if (obj.endTime) {
            params.endTime = obj.endTime;
          }
          delete params.keyWord;
          if (obj.keyWord) {
            params.keyWord = encodeURIComponent(obj.keyWord);
          }
          if (obj.orderType) {
            params.orderType = encodeURIComponent(obj.orderType);
          }
          return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
        }
  }
  return weixinnewlistUtil;
})

})