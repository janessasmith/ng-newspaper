"use strict";
angular.module('iWoDraftBoxModule', ['calendarServiceModule', 'ui.calendar']).
controller('iWoDraftBoxCtrl', iWodraftBoxCtrl);
iWodraftBoxCtrl.$injector = ["$scope", "$q", "$timeout", "$compile", "trsHttpService", "initSingleSelecet", "trsspliceString", "trsconfirm", "calendarService", "uiCalendarConfig", "editcenterRightsService", "storageListenerService", "globleParamsSet", "editingCenterService"];

function iWodraftBoxCtrl($scope, $q, $timeout, $compile, trsHttpService, initSingleSelecet, trsspliceString, trsconfirm, calendarService, uiCalendarConfig, editcenterRightsService, storageListenerService, globleParamsSet, editingCenterService) {
    initStatus();
    initData();
    /**
     * [pageChanged description]下一页
     */
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /**
     * [jumpToPage description]跳转到指定页面
     */
    $scope.jumpToPage = function() {
        if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.status.copyCurrPage;
        $scope.page.CURRPAGE = $scope.status.copyCurrPage;
        requestData();
    };

    /**
     * [initStatus description]初始化状态
     */
    function initStatus() {
        $scope.status = {
            batchOperateBtn: {
                'hoverStatus': '',
                'clickStatus': ''
            },
            icon: {
                noVideo: '0',
                noAudio: '0',
                noPic: '0'
            },
            btnRights: [],
            isESSearch: false,
            copyCurrPage: 1,
        };
        $scope.data = {
            selectedArray: [],
            preview: {
                "1": 'iWoNewsPreview',
                "2": 'iWoAtlasPreview'
            },
            dropDown: {
                'selectdTimeJson': '',
                'selectdTime': '',
                'iWoSelectedAll': '',
                'keywords': ''
            }
        };
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize(),
            "ITEMCOUNT": 0,
            "PAGECOUNT": 1,
        };
        $scope.params = {
            "serviceid": "mlf_releaseSource",
            "methodname": "queryReleaseRecycles",
            "PageSize": $scope.page.PAGESIZE,
            "CurrPage": $scope.page.CURRPAGE,
            "IsOnlyMine": false,
            "TimeType": "",
            "CrTime": ""
        };
    }
    /**
     * [initData description]初始化数据
     */
    function initData() {
        requestData();
        initDropDown();
        listenStorage();
        initListBtn();
    }
    /**
     * [listenStorage description]监听本地缓存
     * @return {[promise]} [description] promise
     */
    function listenStorage() {
        storageListenerService.listenIwo(function() {
            requestData();
            storageListenerService.removeListener("iwo");
        });
    }
    /**
     * [listenStorage description]监听本地缓存
     * @return {[promise]} [description] promise
     */
    function initListBtn() {
        editcenterRightsService.initIwoListBtn("iwo.waste").then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }
    /**
     * [initDropDown description]初始化下拉框
     * @return {[promise]} [description] promise
     */
    function initDropDown() {
        //初始化选择日期
        $scope.data.dropDown.selectdTimeJson = initSingleSelecet.iWoDraftBoxQueryTime();
        $scope.data.dropDown.selectdTime = angular.copy($scope.data.dropDown.selectdTimeJson[0]);
        // 排序方式
        $scope.sortTypeJsons = initSingleSelecet.sortType();
        $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
    }
    /**
     * [requestData description:数据请求方法]
     */
    function requestData() {
        //判断是否启用ES检索
        var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            $scope.data.items = data.DATA;
            var ListItems = data.DATA;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";

            $scope.data.selectedArray = [];
            requestListImg(ListItems).then(function(data) {
                angular.forEach(ListItems, function(value, key) {
                    value.ALLIMG = data[value.DOCID];
                });
            });
        });
    }
    /**
     * [requestListImg description:查询列表图示]
     */
    function requestListImg(items) {
        var defer = $q.defer();
        if (!items || items.length < 1) defer.resolve([]);
        else {
            var params = {
                serviceid: "mlf_myrelease",
                methodname: "queryAllImgLogo",
                // metadataids: trsspliceString.spliceString(items, "DOCID"||"METADATAID", ",")
            };
            params.metadataids = angular.isDefined(items[0].DOCID) ? trsspliceString.spliceString(items, "DOCID", ",") : trsspliceString.spliceString(items, "METADATAID", ",");
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                defer.resolve(data);
            });
        }
        return defer.promise;
    }
    /**
     * [promptRequest description]具体操作数据请求成功后刷新列表
     * @param  {[obj]} params [description]请求参数
     * @param  {[string]} info   [description]提示语
     * @return {[type]}        [description]
     */
    function promptRequest(params, info) {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType(info, "", "success", false, function() {
                requestData();
            });
        });
    }
    /**
     * [selectAll description:全选]
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
    };
    /**
     * [selectDoc description:单选]
     */
    $scope.selectDoc = function(item) {
        if ($scope.data.selectedArray.indexOf(item) < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
        }

    };
    /**
     * [deleteItems description:删除]
     */
    $scope.deleteItems = function(item) {
        trsconfirm.confirmModel("数据删除", "是否从废稿删除", function() {
            deleteItem(item);
        });
    };

    /**
     * [deleteItem description:删除方法]
     */
    function deleteItem(item) {
        var params = {
            "serviceid": "mlf_myrelease",
            "methodname": "delReleases",
            "ReleaseRecycleIds": trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'RELEASERECYCLEID', ',')
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            requestData();
        });
    }
    /**
     * [restoreItems description:还原]
     */
    $scope.restoreItems = function(item) {
        trsconfirm.confirmModel('数据还原', '是否还原', function() {
            restoreItem(item);
        });
    };
    /**
     * [restoreItem description:还原方法]
     */
    function restoreItem(item) {
        var params = {
            "serviceid": "mlf_myrelease",
            "methodname": "restoreReleases",
            "ReleaseRecycleIds": trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'RELEASERECYCLEID', ',')
        };
        promptRequest(params, "还原成功");
    }
    /**
     * [clearTrash description:清空回收站]
     */
    $scope.clearTrash = function() {
        trsconfirm.confirmModel("清空回收站", "是否清空回收站", function() {
            trash();
        });
    };
    /**
     * [clearTrash description:清空回收站方法]
     */
    function trash() {
        var params = {
            "serviceid": "mlf_myrelease",
            "methodname": 'cleanReleaseRecycles'
        };
        promptRequest(params, "清空回收站成功");
    }

    /**
     * [restoreItem description:下拉框筛选]
     */
    $scope.queryByDropDown = function(key, selected) {
        $scope.params[key] = selected.value;
        $scope.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
        if (key == 'CrTime') {
            if (selected.value.length < 10) {
                $scope.params.CrTimeStart = null;
                $scope.params.CrTimeEnd = null;
            } else {
                $scope.params.CrTimeStart = $scope.data.fromdate;
                $scope.params.CrTimeEnd = $scope.data.untildate;
                $scope.params[key] = null;
            }
        }
        requestData();
    };
    /**
     * [isOnlyMine description:是否只看我的]
     */
    $scope.isOnlyMine = function() {
        $scope.params.IsOnlyMine = !$scope.params.IsOnlyMine;
        $scope.page.CURRPAGE = "1";
        requestData();
    };

    /**
     * [restoreItem description:选择单页显示个数]
     */
    $scope.selectPageNum = function() {
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = 1;
        requestData();
    };
    //搜索
    $scope.fullTextSearch = function(ev) {
        var searchParams = {
            PAGESIZE: $scope.page.PAGESIZE + "",
            PAGEINDEX: '1',
            searchFields: [{
                searchField: "keywords",
                keywords: $scope.keywords ? $scope.keywords : ""
            }, {
                searchField: "onlyMine",
                keywords: $scope.onlyMine
            }, {
                searchField: "timeType",
                keywords: $scope.selectdTimeDefault.value
            }, {
                searchField: "_sort",
                keywords: $scope.sortType.value
            }]
        };
        var params = {
            'serviceid': "mlf_essearch",
            'methodname': "queryForIwoRecycleDoc",
            'searchParams': JSON.stringify(searchParams)
        };
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
            });
        }
    };
    /**
     * [showVersionTime description]流程版本与操作日志
     * @param  {[obj]} item [description]列表项
     * @return {[type]}      [description]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, true);
    };
    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForIwoRecycleDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: "",
                    keywords: $scope.data.dropDown.keywords ? $scope.data.dropDown.keywords : ""
                }, {
                    searchField: "isOnlyMine",
                    keywords: $scope.params.IsOnlyMine //只看过我的
                }, {
                    searchField: "timeType",
                    keywords: $scope.data.dropDown.selectdTime.value //创建时间
                }, {
                    searchField: "_sort",
                    keywords: $scope.sortType.value
                }]
            }
        };
        esParams.searchParams = JSON.stringify(esParams.searchParams);
        return esParams;
    }
    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下空格也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            $scope.status.isESSearch = true;
            requestData();
        }
    };
}
