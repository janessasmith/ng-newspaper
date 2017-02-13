"use strict";
/*
    created by cc 2015-11-16
 */
angular.module('iWoObjTimeModule', []).
controller('editiWoObjTimeCtrl', ['$scope', '$filter', '$sce', '$q', '$modalInstance', 'trsHttpService', "trsconfirm", "incomingData", "initVersionService", function($scope, $filter, $sce, $q, $modalInstance, trsHttpService, trsconfirm, incomingData, initVersionService) {
    initStatus();
    initData();

    function initData() {
        getOperationLog("copyOperationLog", "operationLog", "operationLog");
        getVersionTime();
        getComment();
        if (incomingData.hasCopyDraft === true) {
            getCopyDraft();
        }
    }

    function initStatus() {
        $scope.page = {
            operationLog: {
                CURRPAGE: 1,
                PAGESIZE: 20,
                ITEMCOUNT: 1,
                PAGECOUNT: 1
            },
            copyLog: {
                CURRPAGE: 1,
                PAGESIZE: 20,
                ITEMCOUNT: 1,
                PAGECOUNT: 1
            },
            comment: {
                CURRPAGE: 1,
                PAGESIZE: 20,
                ITEMCOUNT: 1,
                PAGECOUNT: 1
            },
        };
        $scope.params = {
            operationLog: {
                serviceid: "mlf_metadatalog",
                methodname: "query",
                CURRPAGE: $scope.page.operationLog.CURRPAGE,
                MetaDataId: incomingData.MetaDataId,
                PAGESIZE: $scope.page.operationLog.PAGESIZE,
            },
            copyLog: {
                serviceid: "mlf_metadatalog",
                methodname: "query",
                CURRPAGE: $scope.page.copyLog.CURRPAGE,
                MetaDataId: incomingData.MetaDataId,
                PAGESIZE: $scope.page.copyLog.PAGESIZE,
            },
            comment: {
                serviceid: 'mlf_comment',
                methodname: 'queryComments',
                CURRPAGE: $scope.page.comment.CURRPAGE,
                MetaDataId: incomingData.MetaDataId,
                PAGESIZE: $scope.page.comment.PAGESIZE,
            }
        };
        $scope.status = {
            hasCopyDraft: false,
        };
        $scope.data = {
            operationLog: [],
            copyOperationLog: [],
            versionTime: [],
            copyDraft: [],
            copyDraftLog: [],
            anthorOperationLog: [],
            Channel: [],
            comment: [],
            voiceObj: {},
        };
    }
    /**
     * [getOperationLog description]获取操作日志
     * @param  {[type]} type [description]日志类型
     * @param  {[type]} key  [description]日志标示
     * @param  {[type]} page [description]日志分页信息
     * @return {[type]}      [description]
     */
    function getOperationLog(type, key, page) {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params[page], "get").then(function(data) {
            if (angular.isDefined(data.DATA)) {
                //处理复制稿切换操作日志
                if (type === 'anthorOperationLog' && $scope.params.copyLog.CURRPAGE == 1) {
                    $scope.data[type] = [];
                }
                $scope.data[type] = $filter('unique')($scope.data[type].concat(data.DATA), "METADATALOGID");
                $scope.data.Channel[type] = $filter('groupBy')($scope.data[type], 'MEDIATYPEDESC');
                for (var i in $scope.data.Channel[type]) {
                    $scope.data[key][i] = [];
                    $scope.data[key][i] = $scope.data[key][i].concat(initVersionService.getDayContent($scope.data.Channel[type][i]));
                }!!data.PAGER ? $scope.page[page] = data.PAGER : $scope.page[page].ITEMCOUNT = 0;
            }
        });
    }
    /**
     * [getVersionTime description]获得流程版本
     * @return {[type]} [description]
     */
    function getVersionTime() {
        var params = {
            serviceid: "mlf_extversion",
            methodname: "queryVersions",
            MetaDataId: incomingData.MetaDataId,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            if (angular.isUndefined(data)) return;
            $scope.data.versionTime = initVersionService.getDayContent(data);
        });
    }
    /**
     * [getCopyDraft description]获得复制稿以及默认显示第一个复制稿件的操作日志
     * @return {[type]} [description]
     */
    function getCopyDraft() {
        var copyAndBuildParams = { //复制稿请求参数
            serviceid: "mlf_releasesource",
            methodname: "queryCopyAndBuildDocs",
            MetaDataId: incomingData.MetaDataId
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), copyAndBuildParams, "get").then(function(data) {
            if (data.length !== 0) {
                $scope.status.hasCopyDraft = true;
                $scope.data.copyDraft = data;
                $scope.params.copyLog.MetaDataId = $scope.data.copyDraft[0].METADATAID;
                $scope.params.copyLog.CURRPAGE = 1;
                getOperationLog('anthorOperationLog', 'copyDraftLog', 'copyLog');
            }
        });
    }
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    /**
     * [getCopyDraftLog description]点击切换复制稿日志
     * @param  {[type]} metadataid [description]稿件ID
     * @return {[type]}            [description]
     */
    $scope.getCopyDraftLog = function(metadataid) {
        $scope.params.copyLog.MetaDataId = metadataid;
        $scope.params.copyLog.CURRPAGE = 1;
        getOperationLog('anthorOperationLog', 'copyDraftLog', 'copyLog');
    };
    /**
     * [getLoadMore description]点击加载更多
     * @param  {[type]} type [description]日志种类
     * @param  {[type]} key  [description]日志标示
     * @param  {[type]} page [description]日志分页信息
     * @return {[type]}      [description]
     */
    $scope.getLoadMore = function(type, key, page) {
        $scope.params[page].CURRPAGE += 1;
        getOperationLog(type, key, page);
    };
    /**
     * getVersionTime  加载操作日志
     * @param  {Boolean} isGetMore [description：判断是否加载跟多]
     * 
     */
    $scope.getLoadMoreComment = function() {
        $scope.params.comment.CURRPAGE += 1;
        getComment();
    };

    /**
     * [getComment description]请求评审意见
     */
    function getComment() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params.comment, 'post').then(function(data) {
            if (angular.isDefined(data.DATA)) {
                angular.forEach(data.DATA, function(value, key) {
                    if (value.COMMTYPE == '2') {
                        requestVoice(value.COMMENT);
                    }
                });
                // $scope.data.comment = initVersionService.getDayContent(data.DATA).concat($scope.data.comment);
                // $scope.data.comment = $scope.data.comment.concat(initVersionService.getDayContent(data.DATA));
                data.DATA.reverse();
                var moreComment = initVersionService.getDayContent(data.DATA);
                if (angular.isDefined($scope.data.comment[$scope.data.comment.length - 1]) && $filter('date')($scope.data.comment[$scope.data.comment.length - 1].day, "yyyy-MM-dd").toString() == $filter('date')(moreComment[0].day, "yyyy-MM-dd").toString()) {
                    $scope.data.comment[$scope.data.comment.length - 1].times = $scope.data.comment[$scope.data.comment.length - 1].times.concat(moreComment[0].times);
                    moreComment.shift();
                }
                $scope.data.comment = $scope.data.comment.concat(moreComment);
                !!data.PAGER ? $scope.page.comment = data.PAGER : $scope.page.comment.ITEMCOUNT = 0;
            }
        });
    }
    /**
     * [requestVoice description]请求音频文件
     */
    function requestVoice(id) {
        trsHttpService.httpServer(window.location.origin + '/mas/openapi/pages.do', {
            'method': 'prePlay',
            'appKey': 'TRSWCM7',
            'json': { "masId": id, "isLive": "false", "player": "HTML5" },
        }, 'get').then(function(data) {
            $scope.data.voiceObj[id] = data.streamsMap.l.httpURL;
        });
    }
    /**
     * [trustUrl description]信任url
     */
    $scope.trustUrl = $sce.trustAsResourceUrl;
}]);
