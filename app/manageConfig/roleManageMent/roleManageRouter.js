/*
    Create By Baizhiming 2015-10-14
*/
'use strict';
angular.module("manageCfg.roleManageMent", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('manageconfig.rolemanage.permissionassignment', {
                url: '/permissionassignment',
                views: {
                    'rightEdit': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/permissionAssignment_tpl.html',
                        controller: 'permissionAssignmentCtrl'
                    },
                    'footer': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            }).state('manageconfig.rolemanage.editorcreaterole', {
                url: '/createrole?type',
                views: {
                    'rightEdit': {
                        templateUrl: './manageConfig/roleManageMent/editOrCreateRole/editOrCreateRole_tpl.html',
                        controller: 'createRoleCtrl'
                    },
                    'footer': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            }).state('manageconfig.rolemanage.adduser', {
                url: '/adduser?roleId',
                views: {
                    'rightEdit': {
                        templateUrl: './manageConfig/roleManageMent/addUser/addUser_tpl.html',
                        controller: 'userManageMentaddUserController'
                    },
                    'footer':{
                         templateUrl: './footer_tpl.html'
                    }
                }
            });
    }]);
