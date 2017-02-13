"use strict";
/**
 * customPreview Module
 *
 * Description 自定义监控详情页
 * Author:SMG 2016-5-11
 */
angular.module('customPreviewModule', [])
    .controller('customPreviewController', ['$scope', '$stateParams', '$filter', 'initComDataService', 'initSingleSelecet', 'trsHttpService', 'planCenCustomMonitorService', 'trsconfirm',
        function($scope, $stateParams, $filter, initComDataService, initSingleSelecet, trsHttpService, planCenCustomMonitorService, trsconfirm) {
            initStatus();
            initData();
            /**
             * [initStatus description]初始化状态
             */
            function initStatus() {
                var currDate = new Date();
                $scope.status = {
                    timeRange: initComDataService.timeRange(),
                    endTime: $filter('date')(currDate, "yyyy-MM-dd").toString(),
                    startTime: $filter('date')(currDate.setDate(currDate.getDate() - 6), "yyyy-MM-dd").toString(),
                    isWithoutCompareTime: true
                };
                $scope.page = {
                    pagesize: 20
                };
                $scope.data = {
                    hottestArticle: {}, //最热文章
                    latestArticle: {} //最新文章
                };
            }
            /**
             * [initData description]初始化数据
             */
            function initData() {
                getMonitorTitle();
                getMediaTrend();
                initDropList();
                getLatestArticles();
                mediaHotLine();
            }
            /**
             * [initDropList description]初始化下拉菜单
             */
            function initDropList() {
                $scope.data.docTypeArray = initSingleSelecet.websiteDocType();
                $scope.data.selectedDocType = angular.copy($scope.data.docTypeArray[0]);
            }
            /**
             * [getMonitorTitle description]获取监控标题
             */
            function getMonitorTitle() {
                var params = {
                    typeid: "widget",
                    serviceid: "custommonitor",
                    modelid: "getmonitortitlebyid",
                    id: $stateParams.id
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    $scope.data.monitorTitle = data.TITLE;
                });
            }
            /**
             * [getLatestArticles description]获取最新文章
             */
            function getLatestArticles() {
                var params = {
                    typeid: "widget",
                    serviceid: "monitorsearch",
                    modelid: "getnewlist",
                    timetype: angular.isUndefined($scope.data.latestArticle.timeType) ? 1 : $scope.data.latestArticle.timeType.value,
                    pagesize: $scope.page.pagesize,
                    startpage: angular.isDefined($scope.data.latestArticle.startpage) && $scope.data.latestArticle.startpage > 0 ? ($scope.data.latestArticle.startpage - 1) : 0,
                    ID: $stateParams.id
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(
                    function(data) {
                        $scope.status.isInLatestArticle = true; // 是否正在查看最近文章
                        $scope.data.latestArticle.items = data.ITEMS;
                        if (angular.isUndefined($scope.data.latestArticle.startpage)) $scope.data.latestArticle.startpage = 1;
                        $scope.data.latestArticle.ITEMCOUNT = data.TOTALNUMS;
                        $scope.data.latestArticle.PAGESIZE = $scope.page.pagesize;
                        $scope.data.latestArticle.PAGECOUNT = Math.ceil(data.TOTALNUMS / $scope.page.pagesize);

                    });
            }
            /**
             * [getHottestArticles description]获取最热文章
             */
            function getHottestArticles() {
                var params = {
                    typeid: "widget",
                    serviceid: "monitorsearch",
                    modelid: "gethotlist",
                    timetype: angular.isUndefined($scope.data.hottestArticle.timeType) ? 1 : $scope.data.hottestArticle.timeType.value,
                    pagesize: $scope.page.pagesize,
                    startpage: angular.isDefined($scope.data.hottestArticle.startpage) && $scope.data.hottestArticle.startpage > 0 ? ($scope.data.hottestArticle.startpage - 1) : 0,
                    ID: $stateParams.id
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(
                    function(data) {
                        $scope.status.isInLatestArticle = false;
                        $scope.data.hottestArticle.items = data.CONTENT;
                        if (angular.isUndefined($scope.data.hottestArticle.startpage)) $scope.data.hottestArticle.startpage = 1;
                        $scope.data.hottestArticle.ITEMCOUNT = data.TOTALELEMENTS;
                        $scope.data.hottestArticle.PAGESIZE = $scope.page.pagesize;
                        $scope.data.hottestArticle.PAGECOUNT = data.TOTALPAGES;

                    });
            }
            $scope.getHottestArticles = function() {
                getHottestArticles();
            };
            /**
             * [getLatestArticles description]获取最新文章
             */
            $scope.getLatestArticles = function() {
                getLatestArticles();
            };
            /**
             * [jumpToPage description]分页跳转
             */
            $scope.jumpToPage = function() {
                var willGoPage = $scope.status.isInLatestArticle ? $scope.data.latestArticle.willGoPage : $scope.data.hottestArticle.willGoPage;
                var pageCount = $scope.status.isInLatestArticle ? $scope.data.latestArticle.PAGECOUNT : $scope.data.hottestArticle.PAGECOUNT;
                if (pageCount < parseInt(willGoPage)) {
                    trsconfirm.alertType("超过了最大页数", "", "warning", false);
                    return;
                }
                if ($scope.status.isInLatestArticle) {
                    $scope.data.latestArticle.startpage = angular.copy($scope.data.latestArticle.willGoPage);
                    getLatestArticles();
                } else {
                    $scope.data.hottestArticle.startpage = angular.copy($scope.data.hottestArticle.willGoPage);
                    getHottestArticles();
                }
            };
            /**
             * [jumpToPage description]获取热度趋势
             */
            function getMediaTrend() {
                var params = {
                    typeid: "widget",
                    serviceid: "monitorsearch",
                    modelid: "getmediatrend",
                    id: $stateParams.id,
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    $scope.data.mediaTrend = data;
                    angular.forEach($scope.data.mediaTrend, function(value, key) {
                        handleMediaTrend($scope.data.mediaTrend[key]);
                    });
                });
            }
            /**
             * [handleMediaTrend description]处理热点趋势数据
             */
            function handleMediaTrend(dateType) {
                var trend = parseFloat(dateType.TREND);
                if (angular.isDefined(dateType.TREND)) {
                    dateType.upDown = trend > 0 ? 'up' : 'down';
                    dateType.TREND = Math.abs(trend) + "%";
                } else {
                    dateType.upDown = 'ungetnewlist';
                    dateType.TREND = '';
                }
                dateType.imgSrc = dateType.upDown === "up" ? './planningCenter/cueSelectedTopic/customMonitor/img/cm-5.png' : (dateType.upDown === "down" ? './planningCenter/cueSelectedTopic/customMonitor/img/cm-6.png' : './planningCenter/images/hcc20.png');
            }
            /**
             * [searchWithTime description]选择时间范围
             */
            $scope.searchWithTime = function(articleObj) {
                /*if (articleObj.timeType.startdate === null || articleObj.timeType.enddate === null) {
                    trsconfirm.alertType("请检查是否没有输入起始时间或结束时间", "", "warning", false);
                    return;
                }*/
                var date = new Date();
                var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                articleObj.timeType.startdate = articleObj.timeType.startdate === null ? "1900-01-01" : articleObj.timeType.startdate;
                articleObj.timeType.enddate = articleObj.timeType.enddate === null ? today : articleObj.timeType.enddate;
                if (articleObj.timeType.name === "自定义") {
                    var startDate = $filter('date')(articleObj.timeType.startdate, "yyyy-MM-dd");
                    var endDate = $filter('date')(articleObj.timeType.enddate, "yyyy-MM-dd");
                    if (startDate > endDate) {
                        trsconfirm.alertType("起始时间不能大于结束时间", "", "warning", false);
                        articleObj.timeType = angular.copy($scope.status.timeRange[0]);
                        $scope.data.latestArticle.selectcustom = false;
                    }
                    articleObj.timeType.value = startDate.toString() + ";" + endDate.toString();
                }
                if (articleObj.timeType.name === "全部时间") {
                    articleObj.timeType.value = "1";
                }
                $scope.data.latestArticle.startpage = 1;
                getLatestArticles();
            };
            /**
             * [showTitle description]鼠标移入显示标题详情
             * @param {[event]} event [description] 事件
             */
            $scope.showTitle = function(item, ev, popupwidth) {
                if (document.body.offsetWidth - ev.clientX > popupwidth) {
                    item.panelpostion = {
                        left: ev.offsetX
                    };
                } else {
                    item.panelpostion = {
                        left: 100
                    };
                }
                item.isShowTitle = true;
            };

            /**
             * [mediaHotLine description]媒体热度折线图
             */
            function mediaHotLine() {
                if ($filter('date')($scope.status.startTime, "yyyy-MM-dd") >= $filter('date')($scope.status.endTime, "yyyy-MM-dd")) {
                    trsconfirm.alertType("结束时间应大于开始时间", "", "warning", false);
                    return;
                }
                var params = {
                    'typeid': 'widget',
                    'serviceid': 'monitorsearch',
                    'modelid': 'getmediacount',
                    'id': $stateParams.id,
                    'starttime': $filter('date')($scope.status.startTime, "yyyy-MM-dd").toString(),
                    'endtime': $filter('date')($scope.status.endTime, "yyyy-MM-dd").toString(),
                };
                planCenCustomMonitorService.lineEcharts('', params, 'addMonitor_heatCon_line', $scope);
            }
            /**
             * [checkLine description]重新请求折线图
             */
            $scope.checkLine = function() {
                if (new Date($scope.status.startTime) > new Date($scope.status.endTime)) {
                    trsconfirm.alertType('起始时间不可大于结束时间', "", 'warning', false);
                    return;
                }
                mediaHotLine();
            };
        }
    ]);
