"use strict";
/**
 * visualizationCenterRouterModule 
 *
 * Description 可视化主路由
 * Aurthor:wang.jiang 2016-3-1
 */
angular.module('visualizationCenterRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('visualizationcenter', {
            url: '/visualizationcenter',
            views: {
                '': {
                    templateUrl: './visualizationCenter/main_tpl.html',
                    controller: "visualizationCenterCtrl"
                },
                'header@visualizationcenter': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                }
            }
        });
    }]);