"use strict";
angular.module("productManageMentNewspaperEnableViewsModule", [])
    .controller("productManageMentNewspaperEnableViewsCtrl", ["$scope", "$modalInstance", "widgetParams", function($scope, $modalInstance, widgetParams) {
        init();
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.confirm = function() {
            $modalInstance.close("confirm");
        };

        function init() {
            $scope.viewName = widgetParams.SITEDESC;
        }
    }]);
