/**
 * Author:CC
 *
 * Time:2016-03-03
 */
'use strict';
angular.module('planCenterCustomOverviewModule', []).
controller('plancueOverviewCtrl', ['$scope', '$q', '$stateParams', "$window", 'trsHttpService', 'initComDataService', '$filter', '$sce', 'calendarService', "storageListenerService", function($scope, $q, $stateParams, $window, trsHttpService, initComDataService, $filter, $sce, calendarService, storageListenerService) {
    initStatus();
    initData();

    function initStatus() {
        $scope.page = {
            CURRPAGE: 0,
            PAGESIZE: 10,
            ITEMCOUNT: "",
            PAGECOUNT: ""
        };
        $scope.params = {
            serviceid: $stateParams.serviceid,
            modelid: $stateParams.modelid,
            page_size: $scope.page.PAGESIZE,
            page_no: $scope.page.CURRPAGE,
            search_word: ""
        };
        $scope.status = {
            timeRange: initComDataService.timeRange(),
            trench: $stateParams.serviceid,
            disasterType: {
                "typhoon": 0,
                "earthquake": 1,
                "weather": 2
            },
            breadcrumb: {
                todayinhistory: "历史今天",
                recentdisaster: "近期灾害",
                recentpolicy: "近期政策",
                customremind: "近期日程"
            },
            historyDate: new Date(),
            jumpToPageNum: 1,
        };
        $scope.data = {
            items: "",
            time: "",
            nav: "",
            selectedArray: [],
            indexname:'',
        };
    }
    /**
     * [pageChanged description]分页请求
     * @return {[type]} [description]
     */
    $scope.pageChanged = function() {
        $scope.params.page_no = $scope.page.CURRPAGE - 1;
        $scope.status.jumpToPageNum = $scope.page.CURRPAGE;
        requestData();
    };
    /**
     * [jumpToPage description]跳转到
     * @return {[type]} [description]
     */
    $scope.jumpToPage = function() {
        if ($scope.status.jumpToPageNum > $scope.page.PAGECOUNT) {
            $scope.status.jumpToPageNum = $scope.page.PAGECOUNT;
        }
        $scope.params.page_no = $scope.status.jumpToPageNum - 1;
        requestData();
    };
    /**
     * [modifCaland description]打开修改日历弹窗
     * @return {[type]} [description]
     */
    $scope.modifCaland = function(item) {
        var innerData = {
            time: $filter('date')(item.BEFOREDATE, "yyyy-MM-dd").toString(),
            data: item,
            isList: false,
        };
        calendarService.calendar(innerData, function() {
            storageListenerService.addListenerToPlan("modifCaland");
            requestData();
        });
    };
    /**
     * [searchWithTime description]根据时间检索
     * @return {[type]} [description]
     */
    $scope.searchWithTime = function() {
        if ($scope.data.time.name == '自定义') {
            $scope.params.search_date = $filter('date')($scope.data.time.startdate, "yyyy-MM-dd").toString() + ";" + $filter('date')($scope.data.time.enddate, "yyyy-MM-dd").toString();
        } else if ($scope.data.time.name == "全部时间") {
            $scope.params.search_date = "1000-01-01" + ";" + $stateParams.time;
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
        if ($stateParams.serviceid == 'todayinhistory') {
            getHistoryTodayQueryTime();
        }
        $scope.params.search_word = $scope.data.searchWord;
        requestData();
    };
    /**
     * [initData description]初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        $scope.status.timetype = {
            'todayinhistory': getHistoryTodayQueryTime(),
            'recentdisaster': getDisasterQueryTime(),
            'customremind': getOtherQueryTime(),
            'recentpolicy': getRecentpolicyTime(),
        };
        $scope.data.nav = $scope.status.breadcrumb[$stateParams.serviceid];
        var time = $scope.status.timetype[$stateParams.serviceid];
        requestData();
    }
    /**
     * [getHistoryTodayQueryTime description]获得历史今天时间检索参数
     * @return {[type]} [description]
     */
    function getHistoryTodayQueryTime() {
        $scope.status.historyDate = $filter('date')($scope.status.historyDate, "yyyy-MM-dd").toString();
        $scope.params.month = $scope.status.historyDate.substr(5, 2);
        $scope.params.day = $scope.status.historyDate.substr(8, 2);
    }
    /**
     * [getDisasterQueryTime description]获得近期灾害时间检索参数
     * @return {[type]} [description]
     */
    function getDisasterQueryTime() {
        $scope.params.disaster_type = $scope.status.disasterType[$stateParams.disasterType];
        $scope.params.search_date = "1000-01-01" + ";" + $stateParams.time;
    }
    /**
     * [getOtherQueryTime description]获得近期政策与自定义时间检索参数
     *
     * @return {[type]} [description]
     */
    function getOtherQueryTime() {
        $scope.params.search_date = "1000-01-01" + ";" + $stateParams.time;
    }

    /**
     * [getRecentpolicyTime description]获得近期政策时间检索参数和来源参数
     *
     * @return {[type]} [description]
     */
    function getRecentpolicyTime() {
        $scope.params.region = $stateParams.region;
        $scope.params.search_date = "1000-01-01" + ";" + $stateParams.time;
    }
    /**
     * [requestData description]数据请求函数
     * @return {[obj]} [description]
     */
    function requestData() {
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "POST").then(function(data) {
            if ($stateParams.serviceid == 'customremind') {
                customAssignment(data);
            } else {
                listAssignment(data);
            }
            $scope.data.indexname=data.CONTENT.INDEXNAME;
        });
    }
    /**
     * [customAssignment description]渲染自定义概览列表
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function customAssignment(data) {
        $scope.data.items = data.CONTENT;
        $scope.page = {
            CURRPAGE: data.NUMBER + 1,
            PAGESIZE: data.SIZE,
            ITEMCOUNT: data.TOTALELEMENTS,
            PAGECOUNT: data.TOTALPAGES
        };
    }
    /**
     * [listAssignment description]渲染近期政策，历史今天列表
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function listAssignment(data) {
        $scope.data.items = data.PAGEDLIST.PAGEITEMS;
        $scope.page = {
            CURRPAGE: data.PAGEDLIST.PAGEINDEX + 1,
            PAGESIZE: data.PAGEDLIST.PAGESIZE,
            ITEMCOUNT: data.PAGEDLIST.TOTALITEMCOUNT,
            PAGECOUNT: data.PAGEDLIST.TOTALPAGECOUNT
        };
    }
}]);
