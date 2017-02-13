/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 事件监控 
 * rebuild:SMG 2016-4-20
 */

'use strict';
angular.module("logManageMentEventMonitoringRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state("manageconfig.logmanage.myqueues", {
            url: '/myqueues',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/eventMonitoring/myQueues/myQueues_tpl.html',
                    controller: 'eventMonitoringMyQueuesCtrl',
                }
            }
        }).
        state("manageconfig.logmanage.allqueues", {
            url: '/allqueues',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/eventMonitoring/allQueues/allQueues_tpl.html',
                    controller: 'eventMonitoringAllQueuesCtrl',
                }
            }
        });
    }]);