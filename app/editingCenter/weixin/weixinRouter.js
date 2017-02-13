"use strict";
angular.module('weixinRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('editctr.weixin', {
        url: "/weixin",
        views: {
            'weixin@editctr':{
                templateUrl:'./editingCenter/weixin/left_tpl.html',
                controller:'WeiXinLeftCtrl',
            }
        }
    }).
    state('wxnews', {
        url: "/wxnews?channelid&metadataid&chnldocid&platform", //platform表示平台类型(待编、待审。以签发)
        views: {
            '': {
                templateUrl:'./editingCenter/weixin/addEdit/main_tpl.html',
                controller:'WeiXinEditCtrl',
            }
        }
    }).
    state('wxPreview', {
        url: "/wxPreview?channelid&metadataid&chnldocid&platform",
        views: {
            '': {
                templateUrl:'./editingCenter/weixin/preview/main_tpl.html',
                controller:'WeiXinPreviewCtrl',
            }
        }
    });
}]);
