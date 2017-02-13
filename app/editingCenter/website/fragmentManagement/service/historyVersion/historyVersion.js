/**
 * Created by bzm on 2016/01/08.
 */
'use strict';
angular.module("historyVersionModule", [])
    .controller("historyVersionCtrl", ["$scope", "$modalInstance", "widgetParams", "trsHttpService", "trsconfirm", function($scope, $modalInstance, widgetParams, trsHttpService, trsconfirm) {
        initStatus();
        initData();
        $scope.cancel = function() {
            $modalInstance.close();
        };

        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        //恢复版本
        $scope.recover = function(item) {
            var recoverParams = {
                "serviceid": "mlf_widget",
                "methodname": "recoverVersion",
                "VersionId": item.WIDGETVERSIONID,
                "WidgetId": widgetParams.widgetid
            };
            trsconfirm.alertType("确认恢复版本么？", "", "info", true, function() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), recoverParams, "get")
                    .then(function(data) {
                        requestData();
                    });
            });
        };

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10,
                "ITEMCOUNT": 0
            };
            $scope.params = {
                "serviceid": "mlf_widget",
                "methodname": "queryWidgetVersions",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "WidgetId": widgetParams.widgetid
            };
        }
        $scope.preview = function(item) {
            var queryWidgetParams = {
                "serviceid": "mlf_widget",
                "methodname": "findWidgetVersionById",
                "WidgetVersionId": item.WIDGETVERSIONID

            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), queryWidgetParams, "get").then(
                function(data) {
                    var previewParams = {
                        "serviceid": "mlf_widget",
                        "methodname": "templatePreview",
                        "ObjectId": widgetParams.objectid,
                        "TemplateId": widgetParams.tempid,
                        "ObjectType": widgetParams.objecttype,
                        "WidgetId": widgetParams.widgetid,
                        "datajson": JSON.stringify(data.DATAJSON)
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), previewParams, "get").then(
                        function(data) {
                            window.open(data + "&siteid=" + widgetParams.siteid + "&tempid=" + widgetParams.tempid + "&objectid=" + widgetParams.objectid + "&objecttype=" + widgetParams.objecttype + "#widget" + widgetParams.widgetid);
                        });
                });
        };

        function initData() {
            requestData();
        }

        function requestData(callback) {
            trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                    angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                        $scope.page.PAGESIZE.toString() : $scope.page = {
                            "PAGESIZE": 0,
                            "ITEMCOUNT": 0,
                            "PAGECOUNT": 0
                        };
                }
                $scope.selectedArray = [];
            }, function(data) {});
        }
    }]);
