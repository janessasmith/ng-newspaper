"use strict";
/*
    createBy CC 2016-8-12
 */
angular.module('resourceCenterLiveMoudle', ['resourceCenterLiveLeftModule', 'resourceCenterLiveRouterMoudle', 'publishLiveMoudle', 'replyLiveMoudle', 'liveHosterModule', 'liveReplyListModule', 'liveSortModule']).controller('resourceCenterLiveController', ['$scope', '$state', '$q', '$modal', '$filter', 'trsHttpService', 'globleParamsSet', "trsconfirm", "trsspliceString", function($scope, $state, $q, $modal, $filter, trsHttpService, globleParamsSet, trsconfirm, trsspliceString) {
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
            serviceid: "mlf_liveshow",
            methodname: "queryLiveShowZhuTis",
            CurrPage: $scope.page.CURRPAGE,
            PageSize: $scope.page.PAGESIZE,
            ChannelId: $state.params.liveid,
        };
    }

    function initData() {
        requestData();
    }

    function requestData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = 0;
            $scope.data.items = data.DATA;
            $scope.data.selectedArray=[];
        });
    }
    /**
     * [publishLive description]新建直播
     * @return {[type]} [description]
     */
    $scope.publishLive = function() {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/publishLive/publishLive_tpl.html",
            windowClass: "resource-publishLive",
            backdrop: false,
            controller: "publishLiveController",
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
     * [deleteLive description]删除直播
     * @param  {[obj]} item [description]直播信息
     * @return {[type]}      [description]
     */
    $scope.deleteLives = function(item) {
        trsconfirm.confirmModel('删除直播', '是否删除直播', function() {
            deleteLive(item);
        });
    };
    /**
     * [liveCloseFilter description]直播是否结束过滤器
     * @param  {[obj]} elm [description]直播信息
     * @return {[type]}     [description]
     */
    $scope.liveCloseFilter = function(elm) {
        if (angular.isDefined(elm)) {
            return elm.ISCLOSE == 1;
        }
    };
    /**
     * [deleteLive description]删除直播方法
     * @param  {[obj]} item [description]要删除的直播信息
     * @return {[type]}      [description]
     */
    function deleteLive(item) {
        var array = item ? [item] : $scope.data.selectedArray;
        var temp = $filter('pick')(array, $scope.liveCloseFilter);
        if (temp.length == array.length) {
            var params = {
                serviceid: "mlf_liveshow",
                methodname: "delLiveShowZhuTi",
                ObjectIds: trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'XWCMLIVESHOWZHUTIID', ',')
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("删除成功", "", "success", false);
                requestData();
            });
        } else {
            trsconfirm.alertType('删除直播失败', '所要删除的直播中包含还未停止的直播', "error");
        }
    }
    /**
     * [editLive description]编辑直播
     * @return {[type]} [description]
     */
    $scope.editLive = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/publishLive/publishLive_tpl.html",
            windowClass: "resource-publishLive",
            backdrop: false,
            controller: "publishLiveController",
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
     * [replyLive description]新增一条回复
     * @param  {[obj]} item [description]直播信息
     * @return {[type]}      [description]
     */
    $scope.replyLive = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "./resourceCenter/live/modal/replyLive/replyLive.html",
            windowClass: "resource-replyLive",
            backdrop: false,
            controller: "replyLiveController",
            resolve: {
                incomeData: function() {
                    var incomeData = {
                        isCreate: true,
                        item: item
                    };
                    return incomeData;
                }
            }
        });
        modalInstance.result.then(function(result) {});
    };
    /**
     * [hoster description]管理主持人
     * @return {[type]} [description]
     */
    $scope.hoster = function() {
        $state.go('resourcectrl.hoster.resource', {
            reload: true
        });
    };
    /**
     * [replyList description]回复列表
     * @param  {[obj]} item [description]直播信息
     * @return {[type]}      [description]
     */
    $scope.replyList = function(item) {
        $state.go('resourcectrl.reply.resource', {
            "zhutiid": item.XWCMLIVESHOWZHUTIID
        }, {
            reload: true
        });
    };
    /**
     * [filterLive description]检索直播列表
     * @param  {[事件]} ev [description]js的event事件
     * @return {[type]}    [description]
     */
    $scope.filterLive = function(ev) {
        if (angular.isDefined(ev) && ev.keyCode == 13 || angular.isUndefined(ev)) {
            $scope.params.Title = $scope.data.filterLive;
            requestData();
        }
    };
    /**
     * [closeLive description]结束直播
     * @param  {[obj]} item [description]直播对象
     * @return {[type]}      [description]
     */
    $scope.closeLive = function(item) {
        var info = item.ISCLOSE == 0 ? "结束" : "重启";
        trsconfirm.confirmModel('提示信息', "您确定" + info + "<span style='color:red'>" + item.TITLE + "</span>", function() {
            var params = {
                serviceid: "mlf_liveshow",
                methodname: "isClose",
                XWCMLiveShowZhuTiId: item.XWCMLIVESHOWZHUTIID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                requestData();
            });
        });
    };
    /**
     * [showLive description]显示直播
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.showLive = function(item) {
        var info = item.ISSHOW == 0 ? "显示" : "隐藏";
        trsconfirm.confirmModel('提示信息', "您确定" + info + "<span style='color:red'>" + item.TITLE + "</span>", function() {
            var params = {
                serviceid: "mlf_liveshow",
                methodname: "isShowZhuTi",
                XWCMLiveShowZhuTiId: item.XWCMLIVESHOWZHUTIID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                requestData();
            });
        });
    };
    /**
     * [sortLive description]直播排序
     * @return {[type]} [description]
     */
    $scope.sortLive = function() {
        if ($scope.data.selectedArray.length < 2) {
            var modalInstance = $modal.open({
                templateUrl: "./resourceCenter/live/modal/sort/sort.html",
                windowClass: "signed-rank-window",
                backdrop: false,
                controller: "liveSortCtrl",
                resolve: {
                    incomeData: function() {
                        var incomeData = $scope.data.selectedArray;
                        return incomeData;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                requestData();
            });
        } else {
            trsconfirm.alertType('稿件排序失败', '稿件排序只允许单篇操作', "error");
        }
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
