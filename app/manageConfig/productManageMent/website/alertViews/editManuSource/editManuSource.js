/**
 * Author:XCL
 * Time:2016-01-08
 */

"use strict";
angular.module('editManuSourceModule', [])
    .controller('editManuSourceCtrl', ['$scope', '$validation', '$modalInstance', 'allData', 'trsconfirm', function($scope, $validation, $modalInstance, allData, trsconfirm) {
        initStatus();

        function initStatus() {
            $scope.topTitle = allData.topTitle;
            $scope.srcName = allData.title;
            $scope.srcLink = allData.url;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.confirm = function() {
            var returnData = {
                'srcName': $scope.srcName,
                'srcLink': $scope.srcLink
            };
            $validation.validate($scope.editManuSrcForm).success(function() {
                $modalInstance.close(returnData);
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请填写必填项", "error", false, function() {});
            });
        };
    }]);
