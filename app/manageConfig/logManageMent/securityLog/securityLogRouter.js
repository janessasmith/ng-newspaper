/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 安全日志 
 * rebuild:SMG 2016-4-20
 */

'use strict';
angular.module("logManageMentSecurityLogRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state("manageconfig.logmanage.securitylog", {
            url: '/securitylog',
            views: {
                'main@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/securityLog/securityLog_tpl.html',
                    controller: 'logManageMentSecurityLogCtrl',
                },
                'footer@manageconfig.logmanage': {
                    templateUrl: './footer_tpl.html'
                }
            }
        });
    }]);
