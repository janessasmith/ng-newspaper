"use strict";

angular.module('performanceAssessmentRouterModule', []).
config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('perform', {
		url: '/perform',
		views: {
			"": {
				templateUrl: './performanceAssessment/index_tpl.html',
				controller: 'performanceAssessmentCtrl'
			},
			"header@perform": {
				templateUrl: './header_tpl.html',
				controller: 'HeaderController'
			},
			"left@perform": {
				templateUrl: './performanceAssessment/left_tpl.html',
				controller: 'performanceAssessmentLeftCtrl'
			},
			"main@perform": {
				"templateUrl": "./performanceAssessment/newspapers/performanceAssessmentNewspaper.html",
			},
			"footer@perform": {
				templateUrl: './footer_tpl.html'
			}
		}
	})
}]);