"use strict";
/*
    createBy cc 2016-08-15
 */
angular.module('liveHosterModule', ['addHosterModule']).controller('liveHosterCtrl', ['$scope', '$state', '$modal', '$filter', 'trsHttpService', 'globleParamsSet', "trsconfirm", "trsspliceString", "initComDataService", function($scope, $state, $modal, $filter, trsHttpService, globleParamsSet, trsconfirm, trsspliceString, initComDataService) {
    initStatus();
    initData();

    function initStatus() {
        $scope.status = {
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
        };
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize(),
        };
        $scope.data = {
            selectedArray: [],
            copyCurrPage: 1,
            items: [],
        };
        $scope.params = {
            serviceid: "mlf_liveshowcompere",
            methodname: "queryLiveShowComperes",
            CurrPage: $scope.page.CURRPAGE,
            PageSize: $scope.page.PAGESIZE
        };
    }

    function initData() {
        requestData();
    }

    function requestData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = 0;
            $scope.data.items = data.DATA;
            $scope.data.selectedArray = [];
        });
    }
    /**
     * [goBcak description]返回
     * @return {[type]} [description]
     */
    $scope.goBcak = function() {
        $state.go('resourcectrl.liveshow.resource', {
            reload: true
        });
    };
    /**
     * [addHoster description]新建主持人
     */
    $scope.addHoster = function() {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/hoster/addHoster/addHoster_tpl.html",
            windowClass: "resource-addHoster",
            backdrop: false,
            controller: "addHosterController",
            resolve: {
                incomeData: function() {
                    var incomeData = {
                        isCreate: true,
                    };
                    return incomeData;
                }
            }
        });
        modalInstance.result.then(function(result) {
            requestData();
        });
    };
    /**
     * [editHoster description]编辑主持人
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.editHoster = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/hoster/addHoster/addHoster_tpl.html",
            windowClass: "resource-addHoster",
            backdrop: false,
            controller: "addHosterController",
            resolve: {
                incomeData: function() {
                    var incomeData = {
                        isCreate: false,
                        item: item
                    };
                    return incomeData;
                }
            }
        });
        modalInstance.result.then(function(result) {
            requestData();
        });
    };
    /**
     * [deltetHoster description]删除主持人
     * @param  {[obj]} item [description]主持人信息
     * @return {[type]}      [description]
     */
    $scope.deltetHoster = function(item) {
        trsconfirm.confirmModel('删除主持人', '是否删除主持人', function() {
            deleteHosters(item);
        });
    };
    /**
     * [deleteHosters description]删除主持人方法
     * @param  {[ojb]} item [description]主持人信息
     * @return {[type]}      [description]
     */
    function deleteHosters(item) {
        var params = {
            serviceid: "mlf_liveshowcompere",
            methodname: "delLiveShowComperes",
            ObjectIds: trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'XWCMLIVESHOWCOMPEREID', ',')
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("主持人删除成功", "", "success", false);
            requestData();
        });
    }
    /**
     * [hosterFilter description]检索主持人列表
     * @param  {[事件]} ev [description]js的event事件
     * @return {[type]}    [description]
     */
    $scope.hosterFilter = function(ev) {
        $scope.params.CompereName = $scope.data.hosterFilter;
        requestData();
    };
    /**
     * [pageChanged description:下一页]
     */
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.data.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };

    /**
     * [jumpToPage description:跳转指定页面]
     */
    $scope.jumpToPage = function() {
        if ($scope.data.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.data.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.data.copyCurrPage;
        $scope.page.CURRPAGE = $scope.data.copyCurrPage;
        requestData();
    };
    /**
     * [selectPageNum description]选择单页显示条数 
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.data.copyCurrPage = 1;
        requestData();
    };
    /**
     * [selectDoc description]直播单选
     * @param  {[obj]} item [description]直播信息
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
     * [selectAll description]直播全选
     * @return {[type]} [description]
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
    };
}]);
