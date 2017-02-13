/**
 * Author:XCL
 *
 * Time:2016-02-19
 */
"use strict";
angular.module('cueMonitorTypeCustomFieldModule', [])
    .controller('cueMonitorTypeCustomFieldCtrl', ['$scope', '$modalInstance', '$modal', 'trsHttpService', function($scope, $modalInstance, $modal, trsHttpService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "typeid": "dicttool",
                "modelid": "getRootLevel",
                "serviceid": "field"
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
                });
            });
        }

        //选择内容领域
        $scope.chooseFirstField = function(item) {
            $scope.firstCurItem = item;
            $scope.params.parentId = item.id;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.secondCurItem = data[0];
                $scope.secondItems = data;
            });

        };

        //选择二级领域
        $scope.chooseSecondField = function(item) {
            $scope.secondCurItem = item;
        };

        //下一步
        $scope.next = function() {
            $modalInstance.close();
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/custom/customArea/cueMonitorTypeCustomArea_tpl.html",
                windowClass: "cue-monitor-type-custom-window",
                controller: "cueMonitorTypeCustomAreaCtrl",
                animation:false
            });
        };

        //上一步
        $scope.pre = function(){
            $modalInstance.close();
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/custom/customFirstLevel/cueMonitorTypeCustomFirstLevel_tpl.html",
                windowClass: "cue-monitor-type-custom-window",
                controller: "cueMonitorTypeCustomFirstLevelCtrl",
                animation:false
            });
        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
