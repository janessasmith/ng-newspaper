"use strict";
/**
 *  Module  热点新闻模板
 *  CreatyBy  Ly
 * Description
 */
angular.module('PlanHotHeadLineRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('plan.hotheadline', {
                url: '/hotheadline',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/hotHeadLine/hotHeadLine_tpl.html',
                        controller: 'PlanHotHeadLineCtrl'
                    }
                }
            });
    }]);
