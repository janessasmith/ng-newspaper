/*
    Create by BaiZhiming 2015-12-26
*/
"use strict";
angular.module("copyIdsModule", ["ngClipboard"])
    .config(['ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath("./lib/zeroclipboard/ZeroClipboard.swf");
    }])
    .controller("copyIdsCtrl", ["$scope", "$modalInstance", "copyParams", "trsconfirm", function($scope, $modalInstance, copyParams, trsconfirm) {
        $scope.ids = copyParams.ids;
        $scope.copyIds = function() {
            trsconfirm.alertType("复制成功", "", "success", false, function() {
                $modalInstance.close();
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
