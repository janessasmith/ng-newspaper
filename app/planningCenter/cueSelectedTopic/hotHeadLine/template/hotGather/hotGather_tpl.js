'use strict';
/**
 *  Module  热点聚合图module
 *
 * Description  
 */
angular.module('planHotGatherModule', []).controller('planHotGatheCtrl', ['$scope', '$location', '$q', '$stateParams', '$filter', 'trsHttpService', 'initComDataService', function($scope, $location, $q, $stateParams, $filter, trsHttpService, initComDataService) {
    initStatus();
    initData();

    function initStatus() {
        $scope.page = {
            "startpage": 0,
            "PAGESIZE": 20
        };
        $scope.params = {
            typeid: "widget",
            serviceid: "hotpointcluster",
            modelid: "hotpointnewslist",
            id: $stateParams.guids,
            pagesize: $scope.page.PAGESIZE,
            startpage: $scope.page.startpage,
        };
        $scope.status = {
            "timeRange": initComDataService.timeRange(),
            "jumpToPageNum": 1,
            "keyWords": '',
            'channelName':''
        };
        $scope.data = {
            items: "",
            time: "",
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
            $scope.data.items = data.PAGEDLIST.PAGEITEMS;
            $scope.page = {
                startpage: data.PAGEDLIST.PAGEINDEX + 1,
                PAGESIZE: data.PAGEDLIST.PAGESIZE,
                ITEMCOUNT: data.PAGEDLIST.TOTALITEMCOUNT,
                PAGECOUNT: data.PAGEDLIST.PAGETOTAL
            };
            $scope.indexname = data.CONTENT.INDEXNAME.substr(0, data.CONTENT.INDEXNAME.indexOf('$'));
            $scope.status.channelName=data.CONTENT.INDEXNAME.substring(data.CONTENT.INDEXNAME.indexOf('$')+1,data.CONTENT.INDEXNAME.indexOf('>'));
            $scope.status.keyWords = addSpace(data.CONTENT.INDEXNAME.substr(data.CONTENT.INDEXNAME.indexOf('$') + 1));
            return deferred.resolve(data);
        });
        return deferred.promise;
    }

    /**
     * [pageChanged description]分页请求
     * @return {[type]} [description]
     */
    $scope.pageChanged = function() {
        $scope.status.jumpToPageNum = $scope.page.startpage;
        $scope.params.startpage = $scope.page.startpage - 1;
        requestData();
    };
    $scope.jumpToPage = function() {
        if ($scope.status.jumpToPageNum > $scope.page.PAGECOUNT) {
            $scope.status.jumpToPageNum = $scope.page.PAGECOUNT;
        }
        $scope.params.startpage = $scope.status.jumpToPageNum - 1;
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
    /**
     * [addSpace description]给路径的箭头前后加上空格
     * @params {[string]} [description]路径
     * @return {[string]} [description]处理后的路径
     */
    function addSpace(path) {
        return path.replace(/>/g, " > ");
    }
}]);
