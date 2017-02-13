"use strict";
angular.module('weixinTobeCompiledRouter', []).config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('editctr.weixin.tobecompiled',{
		url:'/tobecompiled?channelid',
		views:{
			'main@editctr':{
				templateUrl:'./editingCenter/weixin/toBeCompiled/main_tpl.html',
				controller:'WeiXinTobeCompiledCtrl'
			}
		}
	});
	
}]);