/**
 * Author:Ly
 *
 * Time:2016-01-15
 */
"use strict";
angular.module('hotHeadPolymerizationModule', [])
    .controller('hotHeadPolymerizationCtrl', ['$scope', "$modalInstance", "title", "trsHttpService", "trsspliceString", function($scope, $modalInstance, title, trsHttpService, trsspliceString) {
        initStatus();
        initData();

        function initStatus() {
            $scope.title = title;
            $scope.selectedArray = [];
            $scope.params = {
                "typeid": "widget",
                "serviceid": "hotpointcluster",
                "modelid": "userfields",
            };
        }

        function initData() {
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "get").then(function(data) {
                $scope.items = data;
                angular.forEach(data, function(array, key) {
                    if (array.ORDERNUM == 1) {
                        $scope.selectedArray.push(array);
                    }
                });
            });
        }

        $scope.selectItem = function(item) {
            item.ORDERNUM === '0' ? item.ORDERNUM = '1' : item.ORDERNUM = '0';
            if (item.ORDERNUM == '1') {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
            $scope.ID = trsspliceString.spliceString($scope.selectedArray, "ID", ",");
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.save = function() {
            $scope.params.modelid = "saveuserfields";
            $scope.params.fields = $scope.ID;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $modalInstance.close($scope.selectedArray);
            });
        };
    }]);
