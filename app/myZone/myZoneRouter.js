/**
 * Created by MRQ on 2016/1/15.
 */
"use strict";
angular.module('myZoneRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("myzone", {
            url: '/myzone',
            views: {
                '': {
                    templateUrl: './myZone/index_tpl.html',
                    controller: 'myZoneController'
                },
                'head@myzone': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'main@myzone': {
                    templateUrl:'./myZone/main_tpl.html',
                    controller:'myZoneMainCtrl'
                }
            }
        })
    }]);
