/*
    Create by ljs  2016-01-06
*/
"use strict";
angular.module("productManageMentOrderRankModule", [])
    .controller("productManageMentOrderRankCtrl", ["$scope", "trsHttpService", "$stateParams", "rankItems", "trsspliceString", "$modalInstance", "callback", function($scope, trsHttpService, $stateParams, rankItems, trsspliceString, $modalInstance, callback) {
        initStatus();
        initData();

        function initStatus(){
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paper,
            };
        }
        function initData() {       
            requestData();
        }

        function requestData(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.rankItems = data;
                    $scope.selectedItem = data[0];
                }
            });
        }
        //选中被移动的叠次
        $scope.selectItem = function(rankItem) {
            $scope.selectedItem = rankItem;
            //$scope.currentIndex = index;
        };
        //上移
        $scope.moveUp = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== 0) {
                rankingItem($scope.rankItems, currentIndex, currentIndex - 1);

            }
        };

        //下移
        $scope.moveNext = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== $scope.rankItems.length - 1) {
                rankingItem($scope.rankItems, currentIndex, currentIndex + 1);
            }
        };

        //移置顶部
        $scope.moveToTop = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== 0) {
                $scope.rankItems.splice(0, 0, $scope.rankItems.splice(currentIndex, 1)[0]);
            }

        };

        //移置底部
        $scope.moveToBottom = function() {
            var currentIndex = $scope.rankItems.indexOf($scope.selectedItem);
            if (currentIndex !== $scope.rankItems.length - 1) {
                $scope.rankItems[$scope.rankItems.length - 1] = $scope.rankItems.splice(currentIndex, 1)[0];
            }
        };

        function rankingItem(list, index1, index2) {
            list[index1] = list.splice(index2, 1, list[index1])[0];
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            var objectIDs = trsspliceString.spliceString($scope.rankItems,
                "CHANNELID", ',');
            callback(objectIDs);
            $modalInstance.close();
        };
    }]);
