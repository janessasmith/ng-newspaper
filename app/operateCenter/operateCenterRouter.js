"use strict";
/**
 * operpateCenterRouterModule 
 *
 * Description 运营中心主路由
 * Aurthor:wang.jiang 2016-3-1
 */
angular.module('operpateCenterRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.
        state('operatecenter', {
            url: '/operatecenter',
            views: {
                '': {
                    templateUrl: './operateCenter/main_tpl.html',
                    controller: "operateCenterCtrl"
                },
                'header@operatecenter': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'left@operatecenter': {
                    templateUrl: './operateCenter/left_tpl.html',
                    controller: 'operateCenterLeftCtrl'
                },
                'main@operatecenter': {
                    templateUrl: './operateCenter/propagationAnalysis/main_tpl.html'
                },
                'footer@operatecenter': {
                    templateUrl: './footer_tpl.html'
                }
            }
        }).state('im', {
            url: '/im',
            views: {
                '': {
                    templateUrl: './components/util/IM/template/IM_tpl.html',
                    controller: "trsImController"
                }
            }
        });
    }]);