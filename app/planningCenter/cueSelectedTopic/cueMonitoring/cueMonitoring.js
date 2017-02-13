"use strict";
angular.module('PlanCueMonitoringModule', [
        'PlanCueMonitorMoreModule',
        'PlanCueMonitorConfigModule',
        'calendarServiceModule',
        'cueMonitorDiscloseConfigModule',
        'planCenterEventHotKeyModule',
        'PlanCueMonitorWeiboDiscloseMoreModule',
        'PlanCueMonitorQianjiangMoreModule',
        'planCueMonitorTypeModule',
        'planCenterCustomOverviewModule',
        'customTitleDirectiveModule'
    ])
    .controller('PlanCueSelectedTopicController', ["$scope", "$filter", "$q", "$modal", "$state", "$stateParams", "trsHttpService", "$timeout", "initCueMonitorMoreService", "calendarService", "uiCalendarConfig", "trsconfirm", "storageListenerService", function($scope, $filter, $q, $modal, $state, $stateParams, trsHttpService, $timeout, initCueMonitorMoreService, calendarService, uiCalendarConfig, trsconfirm, storageListenerService) {
        initStutas();
        initData();

        function initStutas() {
            $scope.page = {
                "CURRPAGE": 0,
                "PAGESIZE": 8
            };
            $scope.params = {};
            $scope.data = {
                myDate: new Date(),
                custom: {
                    page: {
                        CURRPAGE: 1,
                        PAGESIZE: 8,
                    }
                },
                recentpolicy: {
                    page: {
                        CURRPAGE: 1,
                        PAGESIZE: 7,
                    },
                    items: "",
                    curPolicy: "china",
                    policyType: {
                        "china": "get",
                        "zj": "getzj",
                    }
                },
                historyToday: {
                    page: {
                        CURRPAGE: 1,
                        PAGESIZE: 8
                    },
                    items: ""
                },
                recentDisasters: {
                    page: {
                        CURRPAGE: 1,
                        PAGESIZE: 7
                    },
                    items: "",
                    disasterType: {
                        "typhoon": 0,
                        "earthquake": 1,
                        "weather": 2
                    },
                    curdisaster: "typhoon"
                },
                eventSources: [],
                events: [],
            };
            $scope.status = {
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
            initCalendar();
            initCalendarData();
            initDropDown();
            weiboDiscloseFun();
            getAllAddedMonitors();
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
         * [createNewCalandar description]添加自定义日程
         * @return {[type]} [description]
         */
        $scope.createNewCalandar = function() {
            var selectedEvent = {
                createTime: $scope.status.curTime,
                data: "",
                isList: true,
            };
            modifyCalandar(selectedEvent);
        };
        /**
         * [getCaledarModal description]通过自定义列表点击新建或者修改时间
         * @return {[type]} [description]
         */
        $scope.getCaledarModal = function(item) {
            var selectedEvent = {
                time: $filter('date')(item.BEFOREDATE, "yyyy-MM-dd hh:mm:ss").toString(),
                data: item,
                isList: false,
            };
            modifyCalandar(selectedEvent);
        };
        /**
         * [initCalendar description]初始化日期里配置项，日历相关操作开始
         * @return {[type]} [description]null
         */
        function initCalendar() {
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
                     * [eventLimitClick description]点击标识还有几项
                     * @param  {[obj]} cellInfo [description]包括点击的当前时间与隐藏的事件
                     * @return {[type]}          [description]null
                     */
                    eventLimitClick: function(cellInfo) {
                        var selectedEvent = {
                            time: $filter('date')(cellInfo.date._d, "yyyy-MM-dd").toString(),
                            data: cellInfo.segs[0].event,
                            isList: true,
                        };
                        modifyCalandar(selectedEvent);
                    },
                    /**
                     * [eventClick description]点击生成的事件条
                     * @param  {[obj]} event   [description]获得当前点击事件块的属性信息，包括开始时间，结束时间和事件的标题与内容
                     * @return {[type]}         [description]null
                     */
                    eventClick: function(event) {
                        var selectedEvent = {
                            time: $filter('date')(event.start._d, "yyyy-MM-dd").toString(),
                            data: event,
                            isList: true,
                        };
                        modifyCalandar(selectedEvent);
                    },
                    /**
                     * [dayClick description]点击日历中的每天
                     * @param  {[obj]} jsEvent     [description]获得当前点击天的具体信息，包括当前时间
                     * @return {[type]}             [description]null
                     */
                    dayClick: function(jsEvent) {
                        $scope.status.curTime = $filter('date')(jsEvent._d, "yyyy-MM-dd");
                        if ($scope.status.curTime.substr(8, 2) != $scope.status.today) {
                            angular.element('.Almanac').find('.fc-today').removeClass('selectedDay');
                        }
                        angular.element('.Almanac').find('.fc-day').removeClass('selectedDay');
                        angular.element(this).addClass('selectedDay');
                        refresh();
                    }
                }
            };
        }
        /**
         * [refresh description]分别刷新各项列表，自定义，近期政策，近期灾害与历史今天
         * @return {[type]} [description]null
         */
        function refresh() {
            eval($scope.status.currTrench + "()");
        }
        /**
         * [initCalendarData description]初始化日历数据
         * @param  {[str]} time [description]日历时间查询时间
         * @return {[type]}      [description]
         */
        function initCalendarData() {
            var params = {
                serviceid: 'customremind',
                modelid: 'month',
                date_now: $scope.status.curTime
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.events.splice(0, $scope.data.events.length);
                angular.forEach(data, function(value, key) {
                    $scope.data.events.push({
                        title: value.TITLE,
                        allDay: true,
                        end: value.ENDDATE + 86400000 * 2,
                        start: value.BEFOREDATE + 86400000,
                        content: value.CONTENT,
                        className: "calendarColor" + key % 5,
                        ID: value.ID
                    });
                });
                getCustomList();
            });
        }
        /**
         * [modifyCalandar description]新建修改日历事件
         * @param  {[obj]} data [description]选中的日历项目
         * @return {[type]}      [description]null
         */
        function modifyCalandar(data) {
            calendarService.calendar(data, function(result) {
                initCalendarData();
            });
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
         * [gotoToday description]回到今天,同时刷新自定义、近期政策等列表
         * @return {[type]} [description]null
         */
        $scope.gotoToday = function() {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('today');
            angular.element('.Almanac').find('.fc-day').removeClass('selectedDay');
            angular.element('.Almanac').find('.fc-today').addClass('selectedDay');
            $scope.status.curTime = $filter('date')(new Date(), "yyyy-MM-dd").toString();
            initDropDown();
            initCalendarData();
            refresh();
        };
        /**
         * [gotoSelectedYear description]选择指定时间
         * @return {[type]} [description]null
         */
        $scope.gotoSelectedTime = function() {
            $scope.status.curTime = $scope.dropDown.selectedYearDefault.value + '-' + $scope.dropDown.selectedMonthDefault.value + '-' + '01';
            gotoDate($scope.status.curTime);
            initCalendarData();
            refresh();
        };
        /**
         * [gotoDate description]转向指定日期
         * @param  {[str]} tarDate [description]
         * @return {[type]}         [description]null
         */
        function gotoDate(tarDate) {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', tarDate);
        }
        /**
         * [custom description]点击自定义，自定义相关操作开始
         * @return {[type]} [description]
         */
        $scope.custom = function() {
            $scope.status.currTrench = "getCustomList";
            getCustomList();
        };
        /**
         * [getCustomList description]获得自定义时间列表
         * @return {[type]} [description]null
         */
        function getCustomList() {
            var params = {
                serviceid: "customremind",
                modelid: "get",
                page_no: $scope.data.custom.page.CURRPAGE - 1,
                page_size: $scope.data.custom.page.PAGESIZE,
                before_date: $scope.status.curTime
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.custom.page = {
                    "CURRPAGE": data.NUMBER + 1,
                    "PAGESIZE": 8,
                    "ITEMCOUNT": data.TOTALELEMENTS,
                    "PAGECOUNT": data.TOTALPAGES
                };
                $scope.data.custom.customItems = data.CONTENT;
            });
        }
        /**
         * [custopmPageChanged description]获取自定义事件的分页，自定义相关操作结束
         * @return {[type]} [description]
         */
        $scope.custopmPageChanged = function() {
            getCustomList();
        };
        /**
         * [getRecentPolicy description]点击近期政策，近期政策相关操作开始
         * @return {[type]} [description]
         */
        $scope.getRecentPolicy = function(type) {
            $scope.status.currTrench = "getRecentPolicyList";
            $scope.data.recentpolicy.curPolicy = type;
            getRecentPolicyList();
        };
        /**
         * [getRecentPolicyList description]获得近期政策列表
         * @param  {[str]} time [description]请求时间
         * @return {[type]}      [description]null
         */
        function getRecentPolicyList() {
            var params = {
                "serviceid": "recentpolicy",
                "page_no": $scope.data.recentpolicy.page.CURRPAGE - 1,
                "page_size": $scope.data.recentpolicy.page.PAGESIZE,
                "url_date": $scope.status.curTime,
                "modelid": $scope.data.recentpolicy.policyType[$scope.data.recentpolicy.curPolicy],
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.recentpolicy.items = data.PAGEDLIST.PAGEITEMS;
                $scope.indexname = data.CONTENT.INDEXNAME;
                $scope.data.recentpolicy.page = {
                    "CURRPAGE": data.PAGEDLIST.PAGEINDEX + 1,
                    "PAGESIZE": data.PAGEDLIST.PAGESIZE,
                    "ITEMCOUNT": data.PAGEDLIST.TOTALITEMCOUNT,
                    "PAGECOUNT": data.PAGEDLIST.PAGETOTAL
                };
            });
        }
        /**
         * [recentPolicypageChanged description]近期政策的分页，近期政策功能结束
         * @return {[type]} [description]
         */
        $scope.recentPolicypageChanged = function() {
            getRecentPolicyList();
        };
        /**
         * [recentDisasters description]点击近期灾害
         * @return {[type]} [description]
         */
        $scope.recentDisasters = function(type) {
            $scope.status.currTrench = "getRecentDisasters";
            $scope.data.recentDisasters.curdisaster = type;
            getRecentDisasters(type);
        };
        $scope.recentDisasterspageChanged = function() {
            getRecentDisasters($scope.data.recentDisasters.curdisaster);
        };
        /**
         * [getRecentDisasters description]获得近期灾害列表
         * @param  {[type]} type [description]灾害种类，台风，天气与地震
         * @return {[type]}      [description]null
         */
        function getRecentDisasters(type) {
            var params = {
                serviceid: "recentdisaster",
                modelid: "get",
                page_no: $scope.data.recentDisasters.page.CURRPAGE - 1,
                page_size: $scope.data.recentDisasters.page.PAGESIZE,
                url_date: $scope.status.curTime,
                disaster_type: $scope.data.recentDisasters.disasterType[$scope.data.recentDisasters.curdisaster],
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.recentDisasters.items = data.PAGEDLIST.PAGEITEMS;
                $scope.data.recentDisasters.page = {
                    CURRPAGE: data.PAGEDLIST.PAGEINDEX + 1,
                    PAGESIZE: data.PAGEDLIST.PAGESIZE,
                    ITEMCOUNT: data.PAGEDLIST.TOTALITEMCOUNT,
                    PAGECOUNT: data.PAGEDLIST.PAGETOTAL
                };
            });
        }
        /**
         * [getHistoryToday description]切换到历史今天,历史今天相关功能开启
         * @return {[type]} [description]null
         */
        $scope.getHistoryToday = function() {
            $scope.status.currTrench = "getHistoryTodayList";
            getHistoryTodayList();
        };
        /**
         * [historyTodayChanged description]历史今天分页功能
         * @return {[type]} [description]
         */
        $scope.historyTodayChanged = function() {
            getHistoryTodayList();
        };
        /**
         * [getHistoryTodayList description]得到历史今天列表以及分页
         * @param  {[type]} time [description]
         * @return {[obj]}      [description]选择的时间
         */
        function getHistoryTodayList() {
            var params = {
                serviceid: "todayinhistory",
                modelid: "get",
                page_size: $scope.data.historyToday.page.PAGESIZE,
                page_no: $scope.data.historyToday.page.CURRPAGE - 1,
                month: $scope.status.curTime.substr(5, 2),
                day: $scope.status.curTime.substr(8, 2)
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.historyToday.items = data.PAGEDLIST.PAGEITEMS;
                $scope.data.historyToday.page = {
                    CURRPAGE: data.PAGEDLIST.PAGEINDEX + 1,
                    PAGESIZE: data.PAGEDLIST.PAGESIZE,
                    ITEMCOUNT: data.PAGEDLIST.TOTALITEMCOUNT,
                    PAGECOUNT: data.PAGEDLIST.TOTALPAGECOUNT
                };
            });
        }
        //初始化微博爆料
        function weiboDiscloseFun() {
            var params = {
                "serviceid": "weiboreport",
                "modelid": "content",
                "page_no": $scope.page.CURRPAGE,
                "page_size": $scope.page.PAGESIZE
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.weiboItems = data.PAGEITEMS;
            });
        }
        //选择单页显示个数
        $scope.selectPageNum = function() {
            $timeout(function() {
                $scope.params.PageSize = $scope.page.PAGESIZE;
                // requestData();
            });
        };

        //近期政策显示相关内容
        $scope.relatedContent = function(curIndex, curItem) {
            var params = {
                "serviceid": "recentpolicy",
                "modelid": "similar",
                "md5": curItem.MD5
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.relatedItems = data.PAGEDLIST.PAGEITEMS;
            });
            $scope.showRelated = curIndex;
        };

        //近期政策关闭相关内容
        $scope.closeRelated = function() {
            $scope.showRelated = "";
        };

        //鼠标移出关闭近期政策相关内容
        $scope.cancelRelated = function() {
            $scope.showRelated = "";
        };

        function requestData(params) {
            // $scope.params.month_data = true;
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }


        //显示爆料配置
        $scope.showDiscloseConfig = function() {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/discloseConfig/cueMonitorDiscloseConfig_tpl.html",
                windowClass: "cue-monitor-disclose-config-window",
                controller: "cueMonitorDiscloseConfigCtrl",
                resolve: {
                    title: function() {
                        return "微博爆料配置";
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $scope.weiboItems = result.PAGEITEMS;
            });
        };

        //初始化96068数据
        $scope.initQJDatas = function() {
            $scope.isShowDiscloseConfig = false;
            var params = {
                "serviceid": "96068",
                "modelid": "content",
                "page_no": $scope.page.CURRPAGE,
                "page_size": $scope.page.PAGESIZE
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.qianjiangItems = data.PAGEITEMS;
            });
        };

        //显示微博爆料图标
        $scope.showWeiboDiscloseIcon = function() {
            $scope.isShowDiscloseConfig = true;
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

        //获取全部已添加的监控
        function getAllAddedMonitors() {
            var params = {
                "serviceid": "multichannal",
                "modelid": "addedconfig",
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.monitors = data.CONTENT;
                angular.forEach($scope.monitors, function(value, key) {
                    $scope.status.isExisted[value.MONITORTYPE] = value.MONITORTYPE;
                    var id = value.ID;
                    initLastData(id, key);
                    initHotData(id, key);
                });
            });
        }

        //获取已添加的固定监控
        // function getAddedFixedMonitors() {
        //     var params = {
        //         "serviceid": "multichannal",
        //         "modelid": "fixedconfig",
        //     };
        //     trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
        //         $scope.addedFixedMonitors = data;
        //     });
        // }

        //选择监控类型,新建
        //$scope.chooseMonitorType = function() {
        //    var modalInstance = $modal.open({
        //        templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/monitorType/cueMonitorType_tpl.html",
        //        windowClass: "cue-monitor-type-window",
        //        controller: "cueMonitorTypeCtrl",
        //        resolve: {
        //            addedFixedMonitors: function() {
        //                return $scope.monitors;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function(result) {
        //        getAllAddedMonitors();
        //    });
        //};

        //初始化监控最新数据
        function initLastData(id, key) {
            var params = {
                "serviceid": "multichannal",
                "modelid": "newest",
                "id": id
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                if (angular.isUndefined(data.CONTENT.RESULT)) return;
                $scope.monitors[key].NEWSTESTNEWS = data.CONTENT.RESULT.PAGEITEMS;
                $scope.monitors[key].indexname = data.CONTENT.INDEXNAME;
            });
        }

        //初始化监控最热数据
        function initHotData(id, key) {
            var params = {
                "serviceid": "multichannal",
                "modelid": "hottest",
                "id": id
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                if (angular.isUndefined(data.CONTENT.RESULT)) return;
                $scope.monitors[key].HOTTESTNEWS = data.CONTENT.RESULT;
                $scope.monitors[key].indexname = data.CONTENT.INDEXNAME;
            });
        }

        //删除当前监控，删除
        $scope.closeCurMonitor = function(curmonitor) {
            trsconfirm.confirmModel("删除", "是否删除当前监控", function() {
                var params = {
                    "serviceid": "multichannal",
                    "modelid": "delete",
                    "id": curmonitor.ID
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    //手动清空
                    $scope.status.isExisted = {};
                    getAllAddedMonitors();
                });
            });
        };

        //显示当前的配置，修改
        $scope.showConfig = function(monitor) {
            //如果是自定义的配置,跳转到资源中心
            if (monitor.MONITORTYPE == "monitor_CUSTOM") {
                $state.go("retrieval.subscribe", {
                    isControl: true
                });
            }
            //否则，在修改当前配置 
            else {
                var transformData = monitor;
                var modalInstance = $modal.open({
                    templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/config/cueMonitorConfig_tpl.html",
                    windowClass: "cue-monitor-config-window",
                    controller: "cueMonitorConfigCtrl",
                    resolve: {
                        transformData: function() {
                            return transformData;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    getAllAddedMonitors();
                });
            }

        };

        //根据不同的渠道显示不同的配置,新增
        $scope.showDifConfig = function(item, configTitle, monitorname) {
            var transformData = {
                "MONITORTYPE": item,
                "CONFIGTITLE": configTitle,
                "MONITORNAME": monitorname
            };
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/config/cueMonitorConfig_tpl.html",
                windowClass: "cue-monitor-config-window",
                controller: "cueMonitorConfigCtrl",
                resolve: {
                    transformData: function() {
                        return transformData;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                getAllAddedMonitors();
            });
        };

        //跳转到资源中心自定义
        $scope.goToCustom = function() {
            $state.go("retrieval.subscribe", {
                isControl: true
            });
        };
    }]);
