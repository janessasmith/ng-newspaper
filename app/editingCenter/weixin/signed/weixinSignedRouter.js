"use strict";
angular.module('weixinSignedRouter', []).config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('editctr.weixin.signed',{
		url:'/signed?channelid',
		views:{
			'main@editctr':{
				templateUrl:'./editingCenter/weixin/signed/main_tpl.html',
				controller:'WeiXinSignedCtrl'
			}
		}
	});
	
}]);