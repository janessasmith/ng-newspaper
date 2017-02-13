/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理
 * rebuild:SMG 2016-4-20
 */
"use strict";
angular.module('logManageMentModule', [
	'logManageMentLeftModule',
	'logManageMentRouterModule',
	'logManageMentSecurityLogModule',
	'logManageMentOperationLogModule',
	'logManageMentInterfaceLogModule',
	'logManageMentSystemLogModule',
	'logManageMentEventMonitoringModule'
	])
.controller('logManageMentCtrl',['$scope','$state',function($scope,$state){

}]);
