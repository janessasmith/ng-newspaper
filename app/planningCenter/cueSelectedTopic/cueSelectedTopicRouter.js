"use strict"; 
angular.module('PlanCueSelectedTopicRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state("plan.timecue", {
                url: '/timecue',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/timeCue/main_tpl.html',
                        controller: 'timeCueMainController'
                    }
                }
            })
            .state('plan.cuemonitor', {
                url: '/cuemonitor',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/cueMonitoring_tpl.html',
                        controller: 'PlanCueSelectedTopicController'
                    }
                }
            })
            .state("plan.rankinglist", {
                url: '/rankinglist',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/rankingList/rankingList_tpl.html',
                        controller: 'rankingListController'
                    },
                    'wechatpostlist@plan.rankinglist': {
                        templateUrl: './planningCenter/cueSelectedTopic/rankingList/weChatPostList/wetChatPostList_tpl.html',
                        controller: "weChatPostListCtrl"
                    }
                }
            })
            .state("plan.custommonitor", {
                url: '/custommonitor',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/customMonitor/customMonitor_tpl.html',
                        controller: 'customMonitorController'
                    }
                }
            });
    }]);
