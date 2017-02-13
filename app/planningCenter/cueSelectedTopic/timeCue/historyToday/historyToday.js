"use strict";
/**
 *  timeCueModule Module
 *
 * Description 策划中心 信息监控 实时线索 历史今天
 * rebuild: SMG 2016-5-24
 */
angular.module('timeCueHistoryTodayModule', [])
    .controller('timeCueHistoryTodayController', ["$scope", "$state", "$filter", "trsHttpService", "calendarService", "uiCalendarConfig", "initCueMonitorMoreService", "trsLunarDateService",
        function($scope, $state, $filter, trsHttpService, calendarService, uiCalendarConfig, initCueMonitorMoreService, trsLunarDateService) {
            initStatus();
            initData();

            function initStatus() {
                $scope.data = {
                    items: "",
                    today: new Date(),
                    eventSources: [],
                    events: [],
                    month: "",
                    day: "",
                    weekDay: "",
                    yearMonthWeek: "",
                    today_Lunar: "",
                    min_date: "",
                    max_date: "",
                    year: ""
                };
                $scope.status = {
                    whichTabShow: "history_today",
                    jumpToPageNum: 1,
                    curTime: ""
                };
                $scope.page = {
                    "CURRPAGE": 0,
                    "PAGESIZE": 8
                };
                $scope.params = {
                    "serviceid": "todayinhistory",
                    "modelid": "get",
                    "page_no": $scope.page.CURRPAGE,
                    "page_size": $scope.page.PAGESIZE,
                    "month": "",
                    "day": ""
                };
                $scope.data.eventSources = [$scope.data.events];
                $scope.genParams = {
                    // StartDocPubTime: angular.copy(new Date()),
                    StartDocPubTime: Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                };
                $scope.genParams.copyDocPubtime = new Date(angular.copy($scope.genParams.StartDocPubTime));
            }

            function initData() {
                initCalendar();
                getCurrTimeInfo();
                requestData();
            }

            /**
             * [requestData description]数据请求函数(历史今天数据分页获取)
             * @return {[obj]} [description]
             */
            function requestData() {
                /*$scope.params.month = $scope.genParams.StartDocPubTime.getMonth() + 1;
                $scope.params.day = $scope.genParams.StartDocPubTime.getDate();*/
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "get").then(function(data) {
                    $scope.data.items = data.PAGEDLIST.PAGEITEMS;
                    $scope.page = {
                        CURRPAGE: data.PAGEDLIST.PAGEINDEX + 1,
                        PAGESIZE: data.PAGEDLIST.PAGESIZE,
                        ITEMCOUNT: data.PAGEDLIST.TOTALITEMCOUNT,
                        PAGECOUNT: data.PAGEDLIST.PAGETOTAL
                    };
                    if ($scope.data.items.length > 0) {
                        timeStamp();
                    }
                });
            }
            /**
             * 将日期字符串转换为时间戳
             */
            function timeStamp() {
                angular.forEach($scope.data.items, function(data, index) {
                    if (data.HISTORYDATE != "") {
                        data.HISTORYDATE = new Date(data.HISTORYDATE);
                    }
                });
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


            $scope.jumpToPage = function() {
                if ($scope.status.jumpToPageNum > $scope.page.PAGECOUNT) {
                    $scope.status.jumpToPageNum = $scope.page.PAGECOUNT;
                }
                $scope.params.page_no = $scope.status.jumpToPageNum - 1;
                requestData();
            };

            /**
             * [initCalendar description]初始化日期里配置项，日历相关操作开始
             * @return {[type]} [description]null
             */
            function initCalendar() {
                $scope.data.year = $scope.data.today.getFullYear();
                $scope.data.min_date = ($scope.data.year-1) + '-' + '12' + '-' + '31';
                $scope.data.max_date = $scope.data.year + '-' + '12' + '-' + '31';
                $scope.uiConfig = {
                    calendar: {
                        height: 480,
                        editable: false,
                        header: {
                            left: '',
                            center: '',
                            right: ""
                        },
                        eventLimit: true, //是否限制每个时间块显示的事件总数
                        views: {
                            month: {
                                eventLimit: 2,
                                eventLimitText: "项...",
                                displayEventTime: true,
                            }
                        },
                        /**
                         * [dayClick description]点击日历中的每天
                         * @param  {[obj]} jsEvent     [description]获得当前点击天的具体信息，包括当前时间
                         * @return {[type]}             [description]null
                         */
                        dayClick: function(jsEvent) {
                            $scope.status.curTime = $filter('date')(jsEvent._d, "yyyy-MM-dd");
                            angular.element('.Almanac').find('.fc-day').removeClass('selectedDay');
                            if ($scope.status.curTime != $filter('date')($scope.data.today, "yyyy-MM-dd")) {
                                angular.element('.Almanac').find('.fc-today').removeClass('selectedDay');
                                angular.element(this).addClass('selectedDay');
                            }
                            $scope.params.month = jsEvent._d.getMonth() + 1;
                            $scope.params.day = jsEvent._d.getDate();

                            $scope.params.month = $scope.params.month > 9 ? $scope.params.month : "0" + $scope.params.month;
                            $scope.params.day = $scope.params.day > 9 ? $scope.params.day : "0" + $scope.params.day;

                            getWeek(jsEvent._d);
                            $scope.data.yearMonthWeek = jsEvent._d.getFullYear() + "/" + $scope.params.month + "   " + $scope.data.weekDay;
                            $scope.data.today_Lunar = trsLunarDateService.getLunarDate(new Date($scope.status.curTime));

                            requestData();
                        }
                    }
                };
            }

            /**
             * [getCurrTimeInfo description展示当前日期信息]
             * @return {[type]} [description]
             */
            function getCurrTimeInfo() {
                //今日年月星期几
                $scope.params.month = $scope.genParams.copyDocPubtime.getMonth() + 1;
                $scope.params.day = $scope.genParams.copyDocPubtime.getDate();

                $scope.params.month = $scope.params.month > 9 ? $scope.params.month : "0" + $scope.params.month;
                $scope.params.day = $scope.params.day > 9 ? $scope.params.day : "0" + $scope.params.day;

                getWeek($scope.genParams.copyDocPubtime);
                $scope.data.yearMonthWeek = $scope.genParams.copyDocPubtime.getFullYear() + "-" + $scope.params.month + "  " + $scope.data.weekDay;
                $scope.data.today_Lunar = trsLunarDateService.getLunarDate($scope.genParams.copyDocPubtime);
            }

            function getWeek(curTime) {
                var week = curTime.getDay();
                switch (week) {
                    case 0:
                        $scope.data.weekDay = "星期日";
                        break;
                    case 1:
                        $scope.data.weekDay = "星期一";
                        break;
                    case 2:
                        $scope.data.weekDay = "星期二";
                        break;
                    case 3:
                        $scope.data.weekDay = "星期三";
                        break;
                    case 4:
                        $scope.data.weekDay = "星期四";
                        break;
                    case 5:
                        $scope.data.weekDay = "星期五";
                        break;
                    case 6:
                        $scope.data.weekDay = "星期六";
                        break;
                }
            }
            /**
             * [searchByMonthAndDay description点击查询按钮查询]
             * @return {[type]} [description]
             */
            $scope.searchByDate = function() {
                $scope.genParams.copyDocPubtime = new Date(angular.copy($scope.genParams.StartDocPubTime));
                getCurrTimeInfo();
                requestData();
                gotoDate($scope.genParams.copyDocPubtime);
                angular.element('.Almanac').find('.fc-day').removeClass('selectedDay');
            };
            /**
             * [gotoDate description]转向指定日期
             * @param  {[str]} tarDate [description]
             * @return {[type]}         [description]null
             */
            function gotoDate(tarDate) {
                uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', tarDate);
            }

        }
    ]);
