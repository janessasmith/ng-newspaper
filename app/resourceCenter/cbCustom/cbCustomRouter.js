"use strict";
angular.module('cbCustomRouter', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state('resourcectrl.custom.resource',{
		url:"/module",
		views:{
			'resource@resourcectrl.custom':{
				templateUrl:'./resourceCenter/cbCustom/cbCustom_tpl.html',
				controller:'cbCustomCtrl'
			}
		}
	});
}]);