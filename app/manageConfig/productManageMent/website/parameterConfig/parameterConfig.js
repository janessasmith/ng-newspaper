/*
    Create by smg  2015-12-23
*/
"use strict";
angular.module("productManageMentWebsiteParameterConfigModule", [
        "mangeProSiteServiceModule",
        'productManageMentWebsiteSiteRouterModule',
        'productManageMentWebsiteSiteRecycleBinModule'
    ])
    .controller("productManageMentWebsiteParameterConfigCtrl", ['$scope', '$modal', '$timeout', "$location", "$state", "$stateParams", "$q", "trsHttpService", "localStorageService", "trsconfirm", "trsspliceString", function($scope, $modal, $timeout, $location, $state, $stateParams, $q, trsHttpService, localStorageService, trsconfirm, trsspliceString) {
        initStatus();
        initData();
        //检索
        $scope.fullTextSearch = function() {
            $scope.status.params.CKEY = $scope.keywords;
            initData();
        };
        /**
         * 初始化服务
         */
        $scope.order = function() {
            $scope.status.params.Order = $scope.status.params.Order === 0 ? 1 : 0;
            initData();
        };

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10
            };
            $scope.copyCurrPage  = 1;
            $scope.status = {
                data: {
                    Configs: ""
                },
                params: {
                    'serviceid': "mlf_websiteconfig",
                    'methodname': "queryConfigs",
                    "PageSize": $scope.page.PAGESIZE,
                    "CurrPage": $scope.page.CURRPAGE,
                    "Order": 0
                }
            };
            $scope.selectedArray = [];
            $scope.batchOperateBtn = {
                "hoverStatus": "",
                "clickStatus": ""
            };
        }
        /**
         * 初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            requestData().then(function(data) {
                $scope.status.data.Configs = data;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                    $scope.page.PAGESIZE.toString() : $scope.page = {
                        "PAGESIZE": 0,
                        "ITEMCOUNT": 0
                    };
            });
        }
        /**
         * 请求数据
         * @return {obj} 返回数据集合
         */
        function requestData() {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, 'post').then(function(data) {
                localStorageService.set("manageconfig.website.Configs", data);
                deferred.resolve(data);
            });
            return deferred.promise;
        }
        /**
         * 新增配置文件
         */
        $scope.addConfig = function() {
            saveoredit({
                title: "新增"
            });
        };

        //修改配置文件
        $scope.modify = function(item) {
            saveoredit({
                title: "修改",
                configInfo: {
                    "CONFIGID": item.CONFIGID,
                    "CKEY": item.CKEY,
                    "CVALUE": item.CVALUE,
                    "CDESC": item.CDESC
                }
            });
        };
        /**
         * 删除配置文件
         * @param  {obj} items 传入一个或多个id进行删除
         * @return {[type]}       [description]
         */

        //批量删除
        $scope.batchDelete = function() {
            trsconfirm.confirmModel("删除", "您是否确认删除", function() {
                delectItems($scope.selectedArray);
            });
        };

        function saveoredit(params) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/parameterConfig/template/addView_tpl.html",
                windowClass: 'parameterConfigs-add-view',
                backdrop: false,
                controller: "productManageMentWebsiteParameterConfigModifyCtrl",
                resolve: {
                    params: function() {
                        return params;
                    }
                }
            });

            /**
             * 回调函数保存数据
             * @newConfig.serviceid 服务名称
             * @newConfig.methodname 方法名称
             * @return {[type]}            [description]
             */
            modalInstance.result.then(function(newConfig) {
                newConfig.serviceid = "mlf_websiteconfig";
                newConfig.methodname = "saveConfig";
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), newConfig, "post").then(function(data) {
                    trsconfirm.alertType("保存成功", "", "success", false, function() {
                        initData();
                    });

                });
            });
        }
        //282
        function delectItems(items) {
            var ids = angular.isArray(items) ? trsspliceString.spliceString(items, 'CONFIGID', ',') : items.CONFIGID;
            //var ids = 282;
            //
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "deleteConfig",
                ConfigIds: ids
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                //requestData();
                trsconfirm.alertType("删除成功", "删除成功", "success", false, function() {
                    initData();
                });
            });
        }


        $scope.jumpToPage = function() {
            if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.status.params.CurrPage = $scope.copyCurrPage;
            initData();
            // $scope.selectedArray = [];
        };

        /**
         * 下一页分页调用
         */
        $scope.pageChanged = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.copyCurrPage  = $scope.page.CURRPAGE;
            initData();
        };

        //全选
        $scope.selectAll = function() {
            $scope.selectedArray = $scope.selectedArray.length == $scope.status.data.Configs.DATA.length ? [] : [].concat($scope.status.data.Configs.DATA);
        };

        //单选
        $scope.selectDoc = function(item) {
            //item.selected ? $scope.selectedArray.push(item) : $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            if ($scope.selectedArray.indexOf(item) < 0) {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
        };

    }]).controller('productManageMentWebsiteParameterConfigModifyCtrl', ['$modalInstance', '$scope', 'params', function($modalInstance, $scope, params) {
        initStatus();

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.addConfig = function() {
            $modalInstance.close($scope.newConfig);
        };

        function initStatus() {
            if (angular.isDefined(params.configInfo)) {
                $scope.newConfig = params.configInfo;
            } else {
                $scope.newConfig = {
                    "CONFIGID": 0,
                    "CKEY": "",
                    "CVALUE": "",
                    "CDESC": ""
                };
            }
            $scope.title = params.title;
        }
    }]).controller('productManageMentWebsiteParameterConfigDeleteCtrl', ['$modalInstance', '$scope', '$modal', '$timeout', "$location", "$state", "$stateParams", "$q", "trsHttpService", "localStorageService", "trsconfirm", "title", function($modalInstance, $scope, $modal, $timeout, $location, $state, $stateParams, $q, trsHttpService, localStorageService, trsconfirm, title) {
        initData();

        function initData() {
            //$scope.delItems = delItems;
            $scope.title = title;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

        $scope.delete = function() {
            $modalInstance.close("success");
        };
    }]);
