"use strict";
/*
    create By cc 2016-07-15
 */
angular.module('editingCenterCompiledRecycleModule', []).
controller("editCompileRecycleController", ["$stateParams", "trsHttpService", "$scope", "globleParamsSet", 'trsconfirm', '$timeout', 'initSingleSelecet', 'trsspliceString', 'editingCenterService','editcenterRightsService',function($stateParams, trsHttpService, $scope, globleParamsSet, trsconfirm, $timeout, initSingleSelecet, trsspliceString, editingCenterService,editcenterRightsService) {
    //初始化状态
    initStatus();
    //请求数据
    initData();
    /**
     * [initStatus description]初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize()
        };
        $scope.params = {
            "serviceid": "mlf_appmetadata",
            "methodname": "queryRecycleDoc",
            "PageSize": $scope.page.PAGESIZE,
            "CurrPage": $scope.page.CURRPAGE,
            "SiteId": $stateParams.siteid,
        };
        $scope.data = {
            items: [],
            selectedArray: [],
            copyCurrPage: 1,
        };
        $scope.status = {
            siteId: $stateParams.siteid,
            channelId: $stateParams.channelid,
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            onlyMine: false,
            isESSearch: false
        };
    }
    /**
     * [initData description]初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        requestData();
        initDropDown();
        editcenterRightsService.initAppListBtnWithoutChn("appsite.recyle", $stateParams.siteid).then(function(data) {
            $scope.status.btnRights = data;
        });
    }
    /**
     * [initDropDown description]初始化下拉框
     * @return {[type]} [description]
     */
    function initDropDown() {
        $scope.data.timeTypeJsons = initSingleSelecet.chooseTimeType();
        $scope.data.selectedTimeType = angular.copy($scope.data.timeTypeJsons[0]);
        $scope.data.sortTypeJsons = initSingleSelecet.sortType();
        $scope.data.sortType = angular.copy($scope.data.sortTypeJsons[1]);
        $scope.data.classifyJsons = initSingleSelecet.iWoEntire();
        $scope.data.selectedClassify = angular.copy($scope.data.classifyJsons[0]);
    }
    /**
     * [requetData description]数据请求函数
     * @return {[type]} [description]
     */
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.params;
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.items = data.DATA;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
            $scope.data.selectedArray = [];
        });
    }
    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForAppRecycleDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.data.selectedClassify.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "timeType",
                    keywords: $scope.data.selectedTimeType.value
                }, {
                    searchField: "isOnlyMine",
                    keywords: $scope.status.onlyMine
                }, {
                    searchField: "siteid",
                    keywords: $stateParams.siteid
                }, {
                    searchField: "_sort",
                    keywords: $scope.data.sortType.value
                }]
            }
        };
        esParams.searchParams = JSON.stringify(esParams.searchParams);
        return esParams;
    }
    /**
     * [pageChanged description]下一页
     * @return {[type]} [description]
     */
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.data.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /**
     * [jumpToPage description]跳转到指定页
     * @return {[type]} [description]
     */
    $scope.jumpToPage = function() {
        if ($scope.data.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.data.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.data.copyCurrPage;
        requestData();
    };
    /**
     * [selectPageNum description]选择单页显示个数
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.data.copyCurrPage = 1;
        requestData();
    };
    /**
     * [selectAll description]稿件全选
     * @return {[type]} [description]
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
            .concat($scope.data.items);
    };
    /**
     * [selectDoc description]稿件单选
     * @param  {[obj]} item [description]稿件具体信息
     * @return {[type]}      [description]
     */
    $scope.selectDoc = function(item) {
        if ($scope.data.selectedArray.indexOf(item) < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
        }
    };
    /**
     * [queryDropDown description]根据下拉条件查询列表
     * @param  {[string]} type [description]下拉条件
     * @param {[string]} [varname] [description]下拉值
     * @return {[type]}      [description]
     */
    $scope.queryDropDown = function(type, value) {
        $scope.params[type] = value;
        $scope.params.CurrPage = $scope.page.CURRPAGE = $scope.status.copyCurrPage = 1;
        if (type == 'timeType') {
            if (value.length < 10) {
                $scope.params.OperTimeStart = null;
                $scope.params.OperTimeEnd = null;
            } else {
                $scope.params.OperTimeStart = $scope.data.fromdate;
                $scope.params.OperTimeEnd = $scope.data.untildate;
                $scope.params[type] = null;
            }
        }
        requestData();
    };
    /**
     * [isOnlyMine description]只看我的
     * @return {Boolean} [description] null
     */
    $scope.isOnlyMine = function() {
        $scope.data.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
        $scope.status.onlyMine = !$scope.status.onlyMine;
        $scope.params.isOnlyMine = $scope.status.onlyMine;
        requestData();
    };
    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下回车也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            if ($scope.data.selectedClassify.value == "DocID") {
                $scope.status.isESSearch = false;
                $scope.params.DocId = $scope.keywords;
            } else {
                $scope.status.isESSearch = true;
            }
            $scope.page.CURRPAGE = 1;
            requestData();
        }
    };
    /**
     * [restore description]稿件还原
     * @return {[type]} [description]
     */
    $scope.restore = function(item) {
        $scope.status.isESSearch = false;
        trsconfirm.confirmModel('数据还原', '是否还原', function() {
            manuscript(item);
        });
    };
    /**
     * [manuscript description]稿件还原函数
     * @return {[type]} [description]
     */
    function manuscript(item) {
        var array = !!item ? [item] : $scope.data.selectedArray;
        var params = {
            serviceid: "mlf_appoper",
            methodname: 'restoreMetaDatas',
            ChnlDocIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
            MetaDataIds: trsspliceString.spliceString(array, 'METADATAID', ","),
            SiteId: $stateParams.siteid,
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("还原成功", "", "success", false, function() {
                requestData();
            });
        });
    }
    /**
     * [delete description]删除稿件
     * @param  {[obj]} item [description]稿件信息
     * @return {[type]}      [description]
     */
    $scope.delete = function(item) {
        $scope.status.isESSearch = false;
        trsconfirm.inputModel('删除', '输入删除意见', function(content) {
            deleteDraft(item, content);
        });
    };
    /**
     * [deleteDraft description]删除稿件函数
     * @param  {[obj]} item    [description]删除稿件信息
     * @param  {[str]} opinion [description]删除意见
     * @return {[type]}         [description]
     */
    function deleteDraft(item, opinion) {
        var array = !!item ? [item] : $scope.data.selectedArray;
        var params = {
            serviceid: "mlf_appoper",
            methodname: "removeMetaDatas",
            ChnlDocIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
            MetaDataIds: trsspliceString.spliceString(array, 'METADATAID', ","),
            SiteId: $stateParams.siteid,
            Opinion: opinion,
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("删除成功", "", "success", false, function() {
                requestData();
            });
        });
    }
    /**
     * [clearTrash description]清除回收站
     * @return {[type]} [description]
     */
    $scope.clear = function() {
        $scope.status.isESSearch = false;
        trsconfirm.confirmModel('清空回收站', '是否清空回收站', function() {
            clearTrash();
        });
    };
    /**
     * [clearTrash description]清空回收站方法
     * @return {[type]} [description]
     */
    function clearTrash() {
        var params = {
            serviceid: "mlf_appoper",
            methodname: "removeChnlMetaDatas",
            SiteId: $stateParams.siteid,
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
            trsconfirm.alertType("清空回收站成功", "", "success", false, function() {
                requestData();
            });
        });
    }
    /**
     * [showVersionTime description]显示流程版本
     * @param  {[obj]} item [description]稿件信息
     * @return {[type]}      [description]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, false);
    };

}]);
