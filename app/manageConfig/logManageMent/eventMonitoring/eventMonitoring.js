/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 事件监控
 * rebuild:SMG 2016-4-20
 */
"use strict";
angular.module('logManageMentEventMonitoringModule', [
	'logManageMentEventMonitoringRouterModule',
	'eventMonitoringAllQueuesModule',
    'eventMonitoringMyQueuesModule'
	])
.controller('logManageMentEventMonitoringCtrl', securityLog);
securityLog.$injector = ['$scope'];

function securityLog($scope) {

}