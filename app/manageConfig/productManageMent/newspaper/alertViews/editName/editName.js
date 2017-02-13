/*
    Author:SMG
    Time:2016-01-19
*/
"use strict";
angular.module("productManageMentEditNameModule", [])
    .controller("productManageMentEditNameCtrl", ["$scope", "$stateParams", "$validation", "$q", "$modalInstance", "trsHttpService", "initSingleSelecet", "trsconfirm", "selectedItem", "trsSelectItemByTreeService", "trsspliceString", function($scope, $stateParams, $validation, $q, $modalInstance, trsHttpService, initSingleSelecet, trsconfirm, selectedItem, trsSelectItemByTreeService, trsspliceString) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findBanMianById",
                "ChannelId": selectedItem.CHANNELID
            };
            /*if (angular.isDefined(selectedItem)) {
                $scope.selectedItem = angular.copy(selectedItem);
            }*/
        }

        function initData() {
            if (angular.isDefined(selectedItem)) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                    $scope.selectedItem = {
                        ChnlDesc: data.CHNLDESC,
                        SimpleName: data.SIMPLENAME,
                        dieciName: data.DIECINAME,
                        DieCiId: data.DIECIID,
                        ObjectId: data.CHANNELID,
                        SiteId: $stateParams.paper
                    };
                    $scope.roles = data.ROLES;
                    initNews();
                });
            } else {
                initNews();
                dieciDroplist();
            }
        }

        function initNews() {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "findPaperById";
            $scope.params.SiteId = $stateParams.paper;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.paper = data;
            });
        }
        //保存
        $scope.save = function() {
            save().then(function(data) {
                $modalInstance.close("save");
            });

        };

        //保存并新建
        $scope.saveNew = function() {
            save().then(function(data) {
                $modalInstance.close();
            });
        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        function save() {
            var deferred = $q.defer();
            $validation.validate($scope.ZPLayoutForm).success(function() {
                $scope.selectedItem.serviceid = "mlf_paperset";
                $scope.selectedItem.methodname = "saveCaiBianBanMian";
                $scope.selectedItem.RoleIds = trsspliceString.spliceString($scope.roles, "ROLEID", ",");
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.selectedItem, "get").then(function(data) {
                    deferred.resolve();
                });
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请填写必填项", "error", false, function() {});
            });
            return deferred.promise;
        }
        $scope.distribAuthority = function() {
            trsSelectItemByTreeService.getRole("权限设置", $scope.roles, function(data) {
                $scope.roles = data;
            });
        };

        //初始化叠次下拉框
        function dieciDroplist() {
            var params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paper,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var dieciDroplistJson = data;
                var options = [];
                for (var key in dieciDroplistJson) {
                    options.push({
                        name: dieciDroplistJson[key].CHNLDESC,
                        value: dieciDroplistJson[key].CHANNELID
                    });
                }
                $scope.dieciDroplistJson = options;
                $scope.dieciDroplistSelected = angular.copy($scope.dieciDroplistJson[0]);
                $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
            });
        }
        $scope.getDieciData = function() {
            $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
        };
    }])
    .controller("productManageMentNewPageEditingCtrl", ["$scope", "$stateParams", "$validation", "$q", "$modalInstance", "trsHttpService", "initSingleSelecet", "trsconfirm", "initManageConSelectedService", "trsSelectItemByTreeService", "params", "trsspliceString", function($scope, $stateParams, $validation, $q, $modalInstance, trsHttpService, initSingleSelecet, trsconfirm, initManageConSelectedService, trsSelectItemByTreeService, params, trsspliceString) {
        initStatus();
        initData();


        function initData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.paper = data;
                dieciDroplist();
            });
        }

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findPaperById",
                "SiteId": $stateParams.paper
            };
            $scope.selectedItem = {
                ChnlDesc: params.banmian ? params.banmian : "",
                SimpleName: params.jianchen ? params.jianchen : "",
            };
        }
        $scope.distribAuthority = function() {
            trsSelectItemByTreeService.getRole("权限设置", [], function(data) {
                $scope.roles = data;
            });
        };
        $scope.getDieciData = function() {
            $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
        };

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

        //保存并新建
        $scope.saveNew = function() {
            save().then(function(data) {
                $modalInstance.close({
                    'dieci': $scope.dieciDroplistSelected.value,
                    "banmian": $scope.selectedItem.ChnlDesc,
                    "jianchen": $scope.selectedItem.SimpleName
                });
            });
        };

        function save() {
            var deferred = $q.defer();
            $validation.validate($scope.ZPLayoutForm).success(function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "saveCaiBianBanMian";
                $scope.params.ObjectId = 0;
                $scope.params.RoleIds = trsspliceString.spliceString($scope.roles, "ROLEID", ",");
                $scope.params.ChnlDesc = $scope.selectedItem.ChnlDesc;
                $scope.params.SimpleName = $scope.selectedItem.SimpleName;
                $scope.params.SiteId = $stateParams.paper;
                $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
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
                var index;
                for (var key in dieciDroplistJson) {
                    options.push({
                        name: dieciDroplistJson[key].CHNLDESC,
                        value: dieciDroplistJson[key].CHANNELID
                    });
                    if (params.dieci !== "" && dieciDroplistJson[key].CHANNELID == params.dieci) {
                        index = key;
                    }
                }
                $scope.dieciDroplistJson = options;
                $scope.dieciDroplistSelected = index ? angular.copy($scope.dieciDroplistJson[index]) : angular.copy($scope.dieciDroplistJson[0]);
            });
        }
    }]);
