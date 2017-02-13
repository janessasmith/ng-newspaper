/*
    Create By Liangyu 2015-10-19
*/
'use strict';
angular.module("logManageMentRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state("manageconfig.logmanage", {
            url: '/logmanage',
            views: {
                'header@manageconfig': {
                    templateUrl: './manageConfig/header_tpl.html',
                    controller: "manageConfigHeaderCtrl"
                },
                'left@manageconfig.logmanage': {
                    templateUrl: './manageConfig/logManageMent/left_tpl.html',
                    controller: 'logManageMentLeftCtrl'
                },
                'main@manageconfig': {
                    templateUrl: './manageConfig/logManageMent/main_tpl.html',
                    controller: 'logManageMentCtrl'
                },
                'footer@manageconfig': {
                    templateUrl: './footer_tpl.html'
                }
            }
        });
    }]);
