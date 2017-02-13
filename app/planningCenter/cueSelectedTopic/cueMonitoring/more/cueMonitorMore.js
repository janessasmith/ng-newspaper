/**
 * Author:XCL
 * Time:2015-01-07
 */
"use strict";
angular.module('PlanCueMonitorMoreModule', [])
    .controller('cueMonitorMoreCtrl', ['$scope', "$location", '$q', '$stateParams', '$filter', 'trsHttpService', 'initComDataService', function($scope, $location, $q, $stateParams, $filter, trsHttpService, initComDataService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 0,
                "PAGESIZE": 10
            };
            $scope.params = {
                "serviceid": "multichannal",
                "modelid": "overview",
                "id": $stateParams.id,
                "search_date": ""
            };
            $scope.status = {
                "timeRange": initComDataService.timeRange(),
                jumpToPageNum: 1,
            };
            $scope.data = {
                items: "",
                time: "",
                indexname: "",
                curSite: ""
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
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.data.items = data.CONTENT.RESULT.PAGEITEMS;
                $scope.data.indexname = data.CONTENT.INDEXNAME;
                $scope.data.curSite = data.CONTENT.MONITORNAME;
                $scope.page = {
                    CURRPAGE: data.CONTENT.RESULT.PAGEINDEX + 1,
                    PAGESIZE: data.CONTENT.RESULT.PAGESIZE,
                    ITEMCOUNT: data.CONTENT.RESULT.TOTALITEMCOUNT,
                    PAGECOUNT: data.CONTENT.RESULT.PAGETOTAL
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
            $scope.status.jumpToPageNum = $scope.page.CURRPAGE;
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
