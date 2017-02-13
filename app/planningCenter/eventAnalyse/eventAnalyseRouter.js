"use strict";
angular.module('planningCenterEventAnalyseRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('plan.eventtrack', {
                url: '/eventtrack',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/eventAnalyse/eventTrack/eventTrack_tpl.html',
                        controller: 'planningCenterEventAnalyseEventTrackCtrl'
                    }
                }
            });
    }]);