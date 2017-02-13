define(function (require) {
    var app = require('app');

app.factory('weixinRankListSer', function(trshttpServer) {
	var options = {};
	options.method = 'post';

	var params = {
		"serviceid": "wcm61_monitor",
		"methodName": "getWxAccountRankingToJson"
	}

	var weixinRankListUtil = {
		queryWeixinRankList: function(obj) {
			angular.extend(params, obj)
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		}
	}
	return weixinRankListUtil;
})

})