/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 操作日志 
 * rebuild:SMG 2016-4-20
 */

'use strict';
angular.module("logManageMentOperationLogRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state("manageconfig.logmanage.operationlog", {
            url: '/operationlog',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/operationLog/operationLog_tpl.html',
                    controller: 'logManageMentOperationLogCtrl',
                },
                'footer@manageconfig.logmanage': {
                    templateUrl: './footer_tpl.html'
                }
            }
        });
    }]);
