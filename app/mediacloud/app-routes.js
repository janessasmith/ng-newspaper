"use strict";
define(function (require) {
    
    var app = require('app');
    require('./lib/echarts/echarts-angular');
    require('./common/servers');
    require('./common/directives');
    require('./common/controller');
    require('./common/filters');

    app.run(['$state', '$stateParams', '$rootScope',function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);

    app.config(['$stateProvider', '$urlRouterProvider','w5cValidatorProvider','$httpProvider',function ($stateProvider, $urlRouterProvider,w5cValidatorProvider,$httpProvider) {
    	
    	//IE不缓存XHR请求
    	$httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        
    	// 配置表单验证信息
        w5cValidatorProvider.config({
            blurTrig: true,
            showError: true,
            removeError: true
        });

        w5cValidatorProvider.setRules({
            username: {
                required: "输入的用户名不能为空"
            },
            unit: {
                required: "所属单位不能为空"
            },
            type: {
                required: "所属类别不能为空"
            },
            img_name: {
                required: "所属头像不能为空"
            },
            wxid: {
                required: "所属原始ID不能为空"
            },
            AppId:{
                required:"AppId不能为空"
            },
            AppSecret:{
                required:"AppSecret不能为空"
            }
        });
        $urlRouterProvider.otherwise('/home');
        $stateProvider
        //系统首页
        .state('home', {
            url: "/home",
            views: {
                '': {
                    templateUrl: "home/tpls/home.html",
                    controllerUrl: '/mediacloud/home/controllers.js',
                    dependencies: [
                        'home/servers.js',
                        'home/directive.js'
                    ]
                },
                'newWeixinList@home': {
                    templateUrl: "home/tpls/newWeixinList.html"
                },
                'weixinHome@home': {
                    templateUrl: "home/tpls/weixinHome.html"
                },
                'newWeiboList@home': {
                    templateUrl: "home/tpls/newWeiboList.html"
                },
                'weiboHome@home': {
                    templateUrl: "home/tpls/weiboHome.html"
                }
            }
        })
        //微博集团监控
        .state('scmoperation', {
                url: "/scmoperation",
                views: {
                    "": {
                        templateUrl: "monitor/scm/operation/tpls/home.html",
                        controllerUrl: '/mediacloud/monitor/scm/operation/js/controllers.js',
                        dependencies: [
                            'monitor/scm/operation/js/servers',
                            'monitor/scm/operation/js/directives'
                         ]
                    },
                    "wbzk@scmoperation": {
                        templateUrl: "monitor/scm/operation/tpls/weiboSituation.html",
                        controller: "wbsituationCtr"
                    },
                    "wbbd@scmoperation": {
                        templateUrl: "monitor/scm/operation/tpls/weiboSeniority.html",
                        controller: "wbseniorityCtr"
                    },
                    "rk@scmoperation": {
                        templateUrl: "monitor/scm/operation/tpls/accountList.html",
                        controller: "wbjtUnitViewCtr"
                    },
                    "wbzx@scmoperation": {
                        templateUrl: "monitor/scm/operation/tpls/weiboNew.html",
                        controller: "newWeiboCtr"
                    },
                    "wbrd@scmoperation": {
                        templateUrl: "monitor/scm/operation/tpls/weiboHot.html",
                        controller: "hotwbNewsCtr"
                    },
                    "wbyy@scmoperation": {
                        templateUrl: "monitor/scm/operation/tpls/weiboOperation.html",
                        controller: "weiboOperationCtr"
                    }
                }
            })
         //集团子单位
        .state('childWeibo', {
            url: "/childWeibo?unitName",
            views: {
                '': {
                    templateUrl: "monitor/scm/childWeibo/tpls/home.html",
                    controllerUrl: '/mediacloud/monitor/scm/childWeibo/js/controllers.js',
                    dependencies: [
                        'monitor/scm/childWeibo/js/servers'
                    ]
                },
                'subAccount@childWeibo': {
                    templateUrl: "monitor/scm/childWeibo/tpls/subAccount.html",
                    controller: "wbAccountListCtrl"
                },
                'situationMap@childWeibo': {
                    templateUrl: "monitor/scm/childWeibo/tpls/situationMap.html",
                    controller: "wboperatingCtrl"
                },
                'influenceList@childWeibo': {
                    templateUrl: "monitor/scm/childWeibo/tpls/influenceList.html",
                    controller: "wbInfluenceCtrl"
                },
                'latestArticles@childWeibo': {
                    templateUrl: "monitor/scm/childWeibo/tpls/latestArticles.html",
                    controller: "wbLatestArticlesCtrl"
                },
                'hotWeiBo@childWeibo': {
                    templateUrl: "monitor/scm/childWeibo/tpls/hotWeiBo.html",
                    controller: "HotwbCtrl"
                }
            }
        })
        //微博列表
        .state('weiboList', {
            url: "/weiboList",
            templateUrl: "monitor/scm/weiboList/tpls/home.html",
            abstract: true
        })
        .state("weiboList.list", {
            url: '/list?accountId',
            templateUrl: "monitor/scm/weiboList/tpls/weiboList.html",
            controllerUrl: '/mediacloud/monitor/scm/weiboList/js/controllers.js',
            dependencies: [
                'monitor/scm/weiboList/js/servers',
                'monitor/scm/weiboList/js/directives'
            ]
        })
        //微博新闻列表
        .state('weibonewList', {
                url: "/weibonewList",
                templateUrl: "monitor/scm/weibonewList/tpls/home.html",
                abstract: true
            })
            .state("weibonewList.list", {
                url: '/list?accountType&unitName&accountName&orderType&startTime&endTime&search',
                templateUrl: "monitor/scm/weibonewList/tpls/weiboList.html",
                controllerUrl: '/mediacloud/monitor/scm/weibonewList/js/controllers.js',
                controller: 'weiboNewlistCtrl',
                dependencies: [
                    'monitor/scm/weibonewList/js/directives',
                    'monitor/scm/weibonewList/js/servers'
                ]
            })
        //微博排行
        .state('weiboRank', {
                url: "/weiboRank",
                templateUrl: "monitor/scm/weiboRank/tpls/wbNavigation.html",
                abstract: true,
                controller:'wbNavigationCtrl'

            })
        .state("weiboRank.list", {
            url: '/list?unitName&accountType',
            templateUrl: "monitor/scm/weiboRank/tpls/wbContent.html",
            controllerUrl: '/mediacloud/monitor/scm/weiboRank/js/controllers.js',
            controller:'weiboRankListCtrl',
            dependencies: [
                'monitor/scm/weiboRank/js/servers'
            ]
        })

        //微信集团监控
        .state('wxoperation', {
            url: "/wxoperation",
            views: {
                "": {
                    templateUrl: "monitor/wx/operation/tpls/home.html",
                    controllerUrl: '/mediacloud/monitor/wx/operation/js/controllers.js',
                    dependencies: [
                        'monitor/wx/operation/js/servers'
                     ]
                },
                "wxzk@wxoperation": {
                    templateUrl: "monitor/wx/operation/tpls/weiboSituation.html",
                    controller: "wxsituationCtr"
                },
                "wxbd@wxoperation": {
                    templateUrl: "monitor/wx/operation/tpls/weiboSeniority.html",
                    controller: "wxseniorityCtr"
                },
                "rk@wxoperation": {
                    templateUrl: "monitor/wx/operation/tpls/accountList.html",
                    controller: "wxjtUnitViewCtr"
                },
                "wxzx@wxoperation": {
                    templateUrl: "monitor/wx/operation/tpls/weixinNew.html",
                    controller: "newWeixinCtr"
                },
                "wxrd@wxoperation": {
                    templateUrl: "monitor/wx/operation/tpls/weixinHot.html",
                    controller: "hotwxNewsCtr"
                },
                "wxyy@wxoperation": {
                    templateUrl: "monitor/wx/operation/tpls/weiboOperation.html",
                    controller: "weixinOperationCtr"
                }
            }
        })

        //集团子单位
        .state('childWeixin', {
            url: "/childWeixin?unitName",
            views: {
                '':{
                    templateUrl: "monitor/wx/childWeixin/tpls/home.html",
                    controllerUrl: '/mediacloud/monitor/wx/childWeixin/js/controllers.js',
                    dependencies: [
                        'monitor/wx/childWeixin/js/servers'
                    ]
                },
                'subAccount@childWeixin':{
                    templateUrl: "monitor/wx/childWeixin/tpls/subAccount.html",
                    controller: "wxAccountListCtrl"
                },
                'situationMap@childWeixin':{
                    templateUrl: "monitor/wx/childWeixin/tpls/situationMap.html",
                    controller: "wxoperatingCtrl"
                },
                'influenceList@childWeixin':{
                    templateUrl: "monitor/wx/childWeixin/tpls/influenceList.html",
                    controller: "influenceCtrl"
                },
                'latestArticles@childWeixin':{
                    templateUrl: "monitor/wx/childWeixin/tpls/latestArticles.html",
                    controller: "latestArticlesCtrl"
                },
                'hotWeixin@childWeixin':{
                    templateUrl: "monitor/wx/childWeixin/tpls/hotWeixin.html",
                    controller: "HotwxCtrl"
                }
            }
        })
        //微信列表
        .state('weixinList', {
            url: "/weixinList",
            templateUrl: "monitor/wx/weixinList/tpls/home.html",
            abstract:true
        })
        .state("weixinList.list",{
            url:'/list?accountId',
            templateUrl: "monitor/wx/weixinList/tpls/weixinList.html",
            controllerUrl: '/mediacloud/monitor/wx/weixinList/js/controllers.js',
            dependencies: [
                'monitor/wx/weixinList/js/servers'
            ]
        })
        //微信新闻列表
        .state('weixinnewList', {
            url: "/weixinnewList",
            templateUrl: "monitor/wx/weixinnewList/tpls/home.html",
            abstract:true
        })
        .state("weixinnewList.list",{
            url:'/list?accountType&unitName&accountName&orderType&startTime&endTime&search',
            templateUrl: "monitor/wx/weixinnewList/tpls/weixinList.html",
            controllerUrl: '/mediacloud/monitor/wx/weixinnewList/js/controllers.js',
            controller: 'weixinNewlistCtrl',
            dependencies: [
                'monitor/wx/weixinnewList/js/directives',
                'monitor/wx/weixinnewList/js/servers'
            ]
        })
        //微信排行
       .state('weixinRank', {
            url: "/weixinRank",
            templateUrl: "monitor/wx/weixinRank/tpls/wxNavigation.html",
            abstract: true
        })
        .state("weixinRank.list", {
            url: '/list?unitName&accountType',
            templateUrl: "monitor/wx/weixinRank/tpls/wxContent.html",
            controllerUrl: '/mediacloud/monitor/wx/weixinRank/js/controllers.js',
            controller:'weixinRankListCtrl',
            dependencies: [
                'monitor/wx/weixinRank/js/servers'
            ]
        })
        //微博采编
        .state('wbaccount', {
            url: "/wbaccount",
            templateUrl: "editorial/scm/account/tpls/home.html",
            abstract: true,
            controllerUrl:'editorial/scm/account/js/controllers'
        })
        .state('wbaccount.list', {
            url: "/list?UnitId&ClassId&Search",
            templateUrl: "editorial/scm/account/tpls/accountView.html",
            controller:'accountView',
            dependencies: [
                'editorial/scm/account/js/directives'
            ]
        })
        //微信采编
        .state('wxaccount', {
            url: "/wxaccount",
            templateUrl: "editorial/wx/account/tpls/home.html",
            abstract: true
        })
        .state('wxaccount.list', {
            url: '/list?UnitId&ClassId&Search',
            templateUrl: "editorial/wx/account/tpls/accountView.html",
            controllerUrl: 'editorial/wx/account/js/controllers',
            controller:'listCtrl',
            dependencies: [
                'editorial/wx/account/js/directives',
                'editorial/wx/account/js/filters'
            ]
        });
    }]);
});
