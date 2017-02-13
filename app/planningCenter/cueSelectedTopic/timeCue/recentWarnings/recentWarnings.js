"use strict";
/**
 *  timeCueModule Module
 *
 * Description 策划中心 信息监控 实时线索 近期预警
 * rebuild: SMG 2016-5-24
 */
angular.module('timeCueRecentWarningsModule', ['recentWarningServiceModele'])
    .controller('timeCueRecentWarningsController', ["$scope", "$filter", "trsconfirm", "trsHttpService", "recentWarning",
        function($scope, $filter, trsconfirm, trsHttpService, recentWarning) {
            initStatus();
            initData();

            function initStatus() {
                $scope.data = {
                    items: "",
                    selectedEarth: [],
                    selectedWeather: [],
                    earth: "",
                    typhoon: "",
                    weather: "",
                    AllEarth: [],
                    AllWeather: [],
                    keywords: "",
                    rightDisasterTypes: recentWarning.rightDisasterTypes(),
                    childDisasterTypes: recentWarning.childDisasterTypes(),
                    AllEarths: "",
                    AllWeathers: "",
                    disasterTypeImgs: recentWarning.disasterTypeImgs(),
                };
                $scope.status = {
                    jumpToPageNum: 1,
                    isSearch: false,
                    showDisasterTypes: true,
                    showEarthquake: true,
                    showWeather: true
                };
                $scope.page = {
                    "CURRPAGE": 0,
                    "PAGESIZE": 10
                };
                $scope.params = {
                    "serviceid": "recentdisaster",
                    "modelid": "get",
                    "page_no": $scope.page.CURRPAGE,
                    "page_size": $scope.page.PAGESIZE,
                    "search_date": ""
                };
                initRightDisasterTypes();
            }

            function initData() {
                getConfig();
                requestData();
            }
            /**
             * [initRightDisasterTypes description初始化右侧灾害类型信息]
             * @return {[type]} [description]
             */
            function initRightDisasterTypes() {
                //初始化右侧地震预警
                $scope.data.AllEarths = $scope.data.childDisasterTypes[$scope.data.rightDisasterTypes[0].VALUE];
                for (var i = 0; i < $scope.data.AllEarths.length; i++) {
                    $scope.data.AllEarth[i] = $scope.data.AllEarths[i].VALUE;
                }
                //初始化右侧天气预警
                $scope.data.AllWeathers = $scope.data.childDisasterTypes[$scope.data.rightDisasterTypes[1].VALUE];
                for (var i = 0; i < $scope.data.AllWeathers.length; i++) {
                    $scope.data.AllWeather[i] = $scope.data.AllWeathers[i].VALUE;
                }
            }
            /**
             * [getConfig description用户配置信息获取，上次被选中的灾害类型和灾害级别获取]
             * @return {[type]} [description]
             */
            function getConfig() {
                var params = {
                    "serviceid": "recentdisaster",
                    "modelid": "getConfig"
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    if (data) {
                        getEachDisasterType(data);
                    }

                });
            }
            /**
             * [getEachDisasterType description页面渲染被选中的灾害类型和灾害级别]
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            function getEachDisasterType(data) {
                for (var key in data) {
                    if (key == "地震") {
                        for (var i in data[key]) {
                            if (i != "地震") {
                                $scope.data.selectedEarth.push(i);
                            }
                        }
                    }
                    if (key == "天气") {
                        for (var j in data[key]) {
                            if (j != "天气") {
                                $scope.data.selectedWeather.push(j);
                            }
                        }
                    }
                    if (key == "台风") {
                        $scope.data.typhoon = data[key];
                    }
                }
            }
            /**
             * [requestData description列表数据请求]
             * @return {[type]} [description]
             */
            function requestData() {
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "get").then(function(data) {
                    $scope.data.items = data.PAGEITEMS;
                    $scope.page = {
                        CURRPAGE: data.PAGEINDEX + 1,
                        PAGESIZE: data.PAGESIZE,
                        ITEMCOUNT: data.TOTALITEMCOUNT,
                        PAGECOUNT: data.PAGETOTAL
                    };
                });
            }

            /**
             * [pageChanged description]分页请求
             * @return {[type]} [description]
             */
            $scope.pageChanged = function() {
                $scope.params.page_no = $scope.page.CURRPAGE - 1;
                $scope.status.jumpToPageNum = $scope.page.CURRPAGE;
                if ($scope.status.isSearch) {
                    searchData();
                } else {
                    requestData();
                }
            };


            $scope.jumpToPage = function() {
                if ($scope.status.jumpToPageNum > $scope.page.PAGECOUNT) {
                    $scope.status.jumpToPageNum = $scope.page.PAGECOUNT;
                }
                $scope.params.page_no = $scope.status.jumpToPageNum - 1;
                if ($scope.status.isSearch) {
                    searchData();
                } else {
                    requestData();
                }

            };
            /**
             * [brokeMonitorSearch description;根据关键词检索(包含检索的分页列表信息)]
             * @param  {[type]} ev [description:按下空格也能提交]
             */
            $scope.queryListBySearchWord = function(ev) {
                $scope.status.isSearch = true;
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.page.CURRPAGE = 0;
                    $scope.status.jumpToPageNum = 1;
                    searchData();
                }
            };
            /**
             * [searchData description查询：搜索框，根据标题、内容进行检索]
             * @return {[type]} [description]
             */
            function searchData() {
                var params = {
                    "serviceid": "recentdisaster",
                    "modelid": "search",
                    "page_no": $scope.page.CURRPAGE == 0 ? 0 : $scope.page.CURRPAGE - 1,
                    "page_size": $scope.page.PAGESIZE,
                    "search_date": "",
                    "search_word": angular.isDefined($scope.data.keywords) ? $scope.data.keywords : ""
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    $scope.data.items = data.PAGEITEMS;
                    $scope.page = {
                        CURRPAGE: data.PAGEINDEX + 1,
                        PAGESIZE: data.PAGESIZE,
                        ITEMCOUNT: data.TOTALITEMCOUNT,
                        PAGECOUNT: data.PAGETOTAL
                    };
                });
            }
            /**
             * [selectedDisasterTypes description 单选]
             * @param  {[type]} group [description]
             * @return {[type]}       [description]
             */
            $scope.selectedDisasterTypes = function(val, type) {
                if (type == "earth") {
                    if ($scope.data.selectedEarth.indexOf(val) < 0) {
                        $scope.data.selectedEarth.push(val);
                    } else {
                        $scope.data.selectedEarth.splice($scope.data.selectedEarth.indexOf(val), 1);
                    }
                }
                if (type == "weather") {
                    if ($scope.data.selectedWeather.indexOf(val) < 0) {
                        $scope.data.selectedWeather.push(val);
                    } else {
                        $scope.data.selectedWeather.splice($scope.data.selectedWeather.indexOf(val), 1);
                    }
                }
            };
            //单选：台风预警
            $scope.selectTyphoon = function() {
                $scope.data.typhoon = $scope.data.typhoon == '' ? '台风' : '';
            };
            //全选：地震预警
            $scope.selectAllEarth = function() {
                $scope.data.selectedEarth = $scope.data.selectedEarth.length == $scope.data.AllEarth.length ? [] : [].concat($scope.data.AllEarth);
            };
            //全选：天气预警
            $scope.selectAllWeather = function() {
                $scope.data.selectedWeather = $scope.data.selectedWeather.length == $scope.data.AllWeather.length ? [] : [].concat($scope.data.AllWeather);
            };
            /**
             * [saveAndWatch description保存并查看]
             * @return {[type]} [description]
             */
            $scope.saveAndWatch = function() {
                getDatasByConfig();
            };
            /**
             * [getDatasByConfig description用户配置信息存储，用户选择灾害类型以及灾害级别的保存]
             * @return {[type]} [description]
             */
            function getDatasByConfig() {
                $scope.data.keywords = ""; //清空检索词
                $scope.data.earth = "";
                $scope.data.weather = "";
                var params = {
                    "serviceid": "recentdisaster",
                    "modelid": "saveConfig"
                };
                if ($scope.data.selectedEarth.length == 0 && $scope.data.selectedWeather.length == 0 && $scope.data.typhoon == "") {
                    trsconfirm.alertType('请选择灾害类别', "", "warning", false);
                    return;
                }
                if ($scope.data.selectedEarth.length > 0) {
                    $scope.data.earth = $scope.data.earth.concat("地震;");
                    for (var i = 0; i < $scope.data.selectedEarth.length - 1; i++) {
                        $scope.data.earth = $scope.data.earth.concat($scope.data.selectedEarth[i] + ";");
                    }
                    $scope.data.earth = $scope.data.earth.concat($scope.data.selectedEarth[$scope.data.selectedEarth.length - 1]);
                    params.earth = $scope.data.earth;
                }
                if ($scope.data.selectedWeather.length > 0) {
                    $scope.data.weather = $scope.data.weather.concat("天气;");
                    for (var i = 0; i < $scope.data.selectedWeather.length - 1; i++) {
                        $scope.data.weather = $scope.data.weather.concat($scope.data.selectedWeather[i] + ";");
                    }
                    $scope.data.weather = $scope.data.weather.concat($scope.data.selectedWeather[$scope.data.selectedWeather.length - 1]);
                    params.weather = $scope.data.weather;
                }
                if ($scope.data.typhoon != "") {
                    params.typhoon = $scope.data.typhoon;
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    $scope.data.items = data.PAGEITEMS;
                    $scope.page = {
                        CURRPAGE: data.PAGEINDEX + 1,
                        PAGESIZE: data.PAGESIZE,
                        ITEMCOUNT: data.TOTALITEMCOUNT,
                        PAGECOUNT: data.PAGETOTAL
                    };
                });
            }
            /**
             * [getRelieveEntity description获取发布预警信息对应的解除预警信息]
             * @param  {[type]} items [description]
             * @return {[type]}       [description]
             */
            $scope.getRelieveEntity = function(item) {
                if (item.URLSTATUS != 0 || item.GROUPNAME != "天气") {
                    return;
                }
                var params = {
                    "serviceid": "recentdisaster",
                    "modelid": "getRelieveEntity",
                    "s_id": item.SID
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    if (angular.isDefined(data)) {
                        item.RelieveEntity = data;
                        if (angular.isDefined(item.RelieveEntity.URLTIME)) {
                            item.RelieveEntity.URLTIME = $filter("date")(new Date(Date.parse(item.RelieveEntity.URLTIME)), "yyyy-MM-dd HH:mm:ss").toString();
                        }
                    }
                });
            }

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
            将日期字符串转换为时间戳
            **/
            $scope.timeStamp = function(item) {
                var date = new Date(Date.parse(item.URLTIME));
                return $filter("date")(date, "yyyy-MM-dd HH:mm:ss").toString();
            };
            /**
             * [showImg description显示不同图标]
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            $scope.showImg = function(item) {
                var img = "";
                if (item.GROUPNAME == '地震') {
                    img = $scope.data.disasterTypeImgs[item.GROUPNAME].img;
                } else if (item.GROUPNAME == '台风') {
                    img = $scope.data.disasterTypeImgs[item.GROUPNAME].img;
                } else { /*天气*/
                    img = $scope.data.disasterTypeImgs[item.GROUPNAME][item.RATE][item.WEATHER_TYPE];
                }
                return img;
            };
            /**
             * [setStyle description设置列表展示样式]
             * @param {[type]} item [description]
             */
            $scope.setStyle = function(item){
                var setClass = item.RelieveEntity.URLTITLE?'warnings_main warnings_main_relieve':'warnings_main warnings_main_color';
                if(item.RATE=='其它'){
                    setClass+=' warnings_main_noIcon';
                }
                return setClass;
            };
        }
    ]);
