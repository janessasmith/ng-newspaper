/*
 *  create By cc 2015-11-13
 *  Description 网站渠道 待编 管理废稿
 *  rebuild: xu.chunlong 2016-03-05
 */
"use strict";
angular.module('editingCenterCompiledWebsiteRecycleModule', []).
controller("editCompileWebsiteRecycleController", ["$stateParams", "$modal", "trsHttpService", "$scope", "SweetAlert", 'trsconfirm', '$timeout', 'initSingleSelecet', 'trsspliceString', 'initVersionService', 'editcenterRightsService', 'getWebsiteNameService', 'editingCenterService', 'globleParamsSet', function($stateParams, $modal, trsHttpService, $scope, SweetAlert, trsconfirm, $timeout, initSingleSelecet, trsspliceString, initVersionService, editcenterRightsService, getWebsiteNameService, editingCenterService, globleParamsSet) {
    initStatus();
    initData();

    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize()
        };
        $scope.status = {
            isESSearch: false,
            onlyMine: false,
            btnRights: {},
            copyCurrPage: 1,
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            stateParams: {
                "ChannelId": $stateParams.channelid,
                "SiteId": $stateParams.siteid
            },
            siteid: $stateParams.siteid,
            previewPath: ["websiteNewsPreview", "websiteAtlasPreview"],
            params: {
                "serviceid": "mlf_website",
                "methodname": "queryRecycleDoc",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "SiteId": $stateParams.siteid,
                "timeType": "",
                "DocId": ""
            }
        };

        $scope.data = {
            items: [],
            selectedArray: [],
            channelName: "",
        };
    }

    function initData() {
        requestData();
        initDropDown();
        getCurSite();
        editcenterRightsService.initWebsiteListBtnWithoutChn('website.recyclemgr', $stateParams.siteid).then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }

    //初始化数据
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.status.params;
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            $scope.data.items = data.DATA;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
            $scope.data.selectedArray = [];
        });
    }

    //获取当前站点信息
    function getCurSite() {
        getWebsiteNameService.getWebsiteName($stateParams.siteid).then(function(data) {
            $scope.data.channelName = data.SITEDESC;
        });
    }

    //初始化下拉框
    function initDropDown() {
        //初始化选择日期
        $scope.data.timeTypeJsons = initSingleSelecet.timeType();
        $scope.data.timeType = angular.copy($scope.data.timeTypeJsons[0]);
        //初始化选择类型
        $scope.data.docTypeJsons = initSingleSelecet.websiteDocType();
        $scope.data.docType = angular.copy($scope.data.docTypeJsons[0]);
        //初始化搜索框边的下拉框
        $scope.data.iWoAll = initSingleSelecet.iWoEntire();
        $scope.data.iWoAllSelected = angular.copy($scope.data.iWoAll[0]);
        // 排序方式
        $scope.sortTypeJsons = initSingleSelecet.sortType();
        $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
    }

    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForWebSiteRecycleDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.data.iWoAllSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "docType",
                    keywords: $scope.data.docType.value
                }, {
                    searchField: "timeType",
                    keywords: $scope.data.timeType.value
                }, {
                    searchField: "isOnlyMine",
                    keywords: $scope.status.onlyMine
                }, {
                    searchField: "siteid",
                    keywords: $stateParams.siteid
                }, {
                    searchField: "_sort",
                    keywords: $scope.sortType.value
                }]
            }
        };
        esParams.searchParams = JSON.stringify(esParams.searchParams);
        return esParams;
    }

    //下一页
    $scope.pageChanged = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    //跳转到指定页面
    $scope.jumpToPage = function() {
        if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.status.params.CurrPage = $scope.status.copyCurrPage;
        $scope.page.CURRPAGE = $scope.status.copyCurrPage;
        requestData();
    };
    /**
     * [selectPageNum description]选择单页分页条数
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.copyCurrPage = 1;
        requestData();
    };

    //全选
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
            .concat($scope.data.items);
    };

    //单选
    $scope.selectDoc = function(item) {
        var index = $scope.data.selectedArray.indexOf(item);
        if (index < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice(index, 1);
        }
    };

    /**
     * [queryByDropdown description] 筛选条件触发后请求数据
     * @param  {[type]} key   [description] 请求对象参数key
     * @param  {[type]} value [description] 请求对象值
     * @return {[type]}       [description] null
     */
    $scope.queryByDropdown = function(key, value) {
        $scope.status.params[key] = value;
        $scope.status.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
        if (key == 'timeType') {
            if (value.length < 10) {
                $scope.status.params.OperTimeStart = null;
                $scope.status.params.OperTimeEnd = null;
            } else {
                $scope.status.params.OperTimeStart = $scope.data.fromdate;
                $scope.status.params.OperTimeEnd = $scope.data.untildate;
                $scope.status.params[key] = null;
            }
        }
        requestData();
    };

    /**
     * [restore description] 还原操作
     * @param  {[type]} recId [description]  如果传入代表单个稿件还原，不传代表批量还原
     * @return {[type]}      [description]
     */
    $scope.restore = function(recId) {
        var arrayChnldocIDs = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
        trsconfirm.confirmModel("还原", "是否确认还原选中的稿件", function() {
            if (!!recId) {
                manuscript([recId]);
            } else {
                manuscript(arrayChnldocIDs);
            }
        });
    };

    //还原稿件方法
    function manuscript(recId) {
        var params = {
            "serviceid": "mlf_websiteoper",
            "methodname": "restoreMetaDatas",
            "ChannelId": $scope.status.stateParams.ChannelId,
            "ChnlDocIds": recId
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
            trsconfirm.alertType("还原成功", "", "success", false);
            requestData();
        });
        $scope.data.selectedArray = [];
    }

    /**
     * [deleteItem description] 删除稿件
     * @param  {[type]} recId [description]  如果传入代表单个稿件删除，不传代表批量删除
     * @return {[type]}      [description]
     */
    $scope.deleteItem = function(recId) {
        var deleteArrays = trsspliceString.spliceString($scope.data.selectedArray, "RECID", ",");
        trsconfirm.confirmModel('删除', '是否从废稿删除', function() {
            if (!!recId) {
                deleteChannelManuscript([recId]);
            } else {
                deleteChannelManuscript(deleteArrays);
            }
        });
    };

    //删除方法
    function deleteChannelManuscript(recId) {
        var params = {
            "serviceid": "mlf_websiteoper",
            "methodname": "removeMetaDatas",
            "ChannelId": $scope.status.stateParams.ChannelId,
            "ChnlDocIds": recId
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
            trsconfirm.alertType("删除成功", "", "success", false);
            requestData();
        });
        $scope.data.selectedArray = [];
    }

    /**
     * [clearTrash description]清空回收站
     * @param  {[str]} null
     * @return {[type]} [description]
     */
    $scope.clearTrash = function() {
        trsconfirm.inputModel("是否确认清空回收站", "删除原因(可选)", function() {
            trash();
        });
    };

    //回收站方法
    function trash() {
        var params = {
            "serviceid": "mlf_websiteoper",
            "methodname": "removeChnlMetaDatas",
            "SiteId": $scope.status.stateParams.SiteId
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
            trsconfirm.alertType("清空回收站成功", "", "success", false);
            requestData();
        });
        $scope.selectedArray = [];
    }

    /**
     * [isOnlyMine description]只看我的
     * @return {Boolean} [description] null
     */
    $scope.isOnlyMine = function() {
        $scope.page.CURRPAGE = "1";
        $scope.status.onlyMine = !$scope.status.onlyMine;
        $scope.status.params.isOnlyMine = $scope.status.onlyMine;
        requestData();
    };

    /**
     * [showVersionTime description]展示流程版本与操作日志
     * @param  {[str]} MetaDataId [description]
     * @return {[type]}            [description]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, false);
    };

    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下回车键也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            if ($scope.data.iWoAllSelected.value == "DocID") {
                $scope.status.isESSearch = false;
                $scope.status.params.DocId = $scope.keywords;
            } else {
                $scope.status.isESSearch = true;
            }
            $scope.page.CURRPAGE = 1;
            requestData();
        }
    };
}]);
