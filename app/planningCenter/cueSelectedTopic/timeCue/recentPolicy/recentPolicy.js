"use strict";
/**
 *  timeCueModule Module
 *
 * Description 策划中心 信息监控 实时线索 近期政策
 * rebuild: SMG 2016-5-24
 */
angular.module('timeCueRecentPolicyModule', [])
    .controller('timeCueRecentPolicyController', ["$scope", "$filter", "$q", "$modal", "$state", "$stateParams", "trsHttpService", "$timeout", "initCueMonitorMoreService", "calendarService", "uiCalendarConfig", "trsconfirm", "storageListenerService", function($scope, $filter, $q, $modal, $state, $stateParams, trsHttpService, $timeout, initCueMonitorMoreService, calendarService, uiCalendarConfig, trsconfirm, storageListenerService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20,
                "ITEMCOUNT": 0,
                "PAGECOUNT": 1,
            };
            $scope.params = {};
            $scope.data = {
                myDate: new Date(),
                recentpolicy: {
                    items: "",
                    curPolicy: "china",
                    policyType: {
                        "china": "get",
                        "zj": "getzj",
                    }
                },
                searchWord: "",
                eventSources: [],
                events: [],
            };
            $scope.status = {
                params: {
                    "PageSize": $scope.page.PAGESIZE,
                    "CurrPage": $scope.page.CURRPAGE,
                },
                isSearch: false,
                copyCurrPage: 1,
                currTrench: "getCustomList",
                curTime: $filter('date')(Date.parse(new Date()), "yyyy-MM-dd").toString(),
                lastDay: new Date($scope.data.myDate.getFullYear(), $scope.data.myDate.getMonth() + 1, 0).getDate(),
                isExisted: {}
            };
            $scope.dropDown = {};
            $scope.data.eventSources = [$scope.data.events];

            $scope.moreType = ["website", "weixin"];
            $scope.isSelectedDetail = "";
            $scope.isShowDiscloseConfig = true;
            $scope.monitors = [];
        }

        function initData() {
            // initCalendar();
            // initCalendarData();
            getRecentPolicyList();
            initDropDown();
            // weiboDiscloseFun();
            // getAllAddedMonitors();
            listenStorage();
        }

        /**
         * [listenStorage description]监听本地缓存
         * @return {[promise]} [description] promise
         */
        function listenStorage() {
            storageListenerService.listenPlan(function() {
                initCalendarData();
                storageListenerService.removeListener("plan");
            });
        }

        /**
         * [refresh description]分别刷新各项列表，自定义，近期政策，近期灾害与历史今天
         * @return {[type]} [description]null
         */
        function refresh() {
            eval($scope.status.currTrench + "()");
        }

        /**
         * [initDropDown description]下拉框初始化
         * @return {[type]} [description]null
         */
        function initDropDown() {
            //初始化选择日期
            $scope.dropDown.selectedMonth = initCueMonitorMoreService.monthSource();
            //下拉框获得的是当前月份
            $scope.dropDown.selectedMonthDefault = angular.copy($scope.dropDown.selectedMonth[new Date().getMonth()]);
            //获取当前年份以及以后10年
            $scope.dropDown.selectedYear = initCueMonitorMoreService.yearSource();
            $scope.dropDown.selectedYearDefault = angular.copy($scope.dropDown.selectedYear[0]);
        }

        /**
         * [getRecentPolicy description]点击近期政策，近期政策相关操作开始
         * @return {[type]} [description]
         */
        $scope.getRecentPolicy = function(type) {
            $scope.data.searchWord = "";
            $scope.status.currTrench = "getRecentPolicyList";
            $scope.data.recentpolicy.curPolicy = type;
            $scope.status.params.CurrPage = $scope.page.CURRPAGE = 1;
            getRecentPolicyList();
        };

        /**
         * [getRecentPolicyList description]获得近期政策列表
         * @param  {[str]} time [description]请求时间
         * @return {[type]}      [description]null
         */
        function getRecentPolicyList() {
            var params = {
                typeid: "widget",
                serviceid: "recentpolicy",
                modelid: "search",
                page_no: $scope.page.CURRPAGE - 1,
                page_size: $scope.page.PAGESIZE,
                region: $scope.data.recentpolicy.curPolicy,
                search_word: $scope.data.searchWord,
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.indexname = data.CONTENT.INDEXNAME;
                $scope.data.recentpolicy.items = data.PAGEDLIST.PAGEITEMS;
                $scope.page.ITEMCOUNT = data.PAGEDLIST.TOTALITEMCOUNT;
                $scope.page.PAGECOUNT = data.PAGEDLIST.TOTALPAGECOUNT;
            });
        }

        /**
         * [pageChanged description]近期政策的分页，近期政策功能结束
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            getRecentPolicyList();
        };

        /**
         * [jumpToPage description:跳转指定页面]
         */
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.status.params.CurrPage = $scope.status.copyCurrPage;
            $scope.page.CURRPAGE = $scope.status.copyCurrPage;
            getRecentPolicyList();
        };

        /**
         * [textSearch:检索]
         */
        $scope.textSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.params.CurrPage = $scope.page.CURRPAGE = 1;
                getRecentPolicyList();
            }
        };

        //鼠标移入显示内容详情
        $scope.mouseenter = function(curItem, ev, popupwidth) {
            if (document.body.offsetWidth - ev.clientX > popupwidth) {
                $scope.panelpostion = {
                    left: ev.offsetX
                };
            } else {
                $scope.panelpostion = {
                    left: 100
                };
            }
            $scope.isSelectedDetail = curItem;
        };

        //鼠标移出隐藏内容详情
        $scope.mouseleave = function() {
            $scope.isSelectedDetail = "";
        };
    }]);
