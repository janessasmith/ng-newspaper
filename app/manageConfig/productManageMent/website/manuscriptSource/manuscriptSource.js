/**
 * Author:XCL
 * Time:2016-01-08
 **/
"use strict";
angular.module("productManageMentWebsiteManuscriptSourceModule", [])
    .controller("productManageMentWebsiteManuscriptSourceCtrl", ['$scope', '$modal', 'trsHttpService', 'trsconfirm', 'trsspliceString', 'productMangageMentWebsiteService', function($scope, $modal, trsHttpService, trsconfirm, trsspliceString, productMangageMentWebsiteService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10
            };
            $scope.params = {
                "serviceid": "mlf_websiteconfig",
                "methodname": "querySources",
            };
            $scope.selectedArray = [];
            $scope.keywords = "";
            $scope.copyCurrPage  = 1;
        }

        function initData() {
            requestData();
        }

        function requestData(callback) {
            $scope.loadingPromise = trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                }
                $scope.selectedArray = [];
            });
        }

        //下一页
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.copyCurrPage  = $scope.page.CURRPAGE;
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

        //全选
        $scope.selectAll = function() {
            $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);

        };

        //单选
        $scope.selectDoc = function(item) {
            if ($scope.selectedArray.indexOf(item) < 0) {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
        };

        //批量删除
        $scope.batchDelete = function() {
            trsconfirm.confirmModel("删除", "您确认要删除选择的稿源信息？", function() {
                var sourceIdArray = trsspliceString.spliceString($scope.selectedArray,
                    'SOURCEID', ',');
                deleteFun(sourceIdArray);
            });
        };

        //单个删除
        $scope.singleDelete = function(item) {
            trsconfirm.confirmModel("删除", "您确认要删除选择的稿源信息？", function() {
                deleteFun(item.SOURCEID);
            });
        };

        //删除方法
        function deleteFun(sourceids) {
            $scope.params.serviceid = "mlf_websiteconfig";
            $scope.params.methodname = "deleteSource";
            $scope.params.SourceIds = sourceids;
            requestData(function() {
                $scope.params.serviceid = "mlf_websiteconfig";
                $scope.params.methodname = "querySources";
                requestData();
            });
        }

        //添加稿源
        $scope.add = function() {
            $scope.allData = {
                'topTitle': "添加稿源",
                'title': "",
                'url': ""
            };
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/alertViews/editManuSource/editManuSource_tpl.html",
                controller: "editManuSourceCtrl",
                windowClass: "productManageMent-website-manuscript-add",
                resolve: {
                    allData: function() {
                        return $scope.allData;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.params.serviceid = "mlf_websiteconfig";
                $scope.params.methodname = "saveSource";
                $scope.params.SRCName = result.srcName;
                $scope.params.SRCLink = result.srcLink;
                requestData(function() {
                    $scope.params.serviceid = "mlf_websiteconfig";
                    $scope.params.methodname = "querySources";
                    $scope.params.ObjectId = "";
                    $scope.params.SRCName = "";
                    $scope.params.SRCLink = "";
                    requestData();
                });
            });
        };

        //修改稿源
        $scope.modify = function(item) {
            $scope.allData = {
                'topTitle': "修改稿源",
                'title': item.SRCNAME,
                'url': item.SRCLINK
            };
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/alertViews/editManuSource/editManuSource_tpl.html",
                controller: "editManuSourceCtrl",
                windowClass: "productManageMent-website-manuscript-add",
                resolve: {
                    allData: function() {
                        return $scope.allData;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.params.serviceid = "mlf_websiteconfig";
                $scope.params.methodname = "saveSource";
                $scope.params.ObjectId = item.SOURCEID;
                $scope.params.SRCName = result.srcName;
                $scope.params.SRCLink = result.srcLink;
                requestData(function() {
                    $scope.params.serviceid = "mlf_websiteconfig";
                    $scope.params.methodname = "querySources";
                    $scope.params.SRCName = "";
                    $scope.params.SRCLink = "";
                    requestData();
                });
            });
        };

        //全文检索
        $scope.fullTextSearch = function(ev) {
            $scope.params.SRCNAME = $scope.keywords;
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post").then(function(data) {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                });
            }
        };
    }]);
