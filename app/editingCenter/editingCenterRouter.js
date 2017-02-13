"use strict";
angular.module('editingCenterRouterModule', []).
config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('editctr', {
        url: "/editctr",
        views: {
            "": {
                templateUrl: './editingCenter/index_tpl.html',
                controller: "EditingCenterController",
            },
            "head@editctr": {
                templateUrl: "./header_tpl.html",
                controller: "HeaderController"
            },
            "left@editctr": {
                templateUrl: "./editingCenter/left_tpl.html",
                controller: "editingCenterNavController"
            },
            "main@editctr": {
                templateUrl: './editingCenter/app/toBeCompiled/main_tpl.html'
            },
            "footer@editctr": {
                templateUrl: "./footer_tpl.html"
            }
        },
    }).state('fgd', {
        url: "/fgd?authorids&fgdid&newsid",
        views: {
            '': {
                templateUrl: "./editingCenter/service/fgdIframe/fgdIframe_tpl.html",
                controller: "EditingFgdIframeCtrl"
            }
        }
    }).state('weixinedit', {
        url: '/weixinedit',
        views: {
            '': {
                templateUrl: './editingCenter/weixin/addEdit/main_tpl.html',
                controller: 'WeiXinEditCtrl'
            },
        }
    });
}]);
