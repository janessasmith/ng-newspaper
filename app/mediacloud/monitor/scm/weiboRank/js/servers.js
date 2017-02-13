define(function(require) {
	var app = require('app');

	app.factory('weiboRankListSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';

		var params = {
			"serviceid": "wcm61_monitor",
			"methodName": "getWbAccountRankingToJson"
		}

		var weiboRankListUtil = {

			queryWeiboRankList: function(obj) {
				angular.extend(params, obj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return weiboRankListUtil;
	})
})