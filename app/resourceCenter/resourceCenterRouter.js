"use strict";
angular.module('resourceCenterRouterModule', []).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
    $stateProvider.state("resourcectrl", {
            url: '/resourcectrl',
            views: {
                '': {
                    templateUrl: './resourceCenter/resourceCenter.html',
                    controller: 'resWebsiteCtrl'
                },
                'head@resourcectrl': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'nav@resourcectrl': {
                    templateUrl: './resourceCenter/nav_tpl.html',
                    controller: 'resCenterSubTabCtrl'
                },
                'content@resourcectrl': {
                    templateUrl: './resourceCenter/main_tpl.html'
                },
                'footer@resourcectrl': {
                    templateUrl: './footer_tpl.html'
                }
            }
        }).state('resourcectrl.iwo', { //iwo资源
            url: '/iwo?typename',
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterIwoLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state("resourcectrl.iwo.resource", {
            url: '/resource?nodeid&nodename&modalid&change',
            views: {
                'resource@resourcectrl.iwo': {
                    templateUrl: './resourceCenter/iwo/iwo_main_tpl.html',
                    controller: 'resourceCenterIwoCtrl'
                }
            }
        }).state("retrieval.resmanage", { //资源管理
            url: '/resmanage',
            views: {
                'main@retrieval': {
                    templateUrl: './resourceCenter/iwo/leftMenuContent/resourceMengement.html',
                    controller: "resMangementCtrl"
                }
            }
        }).state("retrieval.subscribe", { //资源管理(为策划中心的自定义跳转添加一个参数isControl)
            url: '/subscribe?parentId&sourceId&isControl&channelType&title',
            views: {
                'main@retrieval': {
                    templateUrl: './resourceCenter/iwo/leftMenuContent/subscribe.html',
                    controller: "resSubscribeCtrl"
                }
            }
        }).state('resourcectrl.xinhua', { //新华社稿
            url: "/xinhua?typename&modalid",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.share', { //共享稿库
            url: "/share?typename&modalid",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.liveshow', { //直播
            url: "/liveshow",
            views: {
                'left@resourcectrl': {
                    templateUrl: "./resourceCenter/live/live_left.html",
                    controller: "liveLeftCtrl"
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.hoster', { //主持人
            url: "/hoster",
            views: {
                'left@resourcectrl': {
                    templateUrl: "./resourceCenter/left_tpl.html",
                    controller: "resourceCenterLeftCtrl"
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.reply', { //直播回复
            url: "/reply",
            views: {
                'left@resourcectrl': {
                    templateUrl: "./resourceCenter/left_tpl.html",
                    controller: "resourceCenterLeftCtrl"
                },
                'main@resourcectrl': {
                    templateUrl: "./resourceCenter/resource_main_tpl.html"
                }
            }
        }).state('resourcectrl.stock', { //集团成品库
            url: "/stock?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }

            }
        }).state('resourcectrl.picture', { //图片库
            //川报修改()
            url: "/picture?typename&modalid",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/cbPicLeft_tpl.html',
                    controller: 'cbPicLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        })
        //川报修改
        .state('resourcectrl.custom', { //自定义稿件
            url: "/custom?typename&modalid&type&desc&customid",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/cbCustom/cbCustomLeft_tpl.html',
                    controller: 'cbCustomLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        })
        .state('resourcectrl.video', { //视频库
            url: "/video?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/cbPicLeft_tpl.html',
                    controller: 'cbPicLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.website', { //网站
            url: "/website?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.website.resource', {
            url: '/resource?nodeid&nodename',
            views: {
                'resource@resourcectrl.website': {
                    templateUrl: './resourceCenter/website/main_tpl.html',
                    controller: 'resWebsiteMainCtrl'
                }
            }
        }).state('resourcectrl.wechat', { //微信
            url: "/wechat?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.wechat.resource', {
            url: '/resource?nodeid&nodename',
            views: {
                'resource@resourcectrl.wechat': {
                    templateUrl: './resourceCenter/wechat/main_tpl.html',
                    controller: 'resWebsiteMainCtrl'
                }
            }
        }).state('resourcectrl.app', { //app
            url: "/app?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.app.resource', {
            url: '/resource?nodeid&nodename',
            views: {
                'resource@resourcectrl.app': {
                    templateUrl: './resourceCenter/website/main_tpl.html',
                    controller: 'resWebsiteMainCtrl'
                }
            }
        }).state('resourcectrl.weibo', { //微博
            url: "/weibo?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.weibo.resource', {
            url: '/resource?nodeid&nodename',
            views: {
                'resource@resourcectrl.weibo': {
                    templateUrl: './resourceCenter/weibo/main_tpl.html',
                    controller: 'resCenWeiboMainCtrl'
                }
            }
        }).state('resourcectrl.digital', { //数字报
            url: "/digital?typename",
            views: {
                'left@resourcectrl': {
                    templateUrl: './resourceCenter/left_tpl.html',
                    controller: 'resourceCenterLeftCtrl'
                },
                'main@resourcectrl': {
                    templateUrl: './resourceCenter/resource_main_tpl.html'
                }
            }
        }).state('resourcectrl.digital.resource', {
            url: '/resource?nodeid&nodename&isShowPreview',
            views: {
                'resource@resourcectrl.digital': {
                    templateUrl: './resourceCenter/website/main_tpl.html',
                    controller: 'resWebsiteMainCtrl'
                }
            }
        }).state('resourcectrl.digital.preview', {
            url: '/preview?nodeid&nodename&isShowPreview',
            views: {
                'resource@resourcectrl.digital': {
                    templateUrl: './resourceCenter/digitalnews/preview_tpl.html',
                    controller: 'resCenDigitalPreviewCtrl'
                }
            }
        })
        // .state('resourcectrl.digital.preview.detail', {
        //     url: '/detail',
        //     views: {
        //         '': {
        //             templateUrl: './resourceCenter/digitalnews/detail/detail_tpl.html',
        //             controller: 'resCenDigitalPreviewDetailCtrl'
        //         }
        //     }
        // })
        .state('digitaldetail', {
            url: '/digitaldetails?nodeid&bc&docpubtime&serviceid',
            views: {
                '': {
                    templateUrl: './resourceCenter/digitalnews/detail/detail_tpl.html',
                    controller: 'resCenDigitalPreviewDetailCtrl'
                }
            }
        })
        // .state('digitaldetail', {
        //     url: '/digitaldetails',
        //     views: {
        //         '': {
        //             templateUrl: './resourceCenter/digitalnews/detail/digitalDetail_tpl.html',
        //             controller: 'resCenDigitalDetailCtrl'
        //         }
        //     }
        // })
        .state("retrieval", { //高级检索
            url: '/retrieval?typename&channelName',
            views: {
                '': {
                    templateUrl: './resourceCenter/retrieval/retrieval.html'
                },
                'head@retrieval': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'nav@retrieval': {
                    templateUrl: './resourceCenter/nav_tpl.html',
                    controller: 'resCenterSubTabCtrl'
                },
                'main@retrieval': {
                    templateUrl: './resourceCenter/retrieval/retrieval_main_tpl.html',
                    controller: "resCenRetCtrl"
                },
                'footer@index': {
                    templateUrl: './footer_tpl.html'
                }
            }
        }).state("retrieval.allsearch", { //全库搜索
            url: '/allsearch?planKey',
            views: {
                'main@retrieval': {
                    templateUrl: './resourceCenter/search/search.html',
                    controller: "resCenSearchCtrl"
                }
            }
        }).state("resourcectrl.more", {
            url: "/more?type&method",
            views: {
                'body@resourcectrl': {
                    templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/more/cueMonitorMore_tpl.html',
                    controller: 'cueMonitorMoreCtrl'
                }
            }
        }).state("resourcectrl.type", {
            url: "/information?type&keyword",
            views: {
                'body@resourcectrl': {
                    templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/more/cueMonitorMore_tpl.html',
                    controller: 'planCenterTrelatedinformationCtrl'
                }
            }
        }).state("resourcectrl.hotKey", {
            url: "/eventcorrelation?hotKey",
            views: {
                'body@resourcectrl': {
                    templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/more/cueMonitorMore_tpl.html',
                    controller: 'planCenterEventCorrelationHotKeyCtrl'
                }
            }
        }).state("resourcedetail", { //资源中心细览详情
            // 川报修改
            url: "/resourcedetail?guid&channel&service&indexname&xhsgsourceid&xhsgtype&customid",
            views: {
                '': {
                    templateUrl: './resourceCenter/detail/detail_tpl.html',
                    controller: 'resourceCenterDetailCtrl'
                }
            }
        }).state("appresourcedetail", { //辅助写作细览
            url: "/appresourcedetail?guid&indexname",
            views: {
                '': {
                    templateUrl: './resourceCenter/appresourcedetail/appresourcedetail_tpl.html',
                    controller: 'appResourceDetailCtrl'
                }
            }
        }).state("resourcegxgkdetail", { //资源中心共享稿库细览详情
            //川报修改
            url: "/resourcegxgkdetail?metadataid&type&iscbpic",
            views: {
                '': {
                    templateUrl: './resourceCenter/gxgkDetail/gxgkDetail_tpl.html',
                    controller: 'resourceCenterGxgkDetailCtrl'
                }
            }
        })
        //川报修改:音视频
        .state("mediaDetail", {
            url: "/mediadetail?metadataid",
            views: {
                '': {
                    templateUrl: './resourceCenter/mediaDetail/video_tpl.html',
                    controller: 'videoCtrl'
                }
            }
        });
}]);
