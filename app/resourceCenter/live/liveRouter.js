"use strict";
/**直播模块路由**/
angular.module('resourceCenterLiveRouterMoudle', []).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('resourcectrl.liveshow.resource', {
        url: "/resource?liveid",
        views: {
            'resource@resourcectrl.liveshow': {
                templateUrl: "./resourceCenter/live/live_tpl.html",
                controller: "resourceCenterLiveController"
            }
        }
    }).state('resourcectrl.hoster.resource', {
        url: "/resource",
        views: {
            'resource@resourcectrl.hoster': {
                templateUrl: "./resourceCenter/live/modal/hoster/hoster.html",
                controller: "liveHosterCtrl"
            }
        }
    }).state('resourcectrl.reply.resource', {
        url: "/resource?zhutiid",
        views: {
            'resource@resourcectrl.reply': {
                templateUrl: "./resourceCenter/live/modal/replyList/replyList.html",
                controller: "liveReplyListCtrl"
            }
        }
    });
}]);
