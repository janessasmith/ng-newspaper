/**
 * Author:XCL
 *
 * Time:2016-02-18
 */
"use strict";
angular.module('cueMonitorTypeCustomFirstLevelModule', [])
    .controller('cueMonitorTypeCustomFirstLevelCtrl', ['$scope', '$modalInstance', '$modal', 'trsHttpService', function($scope, $modalInstance, $modal, trsHttpService) {
        initStatus();
        initData();

        function initStatus() {
        	$scope.params = {
                "typeid": "dicttool",
                "modelid": "getRootLevel",
                "serviceid": "web"
            };
            $scope.sourceType = "";
            $scope.selectedItem = {
                "web": true
            };
        }

        function initData() {
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.secondCurItem = data[0];
                $scope.secondItems = data;
                $scope.params.modelid = "getChildren";
                $scope.params.parentId = data[0].id;
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                    $scope.thirdCurItem = data[0];
                    $scope.thirdItems = data;
                });
            });
        }

        //选择稿源
        $scope.chooseSource = function(type) {
            switch (type) {
                case "web":
                    $scope.sourceType = "站点名称";
                    $scope.selectedItem = {};
                    $scope.selectedItem.web = true;
                    break;
                case "weixin":
                    $scope.sourceType = "公众号";
                    $scope.selectedItem = {};
                    $scope.selectedItem.weixin = true;
                    break;
                case "app":
                    $scope.sourceType = "APP";
                    $scope.selectedItem = {};
                    $scope.selectedItem.app = true;
                    break;
                case "weibo":
                    $scope.sourceType = "微博号";
                    $scope.selectedItem = {};
                    $scope.selectedItem.weibo = true;
                    break;
                case "digitalPaper":
                    $scope.sourceType = "报纸名称";
                    $scope.selectedItem = {};
                    $scope.selectedItem.digitalPaper = true;
                    break;
            }
            $scope.params.modelid = "getRootLevel";
            $scope.params.serviceid = type;
            $scope.params.parentId = "";
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.secondCurItem = data[0];
                $scope.secondItems = data;
                $scope.params.modelid = "getChildren";
                $scope.params.parentId = data[0].id;
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                    $scope.thirdCurItem = data[0];
                    $scope.thirdItems = data;
                });
            });
        };

        //选择二级分类
        $scope.chooseSecondClass = function(item) {
            $scope.secondCurItem = item;
            $scope.params.modelid = "getChildren";
            $scope.params.parentId = item.id;
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.thirdCurItem = data[0];
                $scope.thirdItems = data;
            });
        };

        //选择三级分类
        $scope.chooseThirdClass = function(item) {
            $scope.thirdCurItem = item;
        };

        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //下一步
        $scope.next = function() {
            $modalInstance.close();
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/custom/customField/cueMonitorTypeCustomField_tpl.html",
                windowClass: "cue-monitor-type-custom-window",
                controller: "cueMonitorTypeCustomFieldCtrl",
                animation:false
            });
        };

        //上一步
        $scope.pre = function(){
            $modalInstance.close();
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/custom/cueMonitorTypeCustom_tpl.html",
                windowClass: "cue-monitor-type-custom-window",
                controller: "cueMonitorTypeCustomCtrl",
                animation:false
            });
        };

    }]);
