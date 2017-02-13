'use strict';
/**
 *  Module  热点新闻
 *
 * Description lY
 */
angular.module('PlanHotHeadLineModule', [
        'PlanHotHeadLineRouterModule',
        'hotHeadLineServiceModule',
        'hotHeadPolymerizationModule',
        'hotHeadLineDirectiveModule',
        'initSingleSelectionModule',
        'planHotGatherModule',
        'planNetwrokDetailModule',
        'planWebsiteDetailRouterModule'
    ])
    .controller('PlanHotHeadLineCtrl', ['$scope', '$q', '$timeout', '$filter', 'trsHttpService', 'initSingleSelecet', 'trsEchartsService', 'hotHeadLineService', '$modal', 'initCueMonitorMoreService', 'randomTxtList', 'barEcharts', 'initHotHead', 'randomClass',
        function($scope, $q, $timeout, $filter, trsHttpService, initSingleSelecet, trsEchartsService, hotHeadLineService, $modal, initCueMonitorMoreService, randomTxtList, barEcharts, initHotHead, randomClass) {
            initstatus();
            initData();

            function initstatus() {
                $scope.status = {
                    //初始化纸媒头版数据
                    initTopNewspaperData: [],
                    //初始化纸媒头版eachars数据
                    initTopNewspaperObj: [],
                    curWebSite: "",
                    //
                    fzItems: [],
                    newspaperChooseTime: initHotHead.initpaperTime(),
                    newspaperlistDetail: '',
                    //初始化报纸列表
                    newspaperList: [],
                    //初始化查看页indexname
                    newspaperindexname: '',
                    //初始化摘要
                    hotStrvalue: false,
                    //初始化人物榜单TAB
                    figureListTab: [],
                    websiteMediasDetail: "",
                    // time: $scope.status.newspaperChooseTime[2]
                    hotClass: [],
                    group: '0',
                };
                $scope.data = {
                    websiteMedias: {
                        page: {
                            "page_no": 0,
                            "page_size": 20,
                        },
                        websiteMeidaType: [], //网媒下的渠道
                        charts: "", //绘图
                        title: "", //联动值
                        sids: "", //网媒请求的sid值
                        websiteMediasDetailList: [], //列表项
                    },
                    newspaperMedias: {
                        page: {
                            "page_no": 0,
                            "page_size": 20,
                        }, //分页项
                        title: "", //联动标题
                        guids: "", //纸媒请求的guid值
                        reprintedNum: 0, //转载数
                        newsMediasDetailList: [], //列表项
                    },

                };
                //中国地图配置部分开始
                $scope.mapChina = {
                    option: trsEchartsService.initMapOption(),
                    mystyle: {
                        width: "700px",
                        height: "600px"
                    }, //trsEchartsService.initHeightWidth($scope.eWidth, $scope.eHeight),
                    type: "china"
                };
                //地图配置部分结束
                //热点导航地图数据获取

                //浙江地图配置部分开始
                /*hotHeadLineService.getHotSpotNavMap().then(function(data) {
                    $scope.myChart = {};
                    $scope.mapZhejiang = {
                        option: data,
                        mystyle: {
                            width: "700px",
                            height: "600px"
                        },
                        type: "zhejiang"
                    };
                });*/
                //地图配置部分结束
                ////获取日期轴数据
                getDateLineData();
                //获取小时时间轴
                hourData();

            }

            function initData() {
                $scope.status.time = $scope.status.newspaperChooseTime[2];
                //初始化网媒
                // getWebsiteMediaData();
                //纸媒头版
                topNewsPaper();
                getClassifyWebsiteData();

                hotAggregateTab().then(function(data) {
                    $scope.status.selectedItem = data[0];
                    hotPicDetail(data[0]);
                });
            }
            //初始化 热点聚合TAB
            function hotAggregateTab() {
                var defer = $q.defer();
                var firstmodal = {
                    DICTNAME: "全部",
                    DICTNUM: "000",
                    ID: "zyzxfield_000",
                    ORDERNUM: "1",
                };
                $scope.status.fzItems.push(firstmodal);
                var params = {
                    typeid: "widget",
                    serviceid: "hotpointcluster",
                    modelid: "userfields",
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    angular.forEach(data, function(value, key) {
                        if (value.ORDERNUM == 1) {
                            $scope.status.fzItems.push(value);
                        }
                    });
                    data.unshift(firstmodal);
                    defer.resolve(data);
                });
                return defer.promise;
            }
            //点击热点聚合
            function hotPicDetail(item) {
                var deffer = $q.defer();
                var params = {
                    "typeid": "widget",
                    "serviceid": "hotpointcluster",
                    "modelid": "hotpointnews",
                    "loadtime": $scope.status.selectedDate + " " + ($scope.status.selectedDate === $scope.status.curDate ? (parseInt($scope.status.selectedHour) < 10 ? '0' + $scope.status.selectedHour : $scope.status.selectedHour) : "24"),
                    "field": item.ID
                };
                $scope.hotPicPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    $scope.hotNums = randomTxtList(data);
                    delete $scope.hotPicPromise;
                    deffer.resolve();
                });
                return deffer.promise;
            }
            //点击热点聚合TAB
            $scope.hotPic = function(item) {
                $scope.status.selectedItem = item;
                $scope.hotNums = [];
                hotPicDetail(item);
            };
            //刷新热点聚合
            $scope.hotRefersh = function() {
                $scope.status.fzItems = [];
                var firstModal = {
                    DICTNAME: "全部",
                    DICTNUM: "000",
                    ID: "zyzxfield_000",
                    ORDERNUM: "1",
                };
                $scope.status.fzItems.push(firstModal);
                $scope.hotNums = [];
                var params = {
                    typeid: "widget",
                    serviceid: "hotpointcluster",
                    modelid: "userfields",
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    for (var i in data) {
                        if (data[i].ORDERNUM == 1) {
                            $scope.status.fzItems.push(data[i]);
                        }
                    }
                    data.unshift(firstModal);
                    $scope.status.selectedItem = data[0];
                    hotPicDetail(data[0]);
                });
            };


            function getDropDown() {
                //全部
                $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
                $scope.iWoEntireSelected = angular.copy($scope.iWoEntireJsons[0]);
                //类型
                $scope.iWoDocTypes = initSingleSelecet.iWoDocType();
                $scope.iWoDocTypeSelected = angular.copy($scope.iWoDocTypes[0]);
            }
            //类型筛选
            $scope.queryByDocType = function() {
                $scope.params.DocType = $scope.iWoDocTypeSelected.value;
            };
            $scope.showDiscloseConfig = function() {
                var modalInstance = $modal.open({
                    templateUrl: "./planningCenter/cueSelectedTopic/hotHeadLine/service/hotHeadPolymerization/hotHeadPolymerization.html",
                    windowClass: "cue-monitor-disclose-config-window",
                    controller: "hotHeadPolymerizationCtrl",
                    resolve: {
                        title: function() {
                            return "热点聚合图";
                        }
                    }
                });
                modalInstance.result.then(function() {
                    $scope.status.fzItems = [];
                    hotAggregateTab();
                });
            };
            /*
             * [topNewsPaper description]请求纸媒头版
             * 
             */
            function topNewsPaper() {
                var params = {
                    typeid: "widget",
                    serviceid: "papermediahistogram",
                    modelid: "get",
                    time_range: $scope.status.time.timeRange
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    barEcharts.barEcharts(data, function(data) {
                        $scope.status.initTopNewspaperData = data;
                        $scope.data.newspaperMedias.guids = data.guids[0];
                        $scope.data.newspaperMedias.title = $scope.status.initTopNewspaperData.name[0];
                        $scope.data.newspaperMedias.reprintedNum = $scope.status.initTopNewspaperData.data[0];
                        newspaperList(false);
                    });
                });
            }
            /*
             * [topNewsPaper description]点击时间选择
             * 
             */
            $scope.timeChoose = function(time, type) {
                $scope.status.time = time;
                if (type == "news") {
                    topNewsPaper();
                } else {
                    getClassifyWebsiteData($scope.status.curWebSite);
                }
            };
            /*
             * [topNewsPaper description]纸媒头版图表点击
             * 
             */
            $scope.$on("planWebDetailList", function(params) {
                $scope.data.websiteMedias.page.page_no = 0;
                $scope.data.websiteMedias.sids = params.targetScope.newspaperlistDetail.sids;
                $scope.data.websiteMedias.title = params.targetScope.newspaperlistDetail.name;
                getWebsiteMediaDetailLists(false);
            });
            /**
             * [description]监听点击网媒头条图表点击
             * @param  {[type]} params) {} [description]
             * @return {[type]}         [description]
             */
            $scope.$on('planNewsDetailList', function(params) {
                $scope.data.newspaperMedias.page.page_no = 0;
                $scope.data.newspaperMedias.guids = params.targetScope.newspaperlistDetail.guids;
                $scope.data.newspaperMedias.title = params.targetScope.newspaperlistDetail.name;
                $scope.data.newspaperMedias.reprintedNum = params.targetScope.newspaperlistDetail.data;
                newspaperList(false);
            });
            /**
             * [pageChange description]网媒与纸媒的点击分页
             * @param  {[type]} type [description]
             * @return {[type]}      [description]
             */
            $scope.pageChange = function(type) {
                if (type === 'news') {
                    if ($scope.data.newspaperMedias.page.page_no < $scope.data.newspaperMedias.page.pagecount - 1) {
                        $scope.data.newspaperMedias.page.page_no++;
                        newspaperList(true);
                    }
                } else {
                    if ($scope.data.websiteMedias.page.page_no < $scope.data.websiteMedias.page.pagecount - 1) {
                        $scope.data.websiteMedias.page.page_no++;
                        getWebsiteMediaDetailLists(true);
                    }
                }
            };
            /**
             * [showGroupPaper description] 显示集团稿件
             * @return {[type]} [description]
             */
            $scope.showGroupPaper = function() {
                var groupPaper = {
                    serviceid: "papermedia",
                    modelid: "list2",
                    guid: $scope.data.newspaperMedias.guids,
                    page_no: $scope.data.newspaperMedias.page.page_no,
                    page_size: 100,
                };
                $scope.status.group = 1;
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), groupPaper, "get").then(function(data) {
                    if (data.RESULT === '') return;
                    $scope.data.newspaperMedias.newsMediasDetailList = data.CONTENT.RESULT.PAGEITEMS;
                    $scope.status.newspaperindexname = data.CONTENT.INDEXNAME;
                });
            };
            /**
             * [showAllPaper description] 显示所有报刊
             * @return {[type]} [description]
             */
            $scope.showAllPaper = function() {
                $scope.status.group = 0;
                newspaperList(false);
            };
            /**
             * [newspaperList description]点击报纸图表获得纸媒列表
             * @param  {[boolean]} guids [description]是否分页
             * @return {[type]}       [description]
             */
            function newspaperList(isPage) {
                var detailList = {
                    serviceid: "papermedia",
                    modelid: "list",
                    guid: $scope.data.newspaperMedias.guids,
                    page_no: $scope.data.newspaperMedias.page.page_no,
                    page_size: 100,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), detailList, "get").then(function(data) {
                    if (data.RESULT === '') return;
                    if (isPage === false) {
                        $scope.data.newspaperMedias.newsMediasDetailList = data.CONTENT.RESULT.PAGEITEMS;
                    } else {
                        angular.forEach(data.CONTENT.RESULT.PAGEITEMS, function(value, key) {
                            $scope.data.newspaperMedias.newsMediasDetailList.push(value);
                        });
                    }
                    $scope.status.newspaperindexname = data.CONTENT.INDEXNAME;
                    $scope.data.newspaperMedias.page = {
                        page_no: data.CONTENT.RESULT.PAGEINDEX,
                        page_size: 100,
                        itemcount: data.CONTENT.RESULT.TOTALITEMCOUNT,
                        pagecount: data.CONTENT.RESULT.PAGETOTAL
                    };
                });
            }

            /**
             * [getWebsiteMediaData description]获得网媒头角各个渠道
             * @return {[type]} [description]null
             */
            function getWebsiteMediaData() {
                var params = {
                    serviceid: "networkmediahistogram",
                    modelid: "classify",
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    $scope.data.websiteMedias.websiteMeidaType = data;
                });
            }
            /**
             * [getWebsiteMediaList description]获得网媒头条下点击图表展示列表
             * @return {[nul]} [description]
             */
            function getWebsiteMediaDetailLists(isPage) {
                var params = {
                    serviceid: "networkmedia",
                    modelid: "get",
                    sids: $scope.data.websiteMedias.sids,
                    page_no: $scope.data.websiteMedias.page.page_no,
                    page_size: 200,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    if (data.PAGEDLIST.PAGEITEMS === "") return;
                    if (isPage === false) {
                        $scope.data.websiteMedias.websiteMediasDetailList = data.PAGEDLIST.PAGEITEMS;
                    } else {
                        angular.forEach(data.PAGEDLIST.PAGEITEMS, function(value, key) {
                            $scope.data.websiteMedias.websiteMediasDetailList.push(value);
                        });
                    }
                    $scope.data.websiteMedias.page = {
                        page_no: data.PAGEDLIST.PAGEINDEX,
                        page_size: 200,
                        itemcount: data.PAGEDLIST.TOTALITEMCOUNT,
                        pagecount: data.PAGEDLIST.PAGETOTAL,
                    };
                });
            }
            /**
             * [getDefaultWebsite description]点击网媒头条获得网媒第一个渠道下的数据
             * @return {[type]} [description]null
             */
            $scope.getDefaultWebsite = function() {
                // $scope.status.curWebSite = $scope.data.websiteMedias.websiteMeidaType[0];
                // getClassifyWebsiteData();
            };
            /**
             * [getClassifyWebsite description]点击不同网媒渠道获得绘图数据
             * @param  {[obj]} item [description]网媒选中渠道数据对象
             * @return {[type]}      [description]
             */
            // $scope.getClassifyWebsite = function(item) {
            //     $scope.data.websiteMedias.page.page_no = 0;
            //     $scope.status.curWebSite = item;
            //     getClassifyWebsiteData(item);
            // };
            /**
             * [getClassifyWebsiteData description]获得网媒绘图数据
             * @param  {[obj]} item [description]网媒选中渠道数据对象
             * @return {[type]}      [description]null
             */
            function getClassifyWebsiteData(item) {
                var params = {
                    serviceid: "networkmediahistogram",
                    modelid: "get",
                    dict_num: "000",
                    time_range: $scope.status.time.timeRange,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    barEcharts.barEcharts(data, function(data) {
                        $scope.data.websiteMedias.charts = data;
                        $scope.data.websiteMedias.sids = data.sids[0];
                        $scope.data.websiteMedias.title = data.name[0];
                        getWebsiteMediaDetailLists(false);
                    });
                });
            }

            /**
             * [hotkeyrank description] 热搜词排行榜
             */
            function hotkeyrank() {
                $scope.search = {
                    // 查询当天
                    today: $filter('date')(new Date(), "yyyy-MM-dd"),
                    // 查询按钮
                    tab: [],
                    //查询最近7天
                    time: [],
                    //查询特定时间
                    specificTime: "",
                    //查询特定标签
                    specificItem: '全部',
                };
                timeChoose();
            }
            /**
             * [GetLastWeekDate description] 最近7天
             */
            function GetLastWeekDate() {
                var myDate = new Date();

                myDate.setDate(myDate.getDate() - 6);
                var dateTemp;
                var flag = 1;
                for (var i = 0; i < 6; i++) {
                    dateTemp = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
                    $scope.search.time.push(dateTemp);
                    myDate.setDate(myDate.getDate() + flag);
                }
                if (new Date().getHours() > 5) $scope.search.time.push($scope.search.today);
            }
            /**
             * [timeChoose description] 根据小时来加载
             */
            function timeChoose() {
                if (new Date().getHours() > 5) {
                    timeSearch($scope.search.today);
                    channelSearch('全部', $scope.search.today);
                } else {
                    timeSearch(GetDateStr(-1));
                    channelSearch('全部', GetDateStr(-1));
                }
                GetLastWeekDate();
            }

            /**
             * [GetDateStr description]获取指定某一天时间
             */
            function GetDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1; //获取当前月份的日期 
                var d = dd.getDate();
                return y + "-" + m + "-" + d;
            }

            /**
             * [timeSearch description] 通过tab加载相关新闻
             * @param {[type]} [varname] [description]
             */
            $scope.listSearchTime = function(time) {
                timeSearch(time);
                channelSearch($scope.search.specificItem, time);

            };
            /**
             * [timeSearch description] 通过tab加载相关新闻
             * @param {[type]} [varname] [description]
             */
            $scope.hotSearch = function(item) {
                $scope.search.specificItem = item;
                channelSearch(item, $scope.search.specificTime);
            };
            /**
             * [timeSearch refersh] 通过按钮重载相关新闻
             * @param {[type]} [varname] [description]
             */
            $scope.refersh = function() {
                channelSearch($scope.search.specificItem, $scope.search.specificTime);
            };
            /**
             * [peopleSelected refersh] 网民热搜
             */
            $scope.peopleSelected = function() {
                hotkeyrank();
            };

            /**
             * [timeSearch description] 通过时间请求热搜词
             * @param {[type]} [varname] [description]
             */
            function timeSearch(time) {
                var hotKeyRank = {
                    typeid: "widget",
                    serviceid: "hotsearch",
                    modelid: "channel",
                    datetime: time
                };
                $scope.search.specificTime = time;
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), hotKeyRank, "get").then(function(data) {
                    $scope.search.tab = data;

                });
            }
            /**
             * [ channelSearch description] 通过分类请求热搜词
             * @param {[channel]} [varname] [description]分类，使用URLEncoder，比如%E5%86%9B%E4%BA%8B
             * @param {[datetime]} [varname] [description]日期，比如：2016-02-26
             */
            function channelSearch(channel, datetime) {
                var hotChannel = {
                    typeid: "widget",
                    serviceid: "hotsearch",
                    modelid: "content",
                    channel: channel,
                    datetime: datetime
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), hotChannel, "get").then(function(data) {
                    $scope.status.hotStrvalue = false;
                    $scope.hotNums = randomTxtList(data.CONTENT);
                });
                $scope.hotNums = {};
            }
            /**
             * [ getDateLine description] 获取时间轴数据
             */
            function getDateLineData() {
                var date = new Date();
                $scope.data.dateLine = [];
                for (var i = 6; i >= 0; i--) {
                    var tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i);
                    var month = parseInt((tempDate.getMonth() + 1)) < 10 ? ("0" + (tempDate.getMonth() + 1)) : (tempDate.getMonth() + 1);
                    var day = parseInt(tempDate.getDate()) < 10 ? ("0" + tempDate.getDate()) : tempDate.getDate();
                    $scope.data.dateLine.push(tempDate.getFullYear() + "-" + month + "-" + day);
                }
                $scope.status.selectedDate = $scope.data.dateLine[6];
                $scope.status.curDate = $scope.data.dateLine[6];
            }
            /**
             * [ chooseDate description] 选择日期
             *  @param {[date]} [varname] [description]所选日期
             */
            $scope.chooseDate = function(date) {
                if (!!$scope.hotPicPromise) return;
                $scope.status.selectedDate = date;
                hotPicDetail($scope.status.selectedItem).then(function() {});
            };
            /**
             * [ hourData description] 获取小时时间轴数据
             */
            function hourData() {
                var date = new Date();
                $scope.status.curHour = date.getHours() + "";
                $scope.data.hours = [];
                for (var i = 1; i <= 24; i++) {
                    $scope.data.hours.push(i + "");
                    if ((i + "") === $scope.status.curHour + "") {
                        $scope.status.selectedHour = i + "";
                    }
                }
            }
            /**
             * [ chooseHour description] 选择小时
             *  @param {[date]} [varname] [description]所选小时
             */
            $scope.chooseHour = function(hour) {
                if (!!$scope.hotPicPromise) return;
                if ($scope.compareHour(hour)) return;
                $scope.status.selectedHour = hour;
                hotPicDetail($scope.status.selectedItem).then(function() {});
            };
            /**
             * [ compareHour description] 比较小时
             *  @param {[date]} [varname] [description]所选小时
             */
            $scope.compareHour = function(hour) {
                var selectedHour = parseInt(hour);
                var curHour = $scope.status.curHour;
                var selectedTime = new Date(Date.parse($scope.status.selectedDate.replace(/-/g, "/") + " " + selectedHour + ":0:0"));
                var curTime = new Date();
                //return parseInt($scope.status.curHour) < trueHour;
                return curTime < selectedTime;
            };
        }
    ]);
