"use strict";
/*
    createBy cc 2016-08-16
 */
angular.module('liveReplyListModule', []).controller('liveReplyListCtrl', ['$scope', '$state', '$modal', '$stateParams', '$filter', 'trsHttpService', 'globleParamsSet', 'trsconfirm', 'trsspliceString', function($scope, $state, $modal, $stateParams, $filter, trsHttpService, globleParamsSet, trsconfirm, trsspliceString) {
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
            serviceid: "mlf_liveshowreply",
            methodname: "queryLiveShowReplys",
            ZHUTIID: $stateParams.zhutiid,
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
            angular.forEach($scope.data.items, function(data, index) {
                if (data.PICURL !== '') {
                    data.PICURL = data.PICURL.split(',');
                }
            });
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
    /**
     * [addReply description]新增回复
     */
    $scope.addReply = function() {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/replyLive/replyLive.html",
            windowClass: "resource-replyLive",
            backdrop: false,
            controller: "replyLiveController",
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
     * [deleteReply description]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.deleteReply = function(item) {
        trsconfirm.confirmModel('删除回复', '是否删除回复', function() {
            replyDelete(item);
        });
    };
    /**
     * [replyDelete description]删除回复方法
     * @param  {[obj]} item [description]回复对象
     * @return {[type]}      [description]
     */
    function replyDelete(item) {
        var params = {
            serviceid: "mlf_liveshowreply",
            methodname: "delLiveShowReply",
            ObjectIds: trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'XWCMLIVESHOWREPLYID', ',')
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType('删除回复成功', "", "success");
            requestData();
        });
    }
    /**
     * [editReply description]编辑回复
     * @param  {[obj]} item [description]回复对象
     * @return {[type]}      [description]
     */
    $scope.editReply = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/replyLive/replyLive.html",
            windowClass: "resource-replyLive",
            backdrop: false,
            controller: "replyLiveController",
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
}]);
