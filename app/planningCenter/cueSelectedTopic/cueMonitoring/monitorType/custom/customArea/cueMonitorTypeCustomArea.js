/**
 * Author:XCL
 *
 * Time:2016-02-19
 */
"use strict";
angular.module('cueMonitorTypeCustomAreaModule', [])
    .controller('cueMonitorTypeCustomAreaCtrl', ['$scope', '$modalInstance', '$modal', 'trsHttpService', function($scope, $modalInstance, $modal, trsHttpService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "typeid": "dicttool",
                "modelid": "getRootLevel",
                "serviceid": "area"
            };
        }

        function initData() {
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.firstCurItem = data[0];
                $scope.firstItems = data;
                $scope.params.modelid = "getChildren";
                $scope.params.parentId = data[0].id;
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                    $scope.secondCurItem = data[0];
                    $scope.secondItems = data;
                    $scope.params.parentId = data[0].id;
                    trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                        $scope.thirdCurItem = data[0];
                        $scope.thirdItems = data;
                    });
                });
            });
        }

        //选择一级领域
        $scope.chooseFirstField = function(item) {
            $scope.firstCurItem = item;
            $scope.params.parentId = item.id;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.secondCurItem = data[0];
                $scope.secondItems = data;
                $scope.params.parentId = data[0].id;
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                    $scope.thirdCurItem = data[0];
                    $scope.thirdItems = data;
                });
            });

        };

        //选择二级领域
        $scope.chooseSecondField = function(item) {
            $scope.secondCurItem = item;
            $scope.params.parentId = item.id;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.thirdCurItem = data[0];
                $scope.thirdItems = data;
            });

        };

        //选择三级领域
        $scope.chooseThirdField = function(item) {
            $scope.thirdCurItem = item;
        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //上一步
        $scope.pre = function() {
            $modalInstance.close();
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/custom/customField/cueMonitorTypeCustomField_tpl.html",
                windowClass: "cue-monitor-type-custom-window",
                controller: "cueMonitorTypeCustomFieldCtrl",
                animation:false
            });
        };

        //保存
        $scope.save = function() {

        };

    }]);
