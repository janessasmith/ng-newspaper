/*
    Author:XCL
    Time:2016-01-07
*/
"use strict";
angular.module("productManageMentPressRankModule", [])
    .controller("productManageMentPressRankCtrl", ["$scope", "$modalInstance", "$stateParams", "trsHttpService", "rankItems", "trsspliceString", "title", function($scope, $modalInstance, $stateParams, trsHttpService, rankItems, trsspliceString, title) {

        initData();

        function initData() {
            $scope.title = title;
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryPagers"
            };
            requestData();
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.confirm = function() {
            var objectIDs = trsspliceString.spliceString($scope.rankItems,
                "SITEID", ',');
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "reorderPapers",
                "ObjectIds": objectIDs
            };
            $scope.loadingPromise = trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
                $modalInstance.close();
            });

        };

        function requestData(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.rankItems = data.DATA;

                }

            });
        }
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
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== 0) {
                $scope.rankItems.splice(0, 0, $scope.rankItems.splice(currentIndex, 1)[0]);
            }
        };

        //至尾
        $scope.moveToBottom = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== $scope.rankItems.length - 1) {
                $scope.rankItems[$scope.rankItems.length - 1] = $scope.rankItems.splice(currentIndex, 1)[0];
            }
        };

        function swapItems(list, index1, index2) {
            list[index1] = list.splice(index2, 1, list[index1])[0];
        }

    }]);
