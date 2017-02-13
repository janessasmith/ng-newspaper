"use strict";

angular.module('performanceAssessmentNewspaperRouterModule', [])
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('perform.newspaper', {
			"url": "/newspaper?PaperId&BanMianId",
			"views": {
				"main@perform": {
					"templateUrl": "./performanceAssessment/newspapers/performanceAssessmentNewspaper.html",
					"controller": "performanceAssessmentNewspaperCtrl"
				}
			}
		});
	}]);