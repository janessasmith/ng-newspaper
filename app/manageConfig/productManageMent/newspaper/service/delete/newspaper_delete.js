"use strict";
angular.module("productManageMentNewspaperDeleteViewsModule", [])
    .controller("productManageMentNewspaperDeleteViewsCtrl", ["$scope", "$modalInstance", "widgetParams", function ($scope, $modalInstance, widgetParams) {
        init();
        $scope.cancel = function () {
           $modalInstance.dismiss('cancel');
        };
        $scope.deleteViews = function () {
            $modalInstance.close("confirm");
        };
        function inti(){
            $scope.viewName = widgetParams.SITEDESC;
        }
    }]);