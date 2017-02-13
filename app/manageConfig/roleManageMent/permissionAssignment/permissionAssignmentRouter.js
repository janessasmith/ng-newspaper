/*
    create by BaiZhiming 2016-2-23
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignmentRouter", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
        //默认界面
            .state('manageconfig.rolemanage.permissionassignment.default', {
                url: '/default',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'defaultCtrl'
                    }
                }
            })
            //采编中心
            /*.state('manageconfig.rolemanage.permissionassignment.editingpa', {
                url: '/editingpa',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'editingCenterPACtrl'
                    }
                }
            })*/
            .state('manageconfig.rolemanage.permissionassignment.iwo', {
                url: '/editingcenter/iwo',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'iwoPermissionAssignmentCtrl'
                    }
                }
            })
            .state('manageconfig.rolemanage.permissionassignment.paper', {
                url: '/editingcenter/paper',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'newspaperPermissionAssignmentCtrl'
                    }
                }
            })
            .state('manageconfig.rolemanage.permissionassignment.web', {
                url: '/editingcenter/web',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/editingCenter/website/main.html',
                        controller: 'websitePermissionAssignmentCtrl'
                    }
                }
            })
            .state('manageconfig.rolemanage.permissionassignment.app', {
                url: '/editingcenter/app',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/editingCenter/website/main.html',
                        controller: 'websitePermissionAssignmentCtrl'
                    }
                }
            })
            .state('manageconfig.rolemanage.permissionassignment.wechat', {
                url: '/editingcenter/wechat',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'wechatPermissionAssignmentCtrl'
                    }
                }
            })
            //模块权限
            .state('manageconfig.rolemanage.permissionassignment.modulepermission', {
                url: '/modulepermission',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'modulePermissionCtrl'
                    }
                }
            })
            //产品范围
            .state('manageconfig.rolemanage.permissionassignment.product', {
                url: '/product',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'proRangeCtrl'
                    }
                }
            })
            //组织范围
            .state('manageconfig.rolemanage.permissionassignment.group', {
                url: '/group',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'orgRangeCtrl'
                    }
                }
            })
            //用户管理
            .state('manageconfig.rolemanage.permissionassignment.user', {
                url: '/user',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'usermanagePerCtrl'
                    }
                }
            })
            //策划中心协同指挥
            .state('manageconfig.rolemanage.permissionassignment.plCCommand', {
                url: '/plccommand',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'plCenterCommandCtrl'
                    }
                }
            })
            //资源中心
            .state('manageconfig.rolemanage.permissionassignment.resourcecenter', {
                url: '/resourcecenter',
                views: {
                    'permission': {
                        templateUrl: './manageConfig/roleManageMent/permissionAssignment/template/main.html',
                        controller: 'resourceCenterPermission'
                    }
                }
            });
    }]);
