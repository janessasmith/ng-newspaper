/**
 *  Module 报题汇总模块
 *  Author:wang.jiang 2016-3-8
 * Description
 */
"use strict";
angular.module('plan.reportRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('plan.reportsummary', {
                url: '/reportsummary',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/report/summary/main_tpl.html',
                        controller: 'reportsummaryCtrl'
                    },

                }
            }).state('plan.settingTopic', {
                url: '/settingTopic',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/report/summary/settingTopic_tpl.html',
                        controller: 'settingTopicCtrl'
                    },

                }
            }).state('plan.dailyselection', {
                url: '/dailyselection',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/report/dailyselection/main_tpl.html',
                        controller: 'reportdailyselectCtrl'
                    },

                }
            });
    }]);