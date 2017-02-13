/*
    Author:XCL
    Time:2016-01-05
*/
"use strict";
angular.module("productManageMentModifyZPLayoutModule", [])
    .controller("productManageMentModifyZPLayoutCtrl", ["$scope", "$stateParams", "$validation", "$q", "$modalInstance", "trsHttpService", "initSingleSelecet", "trsconfirm", "selectedItem", function($scope, $stateParams, $validation, $q, $modalInstance, trsHttpService, initSingleSelecet, trsconfirm, selectedItem) {
        initStatus();
        initData();

        function initData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.dieciId = data.DIECIID;
                initNewspaperName();
            });
        }

        function initStatus() {
            $scope.selectedItem = angular.copy(selectedItem);
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findBanMianById",
                "ChannelId": selectedItem.CHANNELID
            };
        }
        //保存
        $scope.save = function() {
            save().then(function(data) {
                $modalInstance.close("save");
            });

        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        function save() {
            var deferred = $q.defer();
            $validation.validate($scope.ZPLayoutForm).success(function() {
                $scope.params = {
                    "serviceid": "mlf_paperset",
                    "methodname": "saveZhaoPaiBanMian",
                    "ObjectId": $scope.selectedItem.CHANNELID,
                    "ChnlDesc": $scope.selectedItem.CHNLDESC,
                    "SimpleName": $scope.selectedItem.SIMPLENAME,
                    "SiteId": $stateParams.paper,
                    "DieCiId": $scope.dieciId
                };
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                    deferred.resolve();
                });
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请填写必填项", "error", false, function() {});
            });
            return deferred.promise;
        }
        //初始化报纸名称
        function initNewspaperName() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findPaperById",
                "SiteId": $stateParams.paper
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                $scope.paper = data;
            });
        }
    }]);
