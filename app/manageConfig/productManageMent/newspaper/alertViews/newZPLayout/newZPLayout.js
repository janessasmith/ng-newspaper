/*
    Author:XCL
    Time:2016-01-05
*/
"use strict";
angular.module("productManageMentNewZPLayoutModule", [])
    .controller("productManageMentNewZPLayoutCtrl", ["$scope", "$stateParams", "$validation", "$q", "$modalInstance", "trsHttpService", "initSingleSelecet", "trsconfirm", "trsspliceString", "params", function($scope, $stateParams, $validation, $q, $modalInstance, trsHttpService, initSingleSelecet, trsconfirm, trsspliceString, params) {
        initStatus();
        initData();

        function initData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.paper = data;
            });
            dieciDroplist();
            getZPInfo();
            $scope.layoutName = params.selctedBanMian != '' ? params.selctedBanMian : '';
            $scope.shortTitle = params.selectedJianChen != '' ? params.selectedJianChen : '';
        }

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findPaperById",
                "SiteId": $stateParams.paper
            };
            $scope.chnlnames = "";
        }

        $scope.getDieciData = function() {
            $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
        };

        //保存
        $scope.save = function() {
            save().then(function() {
                $modalInstance.close("save");
            });

        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //保存并新建
        $scope.saveNew = function() {
            save().then(function() {
                var returnData = {
                    previousDieCi: $scope.dieciDroplistSelected,
                    prviousBanMian: $scope.layoutName,
                    prviousJianChen: $scope.shortTitle,
                };
                $modalInstance.close(returnData);
            });
        };

        function save() {
            var deferred = $q.defer();
            $validation.validate($scope.ZPLayoutForm).success(function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "saveZhaoPaiBanMian";
                $scope.params.ObjectId = 0;
                $scope.params.ChnlDesc = $scope.layoutName;
                $scope.params.SimpleName = $scope.shortTitle;
                $scope.params.SiteId = $stateParams.paper;
                $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                    deferred.resolve();
                });
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请填写必填项", "error", false, function() {});
            });
            return deferred.promise;
        }

        //初始化叠次下拉框
        function dieciDroplist() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paper,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
                var dieciDroplistJson = data;
                var options = [];
                for (var key in dieciDroplistJson) {
                    options.push({
                        name: dieciDroplistJson[key].CHNLDESC,
                        value: dieciDroplistJson[key].CHANNELID
                    });
                }
                $scope.dieciDroplistJson = options;

                $scope.dieciDroplistSelected = params.selectedDieCi != '' ? params.selectedDieCi : angular.copy($scope.dieciDroplistJson[0]);
            });
        }

        //获取照排信息(为了判断是否存在同名的版面简称)
        function getZPInfo() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryZhaoPaiBanMians",
                "PaperId": $stateParams.paper
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.chnlnames = trsspliceString.spliceString(data.DATA,
                    'CHNLNAME', ',');
            });
        }
    }]);
