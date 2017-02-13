/**
 * Author:XCL
 *
 * Time:2016-02-17
 */
"use strict";
angular.module('planCueMonitorTypeCustomModule', [
    'cueMonitorTypeCustomFirstLevelModule',
    'cueMonitorTypeCustomFieldModule',
    'cueMonitorTypeCustomAreaModule'
    ])
    .controller('cueMonitorTypeCustomCtrl', ['$scope', '$modalInstance', '$modal', function($scope, $modalInstance, $modal) {
        initStatus();

        function initStatus() {
            $scope.titFullKeyword = "";
            $scope.titFulls = [];
            $scope.titAnyKeyword = "";
            $scope.titAnys = [];
            $scope.contentFullKeyword = "";
            $scope.contentFulls = [];
            $scope.contentAnyKeyword = "";
            $scope.contentAnys = [];
        }

        //添加标题完整关键词
        $scope.titFullAdd = function(ev) {
            if ((angular.isDefined(ev) && ev.keycode == 13) || angular.isUndefined(ev)) {
                if ($scope.titFullKeyword !== "") {
                    $scope.titFulls.push($scope.titFullKeyword);
                    $scope.titFullKeyword = "";
                } else {
                    return;
                }
            }
        };

        //删除标题完整关键词
        $scope.titFullDelete = function(curItem) {
            $scope.titFulls.splice(curItem, 1);
        };

        //添加标题任意关键词
        $scope.titAnyAdd = function(ev) {
            if ((angular.isDefined(ev) && ev.keycode == 13) || angular.isUndefined(ev)) {
                if ($scope.titAnyKeyword !== "") {
                    $scope.titAnys.push($scope.titAnyKeyword);
                    $scope.titAnyKeyword = "";
                } else {
                    return;
                }
            }
        };

        //删除标题任意关键词
        $scope.titAnyDelete = function(curItem) {
            $scope.titAnys.splice(curItem, 1);
        };

        //添加正文完整关键词
        $scope.contentFullAdd = function(ev) {
            if ((angular.isDefined(ev) && ev.keycode == 13) || angular.isUndefined(ev)) {
                if ($scope.contentFullKeyword !== "") {
                    $scope.contentFulls.push($scope.contentFullKeyword);
                    $scope.contentFullKeyword = "";
                } else {
                    return;
                }
            }
        };

        //删除正文完整关键词
        $scope.contentFullDelete = function(curItem) {
            $scope.contentFulls.splice(curItem, 1);
        };

        //添加正文任意关键词
        $scope.contentAnyAdd = function(ev) {
            if ((angular.isDefined(ev) && ev.keycode == 13) || angular.isUndefined(ev)) {
                if ($scope.contentAnyKeyword !== "") {
                    $scope.contentAnys.push($scope.contentAnyKeyword);
                    $scope.contentAnyKeyword = "";
                } else {
                    return;
                }
            }
        };

        //删除正文完整关键词
        $scope.contentAnyDelete = function(curItem) {
            $scope.contentAnys.splice(curItem, 1);
        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //下一步
        $scope.next = function() {
            $modalInstance.close();
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/custom/customFirstLevel/cueMonitorTypeCustomFirstLevel_tpl.html",
                windowClass: "cue-monitor-type-custom-window",
                controller: "cueMonitorTypeCustomFirstLevelCtrl",
                animation:false
            });
        };
    }]);
