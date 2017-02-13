/*
 Create by MRQ  2015-12-23
 */
"use strict";
angular.module("sysManageMentSensitiveWordModule", [
        "sysMgrSensitiveWordCtrlModule"
    ])
    .controller("sysManageMentSensitiveWordCtrl", ["$scope", "$stateParams", '$modal', "trsHttpService", 'trsconfirm', 'trsspliceString', function($scope, $stateParams, $modal, trsHttpService, trsconfirm, trsspliceString) {
        initStatus();
        initData();

        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20
            };
            $scope.copyCurrPage = 1;
            $scope.params = {
                "serviceid": "mlf_websiteconfig",
                "methodname": "querySensitiveWords",
                "CurrPage": $scope.page.CURRPAGE,
                "PageSize": $scope.page.PAGESIZE,
            };
            $scope.selectedArray = [];
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
        };
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
        //添加弹窗
        $scope.addViews = function() {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/sysManageMent/sensitiveWord/template/sensitive_add_tpl.html",
                windowClass: 'productManageMent-sensitive-add',
                backdrop: false,
                controller: "sensitiveAddCtrl"
            });
            return modalInstance.result.then(function(result) {
                addSensitive(result);
            });
        };
        //添加敏感词方法
        function addSensitive(result) {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: 'saveNewSensitiveWords',
                ObjectId: '0',
                SensitiveWords: result.sensitiveWord,
                SensitiveLevel: result.sensitiveLevel.value,
                SubstituteWords: result.sensitiveLevel.value == 1 ? result.substituteWord : ""
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("添加敏感词成功", "", "success", false, function() {
                    requestData();
                })
            });
        }
        //删除敏感词
        $scope.deleteViews = function(item) {
            trsconfirm.confirmModel('删除', "您是否确认删除", function() {
                delectItems(item);
            });

        };
        //删除敏感词方法
        function delectItems(items) {
            var ids = angular.isArray(items) ? trsspliceString.spliceString(items, 'SENSITIVEWORDSID', ',') : items.SENSITIVEWORDSID;
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "deleteSensitiveWords",
                SensitiveWordsIds: ids
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("删除成功", "", "success", false, function() {
                    requestData();
                })
            });
        }
        //批量添加弹窗
        $scope.batchAddViews = function() {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/sysManageMent/sensitiveWord/template/sensitive_batch_add_tpl.html",
                windowClass: 'productManageMent-sensitive-batch-add',
                backdrop: false,
                controller: "sensitiveBatchAddCtrl"
            });
            return modalInstance.result.then(function(result) {
                batchAdd(result);
            });
        };
        //批量添加方法
        function batchAdd(result) {
            var sensitiveArray = result.sensitiveArray.split(/\n/);
            var singleItem;
            var params;
            var levelFn = function(array) {
                return array[2] ? array[2] : result.sensitiveLevel.value
            };
            angular.forEach(sensitiveArray, function(value, key) {
                singleItem = value.split(",");
                params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: 'saveNewSensitiveWords',
                    ObjectId: '0',
                    SensitiveWords: singleItem[0],
                    SensitiveLevel: levelFn(singleItem),
                    SubstituteWords: levelFn(singleItem) == 1 ? singleItem[1] : ""
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("添加敏感词成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        }
        //导入弹窗
        $scope.importViews = function() {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/sysManageMent/sensitiveWord/template/sensitive_import_tpl.html",
                windowClass: 'productManageMent-sensitive-import',
                backdrop: false,
                controller: "sensitiveImportCtrl"
            });
            return modalInstance.result.then(function(result) {
                importFn(result);
            });
        };
        //导入方法
        function importFn(result) {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: 'importSensitiveWords',
                ImportFile: result.name
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("导入敏感词成功", "", "success", false, function() {
                    requestData();
                });
            });
        }
        //修改弹窗
        $scope.modifyViews = function(item) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/sysManageMent/sensitiveWord/template/sensitive_modify_tpl.html",
                windowClass: 'productManageMent-sensitive-modify',
                backdrop: false,
                controller: "sensitiveModifyCtrl",
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
            return modalInstance.result.then(function(result) {
                modifyItem(result, item);
            });
        };
        //修改方法
        function modifyItem(result, item) {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: 'saveNewSensitiveWords',
                ObjectId: item.SENSITIVEWORDSID,
                SensitiveWords: result.sensitiveWord,
                SensitiveLevel: result.sensitiveLevel.value,
                SubstituteWords: result.sensitiveLevel.value == 1 ? result.substituteWord : ""
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("修改敏感词成功", "", "success", false, function() {
                    requestData();
                });
            });
        }

        //搜索
        $scope.search = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.page.CURRPAGE = 1;
                $scope.params.SENSITIVEWORDS = $scope.keywords;
                requestData();
            }
        };
    }]);
