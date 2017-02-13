/**
 *  Module 任务指派
 *  Author:yuzhou 
 */
"use strict";
angular.module('taskRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('plan.taskassign', {
                url: '/taskassign',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/task/taskAssignment/taskAssignment_tpl.html',
                        controller: 'taskAssignmentCtrl'
                    },

                }
            })
            .state('plan.taskview', {
                url: '/taskview',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/task/taskView/taskView_tpl.html',
                        controller: 'taskViewCtrl'
                    },

                }
            })
            .state('plan.messageassign', {
                url: '/messageassign',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/task/infoAssignment/infoAssignment_tpl.html',
                        controller: 'infoAssignmentCtrl'
                    },

                }
            })
            .state('plan.messageassign.setting', {
                url: '/messageassign/setting',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/task/infoAssignment/infoType.html',
                        controller: 'infoTypeCtrl'
                    },

                }
            })
            .state('plan.messageview', {
                url: '/messageview',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/command/task/infoView/infoView_tpl.html',
                        controller: 'infoViewCtrl'
                    },

                }
            })
    }]);
