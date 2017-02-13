"use strict";
angular.module('planningCenterRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('plan', {
                url: '/plan',
                views: {
                    '': {
                        templateUrl: './planningCenter/main_tpl.html',
                        controller: 'planningCenterController'
                    },
                    'head@plan': {
                        templateUrl: './header_tpl.html',
                        controller: 'HeaderController'
                    },
                    'left@plan': {
                        templateUrl: './planningCenter/left_tpl.html',
                        controller: 'planningCenterLeftController'
                    },
                    // 'main@plan': {
                    //     // templateUrl: './planningCenter/main_tpl.html'
                    //     //controller: 'angularUiTreeController'
                    // },
                    'footer@plan': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            })
            .state("plancueOverview", {
                url: "/plan/plancueOverview?serviceid&modelid&disasterType&region&time",
                views: {
                    "": {
                        templateUrl: "./planningCenter/plancueOverview.html",
                    },
                    'head@plancueOverview': {
                        templateUrl: './header_tpl.html',
                        controller: 'HeaderController'
                    },
                    'main@plancueOverview': {
                        templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/overview/overView.html",
                        controller: "plancueOverviewCtrl"
                    },
                    'footer@plancueOverview': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            }).state("monitorOverview", { //监控概览
                url: "/monitoroverview?id",
                views: {
                    "": {
                        templateUrl: "./planningCenter/plancueOverview.html",
                    },
                    'head@monitorOverview': {
                        templateUrl: './header_tpl.html',
                        controller: 'HeaderController'
                    },
                    'main@monitorOverview': {
                        templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/more/cueMonitorMore_tpl.html",
                        controller: "cueMonitorMoreCtrl"
                    },
                    'footer@monitorOverview': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            }).state("weibodisclose", { //微博爆料概览
                url: "/plan/weibodisclose",
                views: {
                    '':{
                        templateUrl:'./planningCenter/cueSelectedTopic/cueMonitoring/weiboDiscloseMore/main_tpl.html'
                    },
                    'head@weibodisclose': {
                        templateUrl: './header_tpl.html',
                        controller: 'HeaderController'
                    },
                    'overviewbody@weibodisclose': {
                        templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/weiboDiscloseMore/weiboDiscloseMore_tpl.html',
                        controller: 'cueMonitorWeiboDiscloseMoreCtrl'
                    },
                    'overviewfooter@weibodisclose': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            }).state("qianjiang", { //96068概览
                url: "/plan/qianjiang",
                views: {
                    '':{
                        templateUrl:'./planningCenter/cueSelectedTopic/cueMonitoring/weiboDiscloseMore/main_tpl.html'
                    },
                    'head@qianjiang': {
                        templateUrl: './header_tpl.html',
                        controller: 'HeaderController'
                    },
                    'overviewbody@qianjiang': {
                        templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/qianjiangMore/qianjiangMore_tpl.html',
                        controller: 'cueMonitorQianjiangMoreCtrl'
                    },
                    'overviewfooter@qianjiang': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            }).state("hotpointcluster",{
                url:'/plan/hotpointcluster?guids',
                 views: {
                    '':{
                        templateUrl:'./planningCenter/cueSelectedTopic/cueMonitoring/weiboDiscloseMore/main_tpl.html'
                    },
                    'head@hotpointcluster': {
                        templateUrl: './header_tpl.html',
                        controller: 'HeaderController'
                    },
                    'overviewbody@hotpointcluster': {
                        templateUrl: './planningCenter/cueSelectedTopic/hotHeadLine/template/hotGather/hotGather_tpl.html',
                        controller: 'planHotGatheCtrl'
                    },
                    'overviewfooter@hotpointcluster': {
                        templateUrl: './footer_tpl.html'
                    }
                }
            });
    }]);
