/**
 * Author:XCL
 * Time:2015-01-07
 */
"use strict";
angular.module('PlanCueMonitorQianjiangMoreModule', [])
    .controller('cueMonitorQianjiangMoreCtrl', ['$scope', "$location", '$q', '$stateParams', '$filter', 'trsHttpService', 'initComDataService', function($scope, $location, $q, $stateParams, $filter, trsHttpService, initComDataService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 0,
                "PAGESIZE": 10
            };
            $scope.params = {
                "serviceid": "96068",
                "modelid": "content",
                "page_no": $scope.page.CURRPAGE,
                "page_size": $scope.page.PAGESIZE,
                "search_date":""
            };
            $scope.status = {
                "timeRange": initComDataService.timeRange()
            };
            $scope.data = {
                items: "",
                time: "",
                //selectedArray: [],
            };
        }

        /**
         * [initData description]初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            requestData();
        }

        /**
         * [requestData description]数据请求函数
         * @return {[obj]} [description]
         */
        function requestData() {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "get").then(function(data) {
                $scope.data.items = data.PAGEITEMS;
                $scope.page = {
                    CURRPAGE: data.PAGEINDEX + 1,
                    PAGESIZE: data.PAGESIZE,
                    ITEMCOUNT: data.TOTALITEMCOUNT,
                    PAGECOUNT: data.PAGETOTAL
                };
                return deferred.resolve(data);
            });
            return deferred.promise;
        }

        /**
         * [pageChanged description]分页请求
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.params.page_size = $scope.page.PAGESIZE;
            $scope.params.page_no = $scope.page.CURRPAGE - 1;
            requestData();
        };
        $scope.jumpToPage = function() {
            if ($scope.status.jumpToPageNum > $scope.page.PAGECOUNT) {
                $scope.status.jumpToPageNum = $scope.page.PAGECOUNT;
            }
            $scope.params.page_no = $scope.status.jumpToPageNum - 1;
            requestData();
        };

        /**
         * [searchWithTime description]根据时间检索
         * @return {[type]} [description]
         */
        $scope.searchWithTime = function() {
            if ($scope.data.time.name == '自定义') {
                $scope.params.search_date = $filter('date')($scope.data.time.startdate, "yyyy-MM-dd").toString() + ";" + $filter('date')($scope.data.time.enddate, "yyyy-MM-dd").toString();
            } else if ($scope.data.time.name == "全部时间") {
                $scope.params.search_date = "";
            } else {
                $scope.params.search_date = $scope.data.time.value;
            }
            requestData();
        };

        /**
         * [queryListBySearchWord description]根据关键词检索
         * @return {[type]} [description]null
         */
        $scope.queryListBySearchWord = function() {
            $scope.params.search_word = $scope.data.searchWord;
            requestData();
        };

    }]);
