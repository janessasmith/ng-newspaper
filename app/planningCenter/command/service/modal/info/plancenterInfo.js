'use strict';
angular.module('plancenterInfoModule', [])
.controller('infoViewModalCtrl', function($scope, $modalInstance, $state, $location, info) {
    $scope.info = info;
    $scope.close = function() {
        $modalInstance.dismiss();
    };
})