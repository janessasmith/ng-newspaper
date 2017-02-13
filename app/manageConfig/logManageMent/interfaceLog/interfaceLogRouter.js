/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 操作日志 
 * rebuild:SMG 2016-4-20
 */

'use strict';
angular.module("logManageMentInterfaceLogRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state("manageconfig.logmanage.interfacelog", {
            url: '/interfacelog',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/interfaceLog/interfaceLog_tpl.html',
                    controller: 'logManageMentInterfaceLogCtrl',
                }
            }
        });
    }]);