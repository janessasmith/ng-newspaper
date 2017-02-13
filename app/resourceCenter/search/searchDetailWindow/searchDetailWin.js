"use strict";
angular.module('searchDetailWinModule', [])
    .controller('resSearchDetailWinCtrl', ['$scope', '$modalInstance', 'item', function($scope, $modalInstance, item) {
        initData();

        function initData() {
            $scope.item = item;
        }

        $scope.close = function() {
            $modalInstance.dismiss();
        };

        
    }]);
