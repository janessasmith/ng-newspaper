"use strict";
angular.module('resCenterVideoRouterModule', []).config(['$stateProvider', function($stateProvider) {
	$stateProvider.state("resourcectrl.video.resource", {
		url: '/resource?metacid&nodeid&cbmediaid',
		views: {
			'resource@resourcectrl.video': {
				templateUrl: './resourceCenter/video/video_main_tpl.html',
				controller: 'resourceCenterVideoCtrl'
			}
		}
	});
}]);