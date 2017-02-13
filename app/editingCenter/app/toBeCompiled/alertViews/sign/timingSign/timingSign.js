/*
    Create By BaiZhiming 2015-11-12
*/
'use strict';
angular.module("toBeCompiledTimingSignModule", ["mgcrea.ngStrap.timepicker", "mgcrea.ngStrap.datepicker"])
    .controller("toBeCompiledTimingSignCtrl", ["$scope", "$timeout", "trsHttpService", "$stateParams", "$filter", "SweetAlert", "$modalInstance", "params", function($scope, $timeout, trsHttpService, $stateParams, $filter, SweetAlert, $modalInstance, params) {
        initStatus();
        $scope.sendTimeSigned = function() {
            var timeSigned = $filter('date')($scope.status.sharedDate, "yyyy-MM-dd HH:mm").toString();
            $modalInstance.close(timeSigned);
        };
        //暂留
        $scope.deleteTimeSigned = function(index) {
            params.selectedArray.splice($scope.data.items.indexOf(index), 1);
        };
        //取消关闭开始
        $scope.cancelTimeSigned = function() {
            $modalInstance.dismiss('cancel');
        };

        function initStatus() {
            $scope.status = {
                sharedDate: new Date(),
                isNewDraft: params.isNewDraft,
            };
            $scope.data = {
                items: params.selectedArray
            };
        }
    }]);
