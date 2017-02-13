/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 系统日志 
 * rebuild:SMG 2016-4-20
 */

'use strict';
angular.module("logManageMentSystemLogRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state("manageconfig.logmanage.debug", {
            url: '/debug',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/systemLog/debug/debug_tpl.html',
                    controller: 'systemLogDebugCtrl',
                },
            }
        }).
        state("manageconfig.logmanage.performancetest", {
            url: '/performancetest',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/systemLog/performanceTest/performanceTest_tpl.html',
                    controller: 'systemlogPerformanceTestCtrl',
                }
            }
        });
    }]);