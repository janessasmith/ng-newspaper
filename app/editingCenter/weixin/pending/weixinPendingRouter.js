"use strict";
angular.module('weixinPendingRouter', []).config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('editctr.weixin.pending',{
		url:'/pending?channelid',
		views:{
			'main@editctr':{
				templateUrl:'./editingCenter/weixin/pending/main_tpl.html',
				controller:'WeiXinPendingCtrl'
			}
		}
	});
	
}]);