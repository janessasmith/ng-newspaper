"use strict";
/**
 * operateCenterLeftModule 
 *
 * Description 运营中心左侧
 * Aurthor:SMG 2016-4-19
 */
angular.module('operateCenterLeftModule', [])
    .controller('operateCenterLeftCtrl', ['$scope', '$window', 'trsHttpService', function($scope, $window, trsHttpService) {
        $scope.openPaymentSystem = function() {
            $window.open(trsHttpService.getPaymentSystem());
        }
    }]);
