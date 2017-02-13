"use strict";
angular.module('resCenterCbXinhuaRouter', []).config(['$stateProvider',function($stateProvider) {
	$stateProvider.state('resourcectrl.xinhua.resource',{
		url:"/cbresource?id",
		views:{
			'resource@resourcectrl.xinhua':{
				templateUrl:'./resourceCenter/cbXinhuaNews/cbXinhuaNews_main_tpl.html',
				controller:'resCenterCbXinhuaNewsCtrl'
			}
		}
	});
}]);