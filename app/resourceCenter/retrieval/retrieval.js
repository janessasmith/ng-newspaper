'use strict';
/** 高级检索 */
angular.module('resCenRetMoulde', ['resCtrModalModule']).
controller('resCenRetCtrl', ['$scope', '$filter', '$state', '$stateParams', '$location', '$modal', 'resCtrModalService', 'initComDataService', 'resourceCenterService', 'trsspliceString', 'trsconfirm', 'leftService', '$interval', 'trsHttpService', '$anchorScroll', '$timeout',
    function($scope, $filter, $state, $stateParams, $location, $modal, resCtrModalService, initComDataService, resourceCenterService, trsspliceString, trsconfirm, leftService, $interval, trsHttpService, $anchorScroll, $timeout) {
        initStatus();
        initData();

        function initStatus() {
            var modeType = $stateParams.planKey ? "0" : "1";
            $scope.data = {
                searchValueList: [{
                        dictName: "文章检索"
                    }
                    // , {
                    //  dictName: "图片检索"
                    // }, {
                    //  dictName: "视频检索"
                    // }
                ],
                channelList: [{
                    dictName: "新华社",
                    ename: "xhsg",
                    typeName: "xlfl"
                }, {
                    dictName: "数字报",
                    ename: "szb",
                    typeName: "szb"
                }, {
                    dictName: "网站",
                    ename: "wz",
                    typeName: "web"
                }, {
                    dictName: "APP",
                    ename: "app"
                }, {
                    dictName: "微信",
                    ename: "wx"
                }, {
                    dictName: "集团成品库",
                    ename: "jtcpg",
                    typeName: "jt_lyzh"
                }],
                filterList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                searchList: {
                    xhsg: [],
                    szb: [],
                    internet: [],
                    jtcpg: []
                },
                selectedArray: {
                    xhsg: [],
                    szb: [],
                    wz: [],
                    app: [],
                    wx: [],
                    jtcpg: []
                },
                area: {
                    country: [],
                    province: [],
                    city: [],
                    town: []
                }
            }
            $scope.status = {
                curSearchType: "",
                curSearchChannel: "",
                openMoreResource: false,
                all: {
                    xhsg: false,
                    szb: false,
                    wz: false,
                    app: false,
                    wx: false,
                    jtcpg: false
                },
                searchType: "all",
                showWarningMsg: false,
                areaText: "",
                curOpenTreeItem: "",
                area: {}
            }
            $scope.page = {
                CURRPAGE: 1,
                PAGESIZE: 10
            };
            $scope.internetPage = {
                CURRPAGE: 1,
                PAGESIZE: 20
            }
            $scope.params = {
                modelid: "fullTableSearch",
                serviceid: "iwo",
                typeid: "zyzx",
                keywords: {
                    "search_relation": "0", //条件拼接词 0-and 1-or 2-not
                    "search_type": "document", //标记检索类型，今后会有图片、视频
                    "search_range": "full", //检索范围：full:题目+正文，title:题目
                    "keyword_and": "", //多值已空格“ ”分隔
                    "keyword_or": "", //多值已空格“ ”分隔
                    "keyword_not": "", //关键字组合,多值已空格“ ”分隔
                    "author": "", //作者, 多值;分隔
                    "area": "", //地域，码值，多值已;分隔
                    "time_range": "-1", //和下拉框规则一致
                    "guid": "",
                    "source_range": [] //检索范围，记录两大内容，channelname和具体的来源，channelname和订阅的channelname一致，sourcename主要指被选择的具体来源，使用来源中文名称，如果全选则是"all"
                }
            };
            $scope.status.curSearchType = $scope.data.searchValueList[0];
            $scope.status.curSearchChannel = $scope.data.channelList[0];
            initAnchor("searchPanel");
        }

        /** 内容地域 */
        function loadArea() {
            resourceCenterService.getRetrievalRootList({
                "serviceid": "area"
            }).then(function(data) {
                angular.forEach(data, function(value, key) {
                    value.name = value.dictName;
                });
                data.unshift({
                    name: "全部国家"
                });
                $scope.data.area.country = data;
                $scope.status.area.country = angular.copy(data[0]);
            });
        };
        /** [loadSubArea 地域 子集] */
        function loadSubArea(item, type) {
            if (item.id) {
                var labelName = type == "province" ? "全部省份" : (type == "city" ? "全部城市" : "全部区/县");
                resourceCenterService.getRetrievalChildren({
                    "serviceid": "area",
                    "parentId": item.id
                }).then(function(data) {
                    angular.forEach(data, function(value, key) {
                        value.name = value.dictName;
                    });
                    data.unshift({
                        name: labelName
                    });
                    $scope.data.area[type] = data;
                    $scope.status.area[type] = angular.copy(data[0]);
                });
            }
        };

        function reseatArea(level) {
            if (level == 1) {
                $scope.data.area.province = [];
                $scope.data.area.city = [];
                $scope.data.area.town = [];

                $scope.status.province = "";
                $scope.status.city = "";
                $scope.status.town = "";
            } else if (level == 2) {
                $scope.data.area.city = [];
                $scope.data.area.town = [];

                $scope.status.city = "";
                $scope.status.town = "";
            } else if (level == 3) {
                $scope.data.area.town = [];

                $scope.status.town = "";
            }
        }
        /** [loadSubArea description] 加载子级地区*/
        $scope.loadSubArea = function(item, level) {
            var type = level == 1 ? "province" : (level == 2 ? "city" : "town");
            reseatArea(level);
            loadSubArea(item, type);
        };
        /** [initAnchor 初始化锚点] */
        function initAnchor(id) {
            $location.hash(id);
            $timeout(function() {
                $anchorScroll();
            }, 10);
        }
        /** [initData description:初始化数据] */
        function initData() {
            initDropDown();
            loadSearchListData({
                channelName: $scope.status.curSearchChannel.ename,
                typeName: $scope.status.curSearchChannel.typeName
            }).then(function(data) {
                $scope.data.searchList.xhsg = data;
            });
        }
        /**
         * [initDropDown description]下拉框初始化
         */
        function initDropDown() {
            var params = {
                serviceid: "xhsg",
                channelName: "xhsg",
                typeName: "area"
            };
            resourceCenterService.getListDownData(params, "time", function(data) {
                $scope.data.timeArray = data;
                $scope.data.selectedTime = data[0];
            });
            loadArea();
        }
        /** [requestDataPromise 请求数据] */
        function requestDataPromise() {
            var params = "";
            if (formatParams() != false) {
                params = formatParams();
            } else {
                return false;
            }
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                if (data.result == "success") {
                    var pageInfo = data.summary_info;
                    $scope.items = data.content;
                    $scope.page = angular.extend($scope.page, pageInfo);
                    initAnchor("searchResult"); //锚点定位
                }
            });
        }
        /** [loadSearchListData 加载查询数据] */
        function loadSearchListData(extraparams) {
            var params = {
                "serviceid": "navigation",
                "typeid": "zyzx",
                "modelid": "base",
                "parentId": -1,
                "level": 1,
                "excludeId": -1,
                "containParent": false
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post");
        }
        /** [loadWebData description]网站数据 */
        function loadInternetData(extraparams) {
            var params = {
                typeid: "zyzx",
                modelid: "getAccount"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post");
        }
        /** [clearSearchData 重置搜索词] */
        function clearSearchData() {
            $scope.internetPage.CURRPAGE = 1;
            $scope.internetKeyword = "";
        }
        /** [checkChecked 判断是否选中] */
        function checkChecked(item) {
            var temp = false;
            var type = $scope.status.curSearchChannel.ename;
            angular.forEach($scope.data.selectedArray[type], function(value, key) {
                if ((item.id && (item.id == value.id)) || (item.ID && (item.ID == value.ID))) {
                    temp = true;
                }
            });
            return temp;
        }
        $scope.checkChecked = function(item) {
            return checkChecked(item);
        };
        /** [removeChecked 移除选中] */
        function removeChecked(item) {
            var type = $scope.status.curSearchChannel.ename;
            angular.forEach($scope.data.selectedArray[type], function(value, key) {
                if ((item.id && (item.id == value.id)) || (item.ID && (item.ID == value.ID))) {
                    $scope.data.selectedArray[type].splice(key, 1);
                    return;
                }
            });
        }
        $scope.keypressRefresh = function(evt) {
            if (evt.keyCode == 13) { //回车事件
                requestDataPromise();
            }
        };
        /** －－－－－－－分页开始－－－－－－ */
        /** 翻页 */
        $scope.pageChanged = function(temp) {
            if (temp) {
                var type = $scope.status.curSearchChannel.ename;
                loadInternetData({
                    serviceid: type,
                    typeName: type,
                    pageNum: $scope.internetPage.CURRPAGE,
                    pageSize: $scope.internetPage.PAGESIZE,
                    keyword: $scope.internetKeyword || ""
                }).then(function(data) {
                    $scope.data.searchList.internet = data.content;
                    $scope.internetPage = data.summary_info;
                });
            } else {
                requestDataPromise();
            }
        };
        $scope.$watch("page.CURRPAGE", function(newValue) {
            if (newValue > 0) {
                $scope.jumpToPageNum = newValue;
            }
        });
        /*跳转指定页面*/
        $scope.jumpToPage = function() {
            if ($scope.jumpToPageNum > $scope.page.PAGECOUNT) {
                $scope.page.CURRPAGE = $scope.page.PAGECOUNT;
                $scope.jumpToPageNum = $scope.page.CURRPAGE;
            }
            $scope.page.CURRPAGE = $scope.jumpToPageNum;
            requestDataPromise();
        };
        /** 下拉页面 */
        $scope.selectPageNum = function() {
            $timeout(function() {
                requestDataPromise();
            });
        };
        /** －－－－－－－分页结束－－－－－－ */
        /** [setSearchType description] 设置当前搜索类别 文字、图片、音视频*/
        $scope.setSearchType = function(item) {
            $scope.status.curSearchType = item;
        };
        /** [setSearchChannel description]设置渠道 */
        $scope.setSearchChannel = function(item) {
            $scope.status.curSearchChannel = item;
            var type = $scope.status.curSearchChannel.ename;
            if ($scope.data.searchList[type] && $scope.data.searchList[type].length) return;
            clearSearchData();
            if (type == "xhsg" || type == "szb" || type == "jtcpg") {
                loadSearchListData({
                    channelName: type,
                    typeName: $scope.status.curSearchChannel.typeName
                }).then(function(data) {
                    $scope.data.searchList[type] = data;
                });
            } else if (type == "wz" || type == "wx" || type == "app") {
                loadInternetData({
                    serviceid: type,
                    typeName: type,
                    pageNum: $scope.internetPage.CURRPAGE,
                    pageSize: $scope.internetPage.PAGESIZE,
                    keyword: $scope.internetKeyword || ""
                }).then(function(data) {
                    $scope.data.searchList.internet = data.content;
                    $scope.internetPage = data.summary_info;
                });
            }
        };
        /** [loadChildren description]加载子集 */
        $scope.loadChildren = function(group) {
            var type = $scope.status.curSearchChannel.ename;
            $scope.status.curOpenTreeItem = group;
            if (group.hasChildren == "true" && !group.children) {
                loadSearchListData({
                    channelName: type,
                    typeName: $scope.status.curSearchChannel.typeName,
                    parentId: group.id
                }).then(function(data) {
                    group.children = data;
                    if ($scope.status.all[type]) {
                        $scope.data.selectedArray[type] = angular.copy(data);
                    }
                });
            }
            if ($scope.status.all[type]) {
                $scope.data.selectedArray[type] = angular.copy(group.children);
            }
        };
        /** [searchWithKeyword description]关键字过滤 */
        $scope.searchWithKeyword = function() {
            var type = $scope.status.curSearchChannel.ename;
            $scope.internetPage.CURRPAGE = 1;
            loadInternetData({
                serviceid: type,
                typeName: type,
                pageNum: $scope.internetPage.CURRPAGE,
                pageSize: $scope.internetPage.PAGESIZE,
                keyword: $scope.internetKeyword || ""
            }).then(function(data) {
                $scope.data.searchList.internet = data.content;
                $scope.internetPage = data.summary_info;
            });
        };
        $scope.searchKeyPress = function(event) {
            if (event && event.keyCode !== 13) return;
            $scope.searchWithKeyword();
        };
        /** [selectAll description]全选 */
        $scope.selectAll = function() {
            $scope.status.searchType = "any";
            var type = $scope.status.curSearchChannel.ename,
                type2 = (type == "wz" || type == "app" || type == "wx") ? "internet" : type;
            if ($scope.data.selectedArray[type].length) {
                angular.forEach($scope.data.searchList[type2], function(value, key) {
                    if (!checkChecked(value)) {
                        $scope.data.selectedArray[type].push(value);
                    }
                });
            } else {
                $scope.data.selectedArray[type] = angular.copy($scope.data.searchList[type2]);
            }
        };
        /** [selectGroupAll description]分组全选 */
        $scope.selectGroupAll = function(group) {
            $scope.status.searchType = "any";
            var type = $scope.status.curSearchChannel.ename;
            if ($scope.data.selectedArray[type].length) {
                angular.forEach(group.children, function(value, key) {
                    if (!checkChecked(value)) {
                        $scope.data.selectedArray[type].push(value);
                    }
                });
            } else {
                $scope.data.selectedArray[type] = angular.copy(group.children);
            }
        };
        /** [deleteGroupAll description]删除分组 */
        $scope.deleteGroupAll = function(group) {
            var type = $scope.status.curSearchChannel.ename;
            var arr = [];
            angular.forEach($scope.data.selectedArray[type], function(value, key) {
                var temp;
                angular.forEach(group.children, function(n, i) {
                    if ((value.id && (value.id == n.id)) || (value.ID && (value.ID == n.ID))) {
                        temp = true;
                        return;
                    }
                });
                if (!temp) {
                    arr.push(value);
                }
            });
            $scope.data.selectedArray[type] = arr;
        };
        /** [deleteAll description] 反选*/
        $scope.deleteAll = function() {
            var type = $scope.status.curSearchChannel.ename;
            $scope.data.selectedArray[type] = [];
        };
        /** [selectDoc description]单选 */
        $scope.selectDoc = function(item) {
            $scope.status.searchType = "any";
            var type = $scope.status.curSearchChannel.ename;
            if ($scope.status.all[type] && (type == "szb" || type == "jtcpg")) {
                return false;
            } else {
                if (checkChecked(item)) {
                    removeChecked(item);
                } else {
                    $scope.data.selectedArray[type].push(item);
                }
            }
        };
        /** [search 检索] */
        $scope.search = function() {
            $scope.page.CURRPAGE = 1;
            requestDataPromise();
        };
        /** [empty 清空] */
        $scope.empty = function() {
            $scope.data.selectedArray = {
                xhsg: [],
                szb: [],
                wz: [],
                app: [],
                wx: [],
                jtcpg: []
            };
            reseatArea(1);
            $scope.params.keywords = {
                "search_relation": "0",
                "search_type": "document",
                "search_range": "full",
                "keyword_and": "",
                "keyword_or": "",
                "keyword_not": "",
                "author": "",
                "area": "",
                "time_range": "-1",
                "guid": "",
                "source_range": []
            }
            $scope.status.areaText = "";
            $scope.status.searchType = "all";
        };
        $scope.searchWithTime = function(curTime) {
            if (curTime.name == '自定义') {
                $scope.params.keywords.time_range = $filter('date')(curTime.startdate, "yyyy-MM-dd").toString() + ";" + $filter('date')(curTime.enddate, "yyyy-MM-dd").toString();
            } else if (curTime.name == "全部时间") {
                $scope.params.keywords.time_range = "";
            } else {
                $scope.params.keywords.time_range = curTime.value;
            }
        };
        /** [setAll description]全库 */
        $scope.setAll = function(type) {
            $scope.status.searchType = "any";
            $scope.status.all[type] = !$scope.status.all[type];
            if ($scope.status.all[type] && (type == "szb" || type == "jtcpg")) {
                $scope.data.selectedArray[type] = angular.copy($scope.status.curOpenTreeItem.children);
            } else if (!$scope.status.all[type] && (type == "szb" || type == "jtcpg")) {
                $scope.data.selectedArray[type] = [];
            }
        };
        /** [removeChecked 移除选中的] */
        $scope.removeChecked = function(item) {
            removeChecked(item);
        };
        /** [formatParams description]格式化参数 */
        function formatParams() {
            $scope.params = angular.extend($scope.params, {
                pageNum: $scope.page.CURRPAGE,
                pageSize: $scope.page.PAGESIZE
            });
            var params = angular.copy($scope.params);
            var sourceRange = formatSourceRange();
            if (!sourceRange.length) {
                $scope.status.showWarningMsg = true;
                trsconfirm.alertType("请选择来源!", "", "info", false);
                return false;
            } else {
                $scope.status.showWarningMsg = false;
            }
            params.keywords.source_range = sourceRange;
            params.keywords.area = getAreaParam() || "";
            //关键词组装
            // params.keywords.keyword_and = trsspliceString.getArrayString(params.keywords.keyword_and || [], "name", " ");
            // params.keywords.keyword_or = trsspliceString.getArrayString(params.keywords.keyword_or || [], "name", " ");
            // params.keywords.keyword_not = trsspliceString.getArrayString(params.keywords.keyword_not || [], "name", " ");
            // params.keywords.author = trsspliceString.getArrayString(params.keywords.author || [], "name", " ");
            params.keywords = JSON.stringify(params.keywords);
            return params;
        }
        /** [getAreaParam description]获取当前地区 */
        function getAreaParam() {
            var curArea = "";
            for (var name in $scope.status.area) {
                if ($scope.status.area[name] && $scope.status.area[name].dictName) {
                    curArea = $scope.status.area[name];
                } else {
                    break;
                }
            }
            return curArea.dictNum;
        }
        /** [formatSourceRange description]格式化资源参数 */
        function formatSourceRange() {
            var arr = [];
            var searchType = $scope.status.searchType;
            if (searchType == "all") {
                arr.push({
                    channelname: "all",
                    sourcename: "all"
                })
            } else {
                for (var name in $scope.data.selectedArray) {
                    var sourcenames = "";
                    if (name == "xhsg") {
                        sourcenames = getXhsgIds();
                        sourcenames = ($scope.status.all.xhsg || ($scope.data.selectedArray.xhsg.length == $scope.data.searchList.xhsg.length)) ? "all" : sourcenames;
                    } else {
                        if (name == "wz" || name == "app" || name == "wx") {
                            sourcenames = trsspliceString.getArrayString($scope.data.selectedArray[name], "DICTID", ",");
                        } else {
                            sourcenames = trsspliceString.getArrayString($scope.data.selectedArray[name], "dictName", ",");
                        }
                        sourcenames = $scope.status.all[name] == true ? "all" : sourcenames;
                    }
                    sourcenames && arr.push({
                        channelname: name,
                        sourcename: sourcenames
                    });
                }
            }
            return arr;
        }
        /** [getXhsgIds 或许新华社稿的id] */
        function getXhsgIds() {
            var arr = [];
            angular.forEach($scope.data.selectedArray.xhsg, function(value, key) {
                arr.push(value.id.split("_")[1]);
            });
            return arr.join(",");
        }
    }
]);