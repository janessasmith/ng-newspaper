/**
 * Author:XCL
 *
 * Time:2016-01-15
 */
"use strict";
angular.module('cueMonitorDiscloseConfigModule', [])
    .controller('cueMonitorDiscloseConfigCtrl', ['$scope', "$modalInstance", "title", "trsHttpService", "trsspliceString", function($scope, $modalInstance, title, trsHttpService, trsspliceString) {
        initStatus();
        initData();

        function initStatus() {
            $scope.title = title;
            $scope.selectedArray = [];
            $scope.params = {
                "serviceid": "weiboreport",
                "modelid": "config",
            };
            $scope.status = {
                "flag": false
            };
            $scope.data = {
                "initSelectedItemArray": []
            };
        }

        function initData() {
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "get").then(function(data) {
                $scope.items = data;
                angular.forEach(data, function(array, key) {
                    if (array.SELECTED == 1) {
                        $scope.selectedArray.push(array);
                    }
                });
                $scope.data.initSelectedItemArray = trsspliceString.spliceString($scope.selectedArray, "ACCOUNT", ",");
            });
        }

        $scope.selectItem = function(item) {
            $scope.status.flag = true;
            item.SELECTED === '0' ? item.SELECTED = '1' : item.SELECTED = '0';
            if (item.SELECTED == '1') {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
            $scope.accountsStr = trsspliceString.spliceString($scope.selectedArray, "ACCOUNT", ",");
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.save = function() {
            if ($scope.status.flag === false) {
                $scope.params.accounts = $scope.data.initSelectedItemArray;
            } else {
                $scope.params.accounts = $scope.accountsStr;
            }
            $scope.params.modelid = "saveconfig";
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $modalInstance.close(data);
            });
            $scope.status.flag = false;
        };
    }]);
