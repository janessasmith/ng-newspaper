/*
    Author:XCL
    Time:2016-01-06
*/
"use strict";
angular.module("productManageMentZPLayoutRankModule", [])
    .controller("productManageMentZPLayoutRankCtrl", ["$scope", "$timeout", "$q", "$modalInstance", "$stateParams", "trsHttpService", "trsspliceString", "title", "initSingleSelecet", function($scope, $timeout, $q, $modalInstance, $stateParams, trsHttpService, trsspliceString, title, initSingleSelecet) {
        initStatus();
        initData();

        function initData() {
            dieciDroplist();
            $scope.title = title;
        }

        function initStatus() {
            $scope.dieciParams = {
                serviceid: "mlf_paperset",
                methodname: "queryZhaoPaiBanMians",
                PaperId: $stateParams.paper
            };
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.confirm = function() {
            var objectIDs = trsspliceString.spliceString($scope.rankItems,
                "CHANNELID", ',');
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "reorderDieCiOrBanMians",
                "ObjectIds": objectIDs,
                "flag":3
            };
            $scope.loadingPromise = trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
                $modalInstance.close($scope.DroplistSelected);
            });

        };
        //选中被移动的照排版面
        $scope.selectItem = function(rankItem) {
            $scope.selectedItem = rankItem;
        };

        //上移
        $scope.moveUp = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== 0) {
                swapItems($scope.rankItems, currentIndex, currentIndex - 1);
            }
        };

        //下移
        $scope.moveDown = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== $scope.rankItems.length - 1) {
                swapItems($scope.rankItems, currentIndex, currentIndex + 1);
            }
        };

        //置顶
        $scope.moveToTop = function() {
            $scope.rankItems.splice($scope.rankItems.indexOf($scope.selectedItem), 1);
            $scope.rankItems.unshift($scope.selectedItem);
        };

        //至尾
        $scope.moveToBottom = function() {
            $scope.rankItems.splice($scope.rankItems.indexOf($scope.selectedItem), 1);
            $scope.rankItems.push($scope.selectedItem);
        };

        function swapItems(list, index1, index2) {
            list[index1] = list.splice(index2, 1, list[index1])[0];
        }


        //初始化叠次下拉框
        function dieciDroplist() {
            initSingleSelecet.getDieciData($stateParams.paper, true).then(function(data) {
                $scope.DroplistJson = data;
                $scope.DroplistSelected = angular.copy($scope.DroplistJson[0]);
                $scope.params.DieCiId = $scope.DroplistSelected.value;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                    $scope.rankItems = data.DATA;
                    $scope.selectedItem = data.DATA[0];
                });
            });
        }
        $scope.getDieciData = function() {
            var dieciParams = {
                serviceid: "mlf_paperset",
                methodname: "queryZhaoPaiBanMians",
                PaperId: $stateParams.paper,
                DieCiId: $scope.DroplistSelected.value
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), dieciParams, "get").then(function(data) {
                $scope.rankItems = data.DATA;
                $scope.selectedItem = data.DATA[0];
            });
        };
    }]);
