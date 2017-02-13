/**
 * Created by ma.rongqin on 2016/2/15.
 */
"use strict";
angular.module("manConSysSouCenRecycleDeleteModule", [])
    .controller("manConSysSouCenRecycleDeleteCtrl", ["$scope","$modalInstance", "params",function ($scope,$modalInstance,params) {
        initStatus();
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
        $scope.confirm = function () {
            $modalInstance.close({});
        };
        function initStatus() {
            $scope.item = params.title;
            $scope.content = params.content;
        }
    }]);