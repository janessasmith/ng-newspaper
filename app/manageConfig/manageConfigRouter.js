/*
    Create By Baizhiming 2015-10-14
*/
'use strict';
angular.module("manageCfg", [
    'manageCfg.roleManageMent',
    'groupUserManageMentRouterModule',
    'roleManageModule',
    'sysmanageModule',
    'productManageMentModule',
    'initManageConDropDownModule'
]).config(['$stateProvider', function($stateProvider) {
    $stateProvider.
    state('manageconfig', {
        url: '/manageconfig',
        views: {
            '': {
                templateUrl: './manageConfig/main_tpl.html',
                controller: "manageConfigCtrl"
            }
        }
    }).
    state("manageconfig.rolemanage", {
        url: '/rolemanage',
        views: {
            'main@manageconfig': {
                templateUrl: './manageConfig/roleManageMent/roleManageMent_tpl.html',
                controller: 'roleManageMentCtrl'
            },
            'header@manageconfig': {
                templateUrl: './manageConfig/header_tpl.html',
                controller: "manageConfigHeaderCtrl"
            }
        }
    }).
    state("manageconfig.productmanage", {
        url: '/productmanage',
        views: {
            'main@manageconfig': {
                templateUrl: './manageConfig/productManageMent/main_tpl.html',
                controller: 'productManageMentController'
            },
            'left@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/left_tpl.html',
                controller: 'productManageMentLeftController'
            },
            'header@manageconfig': {
                templateUrl: './manageConfig/header_tpl.html',
                controller: "manageConfigHeaderCtrl"
            }
        }
    }).
    state("manageconfig.sysmanage", {
        url: '/sysmanage',
        views: {
            'main@manageconfig': {
                templateUrl: './manageConfig/sysManageMent/main_tpl.html',
                controller: 'SysmanageController'
            },
            'header@manageconfig': {
                templateUrl: './manageConfig/header_tpl.html',
                controller: "manageConfigHeaderCtrl"
            }
        }
    });
}]);
