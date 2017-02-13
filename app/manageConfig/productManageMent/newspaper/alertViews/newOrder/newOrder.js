/*
 Create by LIS  2016-01-07
 */
"use strict";
angular.module("productManageMentNewOrderModule", [])
    .controller("productManageMentNewOrderCtrl", ["$scope", "$validation", "$timeout", "callback", "trsHttpService", "$stateParams", "$modalInstance", "getNewsNameService", function($scope, $validation, $timeout, callback, trsHttpService, $stateParams, $modalInstance, getNewsNameService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findPaperById",
                "SiteId": $stateParams.paper
            };
        }

        function initData() {
            $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                $scope.paper = data;
            });
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $timeout(function() {
            $scope.confirm = function() {
                $validation.validate($scope.newOrderForm).success(function() {
                    callback($scope.content);
                    $modalInstance.close();
                });
            };
        })
    }]);
