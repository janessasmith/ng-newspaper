/**
 * Created by MRQ on 2016/1/15.
 */
'use strict';
angular.module("myZoneModule",[
    'initMyZoneDropDownModule',
    'myZoneRouterModule',
    'myZoneMainModule',
    'myZonePersonalInfoModule'
])
    .controller("myZoneController",['$scope',function($scope){
    }
]);
