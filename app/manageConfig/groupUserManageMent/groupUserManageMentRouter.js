"use strict";
angular.module("groupUserManageMentRouterModule", ['groupManageMentModule', 'gUserManageMentModule', 'gGroupManageMentModule', 'groupManageMentLeftModule'])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.groupmanage", {
            url: '/groupmanage',
            views: {
                'main@manageconfig': {
                    templateUrl: './manageConfig/groupUserManageMent/main_tpl.html',
                    controller: 'groupManageMentController'
                },
                'header@manageconfig': {
                    templateUrl: './manageConfig/header_tpl.html',
                    controller: "manageConfigHeaderCtrl"
                },
                'left@manageconfig.groupmanage':{
                    templateUrl: './manageConfig/groupUserManageMent/left_tpl.html',
                    controller: 'groupManageMentLeftCtrl',
                }
            }
        }).state("manageconfig.groupmanage.group", {
            url: '/group?groupid',
            views: {
                'right@manageconfig.groupmanage': {
                    templateUrl: './manageConfig/groupUserManageMent/group/gGroupManageMent_tpl.html',
                    controller: 'gGroupManageMentController'
                },
            }
        }).state("manageconfig.groupmanage.user", {
            url: '/user?status&groupid',
            views: {
                'right@manageconfig.groupmanage': {
                    templateUrl: './manageConfig/groupUserManageMent/user/gUserManageMent_tpl.html',
                    controller: 'gUserManageMentController'
                },
            }
        });
    }]);
