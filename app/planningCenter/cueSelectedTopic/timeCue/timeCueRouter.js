"use strict";
angular.module('timeCueRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('plan.timecue.monitor', {
                url: '/monitor',
                views: {
                    'main@plan.timecue': {
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/brokeMonitor/brokeMonitor_tpl.html',
                        controller: 'timeCueBrokeMonitorController'
                    },
                    'nav@plan.timecue':{
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/timeCue_tpl.html',
                        controller: 'timeCueController'
                    }
                }
            }).state('plan.timecue.policy', {
                url: '/policy',
                views: {
                    'main@plan.timecue': {
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/recentPolicy/recentPolicy_tpl.html',
                        controller: 'timeCueRecentPolicyController'
                    },
                    'nav@plan.timecue':{
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/timeCue_tpl.html',
                        controller: 'timeCueController'
                    }
                }
            }).state('plan.timecue.warnings', {
                url: '/warnings',
                views: {
                    'main@plan.timecue': {
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/recentWarnings/recentWarnings_tpl.html',
                        controller: 'timeCueRecentWarningsController'
                    },
                    'nav@plan.timecue':{
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/timeCue_tpl.html',
                        controller: 'timeCueController'
                    }
                }
            }).state('plan.timecue.history', {
                url: '/history',
                views: {
                    'main@plan.timecue': {
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/historyToday/historyToday_tpl.html',
                        controller: 'timeCueHistoryTodayController'
                    },
                    'nav@plan.timecue':{
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/timeCue_tpl.html',
                        controller: 'timeCueController'
                    }
                }
            }).state('plan.timecue.schedule', {
                url: '/schedule',
                views: {
                    'main@plan.timecue': {
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/recentSchedule/recentSchedule_tpl.html',
                        controller: 'timeCueRecentScheduleController'
                    },
                    'nav@plan.timecue':{
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/timeCue_tpl.html',
                        controller: 'timeCueController'
                    }
                }
            });
    }]);
