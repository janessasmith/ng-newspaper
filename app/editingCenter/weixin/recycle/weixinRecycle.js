/**
 *  weiXinRecycleModule
 *
 * Description 微信 管理废稿
 * rebuild:SMG 2016-6-28
 */
"use strict";
angular.module('weiXinRecycleModule', ['weiXinRecycleRouterModule']).
controller('weiXinRecycleCtrl', weiXinRecycle);
weiXinRecycle.$injector = ['$scope', '$stateParams', 'trsHttpService', 'trsspliceString', 'trsconfirm', 'initSingleSelecet', 'globleParamsSet', 'editingCenterService', 'WeiXininitService', 'editcenterRightsService'];

function weiXinRecycle($scope, $stateParams, trsHttpService, trsspliceString, trsconfirm, initSingleSelecet, globleParamsSet, editingCenterService, WeiXininitService, editcenterRightsService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化状态
     * @return {[type]} [description] null
     */
    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize()
        };
        $scope.status = {
            onlyMine: false, //只看我的
            isESSearch: false,
            copyCurrPage: 1,
            currChannel: {},
            btnRights: {},
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            params: {
                "serviceid": "mlf_wechat",
                "methodname": "queryRecycleDoc",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "timeType": "",
                "DocType": "",
                "ChannelId": $stateParams.channelid,
            }
        };
        $scope.data = {
            items: [],
            selectedArray: [],
        };
    }

    function initData() {
        initCurrSite();
        requestData();
        initDropDown();
        initBtnRights();
    }

    /**
     * [initCurrSite description] 获取栏目名称
     * @return {[type]} [description]
     */
    function initCurrSite() {
        WeiXininitService.queryCurrChannel($stateParams.channelid).then(function(data) {
            $scope.status.currChannel = data.substring(data.indexOf('《') + 1, data.indexOf('"', 1));
        });
    }

    /**
     * [initData description]初始化数据
     * @return {[type]} [description] null
     */
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.status.params;
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            $scope.data.items = data.DATA;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
            $scope.data.selectedArray = [];
        });
    }

    /**
     * [initDropDown description:初始化下拉框]
     */
    function initDropDown() {
        //初始化选择日期
        $scope.data.timeTypeJsons = initSingleSelecet.timeType();
        $scope.data.timeType = angular.copy($scope.data.timeTypeJsons[0]);
        //初始化搜索框边的下拉框
        $scope.data.iWoAll = initSingleSelecet.iWoEntire();
        $scope.data.iWoAllSelected = angular.copy($scope.data.iWoAll[0]);
        //初始化排序方式
        $scope.data.sortTypeJsons = initSingleSelecet.sortType();
        $scope.data.sortType = angular.copy($scope.data.sortTypeJsons[1]);
    }

    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForWeChatRecycleDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.data.iWoAllSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "timeType",
                    keywords: $scope.data.timeType.value
                }, {
                    searchField: "isOnlyMine",
                    keywords: $scope.status.onlyMine
                }, {
                    searchField: "channelid",
                    keywords: $stateParams.channelid
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
     * [initBtnRights description] 初始化权限
     * @return {[type]} [description]
     */
    function initBtnRights() {
        editcenterRightsService.initWeixinListBtn('wechat.recyclemgr', $stateParams.channelid).then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }

    /** [selectPageNum description] 每页显示的数据数量
     */
    $scope.selectPageNum = function() {
        $scope.status.copyCurrPage = 1;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        requestData();
    };

    /**
     * [selectPageNum description] 选择一页要显示的数据量
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.status.copyCurrPage = 1;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /**
     * [pageChanged description:下一页]
     */
    $scope.pageChanged = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
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
        requestData();
    };

    /**
     * [selectAll description:全选]
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
            .concat($scope.data.items);
    };

    /**
     * [selectDoc 单选]
     * @param  {[type]} item [description：单个对象] 
     */
    $scope.selectDoc = function(item) {
        if ($scope.data.selectedArray.indexOf(item) < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
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
    $scope.restore = function(item) {
        $scope.status.isESSearch = false;
        trsconfirm.confirmModel("还原", "是否确认还原选中的稿件", function() {
            manuscript(item);
        });
    };

    // 还原稿件方法
    function manuscript(item) {
        var params = {
            "serviceid": "mlf_wechatoper",
            "methodname": "restoreMetaDatas",
            "ChannelId": $stateParams.channelid,
            "ChnlDocIds": trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'CHNLDOCID', ',')
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            trsconfirm.alertType("还原成功", "", "success", false);
            requestData();
        });
    }

    /**
     * [deleteItem description] 删除
     */
    $scope.deleteItems = function(item) {
        $scope.status.isESSearch = false;
        trsconfirm.confirmModel("删除", "是否从废稿删除", function() {
            deleteItem(item);
        });
    };

    //删除稿件方法
    function deleteItem(item) {
        var params = {
            "serviceid": "mlf_wechatoper",
            "methodname": "removeMetaDatas",
            "ChnlDocIds": trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'CHNLDOCID', ',')
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("删除成功", "", "success", false, function() {
                requestData();
            });
        });
    }

    /**
     * [clearTrash description] 清空回收站
     */
    $scope.clearTrash = function() {
        $scope.status.isESSearch = false;
        trsconfirm.inputModel("是否确认清空回收站", "删除原因(可选)", function() {
            trash();
        });
    };

    function trash() {
        var params = {
            "serviceid": "mlf_wechatoper",
            "methodname": "removeChnlMetaDatas",
            "ChannelId": $stateParams.channelid
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("清空回收站成功", "", "success", false, function() {
                requestData();
            });
        });
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
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下回车也能提交]
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

    /**
     * [showVersionTime description]展示流程版本与操作日志
     * @param  {[str]} MetaDataId [description]
     * @return {[type]}            [description]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, false);
    };
}
