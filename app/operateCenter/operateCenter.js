"use strict";
/**
 * operateCenterModule 
 *
 * Description 运营中心
 * Aurthor:SMG 2016-4-19
 */
angular.module('operateCenterModule', [
    'operpateCenterRouterModule',
    'operateCenterLeftModule',
    'operateCenterPaymentSystemModule',
    'operateCenterPropagationAnalysisModule',
])
.controller('operateCenterCtrl', operateCenter);
operateCenter.$injector = ['$scope', '$state', '$location'];

function operateCenter($scope, $state, $location) {

}
