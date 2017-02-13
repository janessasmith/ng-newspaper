/**
 * Created by ma.rongqin 2016.3.5
 */
"use strict";
angular.module('editCenNewspaperTextDesignationModule', [])
    .controller('editCenNewspaperTextDesignationCtrl', ['$scope', "$modalInstance", '$validation', function($scope, $modalInstance, $validation) {
        initData();

        function initData() {}

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.textDesignationForm).success(function() {
                var params = {
                    content: $scope.content
                }
                $modalInstance.close(params);
            });
        };
    }]);
