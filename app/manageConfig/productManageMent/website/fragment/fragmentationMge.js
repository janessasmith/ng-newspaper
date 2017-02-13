/*
    Create by smg  2015-12-23
*/
"use strict";
angular.module("productManageMentWebsiteFragmentationModule", ["fragmentationMgeServiceModule"])
    .controller("productManageMentWebsiteFragmentationCtrl", ["$scope", "$stateParams", "trsHttpService", "fragmentationMgeService", "trsconfirm", "trsspliceString", "productMangageMentWebsiteService", function($scope, $stateParams, trsHttpService, fragmentationMgeService, trsconfirm, trsspliceString, productMangageMentWebsiteService) {
        $scope.$watch("isWidgetRecycleBin", function(newValue, oldValue) {
            $scope.params = {
                "serviceid": "mlf_widget",
            };
            if (newValue === true) {
                $scope.params.methodname = "queryRecycleWidgets";
            } else {
                $scope.params.methodname = "queryWidgetsBySite";
            }
            initStatus();
            initData();
        });
        /**
         * [getWidgetRights description]获取碎片化权限
         * @return {[type]} [description] null
         */
        function getWidgetRights() {
            productMangageMentWebsiteService.getRight($stateParams.site, "", "websetsite.widget").then(function(data) {
                $scope.status.right = data;
            });
        }
        $scope.createOrEditFragment = function(widgetId) {
            if (angular.isUndefined($scope.status.right.widget.bianji))
                return;
            fragmentationMgeService.createOrEditFragment(angular.isDefined(widgetId) ? widgetId : "", angular.isDefined(widgetId) ? "修改" : "新增", function(data) {
                var saveParams = {
                    serviceid: "mlf_widget",
                    methodname: "save",
                    SiteId: $stateParams.site,
                    ObjectId: angular.isDefined(widgetId) ? widgetId : 0,
                    TempDesc: data.widgetName,
                    TempText: data.widgetContent
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), saveParams, "post")
                    .then(function(_data) {
                        trsconfirm.alertType("保存成功", "WidgetId为" + _data, "success", false, function() {
                            requestData();
                        });
                    });
            });
        };
        $scope.clipboardUrl = function(tempid) {
            var templateUrlParam = {
                serviceid: "mlf_widget",
                methodname: "queryWidgetIncludeCode",
                WidgetId: tempid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), templateUrlParam, "post")
                .then(function(data) {
                    var copyContent = "<!--#include virtual=\"" + data.INCLUDE + "\" -->" +
                        "<!--" + data.NOTE + "-->";
                    fragmentationMgeService.copyUrl(copyContent);
                });
        };
        $scope.delete = function(tempid) {
            deleteWidgets(tempid);
        };
        $scope.restore = function(widgetId) {
            restore(widgetId);
        };
        $scope.batRestore = function() {
            restore(trsspliceString.spliceString($scope.selectedArray, "TEMPID", ","));
        };
        $scope.batchDelete = function() {
            deleteWidgets(trsspliceString.spliceString($scope.selectedArray, "TEMPID", ","));
        };
        $scope.search = function() {
            initStatus();
            if ($scope.isWidgetRecycleBin === true) {
                $scope.params.WidgetDESC = $scope.widgetSearch;
            } else {
                $scope.params.TEMPDESC = $scope.widgetSearch;
            }
            initData();
        };
        //删除函数
        function deleteWidgets(tempids) {
            var deletetParam = {
                serviceid: "mlf_widget",
                WidgetIds: tempids,
                SiteId: $scope.params.SiteId
            };
            deletetParam.methodname = $scope.isWidgetRecycleBin === true ? "relDelWidgets" : "deleteWidgets";
            trsconfirm.confirmModel("删除", "您是否确认删除？", function(data) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deletetParam, "post").then(function(data) {
                    trsconfirm.alertType("删除成功", "删除成功", "success", false, function() {
                        requestData();
                    });
                });
            });
        }
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20
            };
            $scope.status = {};
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.params.SiteId = $stateParams.site;
            $scope.selectedArray = [];
            $scope.copyCurrPage = 1;
            getWidgetRights();
        }
        //初始化数据
        function initData() {
            requestData();
        }

        //数据请求函数
        function requestData(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
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
            });
        }
        //下一页
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /*跳转指定页面*/
        $scope.jumpToPage = function() {
            if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.copyCurrPage;
            requestData();
            $scope.selectedArray = [];
        };
        /**
         * [selectPageNum description]单页选择条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.copyCurrPage = 1;
            requestData();
        };
        //全选
        $scope.selectAll = function() {
            $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : []
                .concat($scope.items);
        };
        //单选
        $scope.selectDoc = function(item) {
            if ($scope.selectedArray.indexOf(item) < 0) {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
        };
        //还原
        function restore(widgetIds) {
            var restoreParams = {
                serviceid: "mlf_widget",
                methodname: "restoreWidgets",
                WidgetIds: widgetIds,
                SiteId: $scope.params.SiteId,
            };
            trsconfirm.confirmModel("还原碎片", "您确定要还原么？", function() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), restoreParams, "post").then(function(data) {
                    trsconfirm.alertType("还原成功", "还原成功", "success", false, function() {
                        requestData();
                    });
                });
            });
        }
    }]);
