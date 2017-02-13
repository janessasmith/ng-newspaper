/*
 Create by smg  2015-12-23
 */
"use strict";
angular.module("productManageMentWebsiteDistributeAddModule", [
        'mangeProDistributeConfigCtrlModule'
    ])
    .controller("productManageMentWebsiteDistributeConfigCtrl", ["$scope", "$q", "$stateParams", '$state', 'trsHttpService', 'trsconfirm', 'productMangageMentWebsiteService', '$modal', 'trsResponseHandle', 'trsspliceString', function($scope, $q, $stateParams, $state, trsHttpService, trsconfirm, productMangageMentWebsiteService, $modal, trsResponseHandle, trsspliceString) {
        initstatus();
        initdata();
        //获取栏目操作权限开始
        function getChnlRights() {
            productMangageMentWebsiteService.getRight($stateParams.site, "", "websetsite.publishdistribution").then(function(data) {
                $scope.status.right = data;
            });
        }
        //获取栏目操作权限结束
        function initstatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20
            };
            $scope.copyCurrPage = 1;
            $scope.params = {
                serviceid: "mlf_websiteconfig",
                methodname: "queryPublishDistributions",
                TARGETTYPE: $scope.searchChlName,
                SiteId: $stateParams.site,
                PageSize: $scope.page.PAGESIZE,
                CurrPage: $scope.page.CURRPAGE,
            };
            $scope.status = {
                right: {}
            };
            getChnlRights();
        }
        /*跳转指定页面*/
        $scope.jumpToPage = function() {
            if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.copyCurrPage;
            requestData();
            $scope.selectedArray = [];
        };
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /**
         * [selectPageNum description]单页选择分页数
         * @type {[type]}
         */
        $scope.selectPageNum = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.copyCurrPage = 1;
            requestData();

        };

        function requestData(callback) {
            var defer = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'get').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                    angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                        $scope.page.PAGESIZE.toString() : $scope.page = {
                            "PAGESIZE": 0,
                            "ITEMCOUNT": 0,
                        };
                }
                $scope.selectedArray = [];
                defer.resolve(data);
            });
            return defer.promise;
        }
        $scope.fullTextSearch = function() {
            $scope.params.methodname = "queryPublishDistributions"
            $scope.params.TARGETTYPE = $scope.searchChlName;
            requestData().then(function(data) {
                $scope.items = data.DATA;
            });
        }

        function initdata() {
            requestData();
        }
        $scope.selectAll = function() {
            $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);

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
        $scope.addItem = function() {
            productMangageMentWebsiteService.addClassifyManagement('', function(result) {
                var params = {
                    "serviceid": "mlf_websiteconfig",
                    "methodname": "savePublishDistribution",
                    "FOLDERID": $stateParams.site,
                    "TARGETTYPE": result.TARGETTYPE,
                    "DATAPATH": result.DATAPATH,
                    "LOGINUSER": result.LOGINUSER,
                    "LOGINPASSWORD": result.LOGINPASSWORD,
                    "TARGETPORT": result.TARGETPORT,
                    "TARGETSERVER": result.TARGETSERVER,
                    "ENABLED": result.ENABLED,
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, 'get').then(function(data) {
                    requestData();
                });
            });
        };
        //删除弹窗
        $scope.delete = function(item) {
            delectDoc(item.PUBLISHDISTRIBUTIONID)
        };
        //批量删除
        $scope.multDelete = function() {
                if ($scope.selectedArray.length !== 0) {
                    var Ids = trsspliceString.spliceString($scope.selectedArray,
                        'PUBLISHDISTRIBUTIONID', ',');
                    delectDoc(Ids);
                } else {
                    trsconfirm.confirmModel("删除", "您确认要删除选择的分发配置信息？", function() {});
                }
            }
            //删除原因
        function delectDoc(item) {
            trsconfirm.confirmModel("删除", "您确认要删除选择的分发配置信息？", function() {
                var params = {
                    "serviceid": "mlf_websiteconfig",
                    "methodname": "deletePublishDistributions",
                    "PublishDistributionIds": item,
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post")
                    .then(function(data) {
                        trsResponseHandle.responseHandle(data, false)
                            .then(function() {
                                $scope.selectedArray = [];
                                requestData();
                            }, function() {});
                    }, function(data) {

                    });
            });
        }
        //修改弹窗
        $scope.modified = function(item) {
            productMangageMentWebsiteService.addClassifyManagement(item, function(result) {
                var params = {
                    "serviceid": "mlf_websiteconfig",
                    "methodname": "savePublishDistribution",
                    "PublishDistributionId": item.PUBLISHDISTRIBUTIONID,
                    "FOLDERID": $stateParams.site,
                    "TARGETTYPE": result.TARGETTYPE,
                    "DATAPATH": result.DATAPATH,
                    "LOGINUSER": result.LOGINUSER,
                    "LOGINPASSWORD": result.LOGINPASSWORD,
                    "TARGETPORT": result.TARGETPORT,
                    "TARGETSERVER": result.TARGETSERVER,
                    "ENABLED": result.ENABLED
                };

                trsHttpService.httpServer("/wcm/mlfcenter.do", params, 'get').then(function(data) {
                    requestData();

                });
            });
        };
    }]);
