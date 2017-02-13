'use strict';
/**
 * Author:CC
 *
 * Time:2016-02-25
 */
angular.module('weixinPreviewModule', []).controller('WeiXinPreviewCtrl', ["$scope", "$sce", "$q", "$modal", "$timeout", "$state", "$location", "$window", "trsHttpService", "$stateParams", 'editcenterRightsService', 'trsconfirm', 'initVersionService', 'editingCenterService', 'websiteService', 'trsPrintService', 'trsPicturePreviewService', 'storageListenerService', function($scope, $sce, $q, $modal, $timeout, $state, $location, $window, trsHttpService, $stateParams, editcenterRightsService, trsconfirm, initVersionService, editingCenterService, websiteService, trsPrintService, trsPicturePreviewService, storageListenerService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化页面参数
     * @return {[type]} [description]null
     */
    function initStatus() {
        $scope.data = {
            params: {
                "serviceid": "mlf_wechat",
                "methodname": "getNewsDoc",
                "MetaDataId": $stateParams.metadataid
            },
            typeOfAttachmentArr: [],
            item: [],
            METADATAID: $stateParams.metadataid,
        };
        $scope.status = {
            platform: $stateParams.platform,
            bitFaceTit: "查看痕迹",
            btnRights: {},
            bigFaceRights: {},
            btnRightsName: ['wechat.daibian', 'wechat.daishen', 'wechat.yiqianfa', 'wechat.recyclemgr'],
        };
    }
    /**
     * [initData description]初始化页面数据
     * @return {[type]} [description]
     */
    function initData() {
        LazyLoad.css('./components/util/ueditor/service/css/ueditorBuiltInStyles.css?v=1.0', function(arg) {
            $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.data.params, "get").then(function(data) {
                $scope.item = data;
                if (angular.isDefined($scope.item.ABSTRACT)) {
                    $scope.item.ABSTRACT = $scope.item.ABSTRACT.replace(/\n/g, "<br/>");
                }
                $scope.extendItems = data.RELATEDNEWS;
                document.title = data.TITLE;
            });
        });
        initBtnRights();
        listenStorage();
    }

    /**
     * [initBtnRights description] 初始化权限
     * @return {[type]} [description]
     */
    function initBtnRights() {
        editcenterRightsService.initWeixinListBtn($scope.status.btnRightsName[$stateParams.platform], $stateParams.channelid).then(function(rights) {
            $scope.status.btnRights = rights;
        });
        //获取查看痕迹按钮权限
        editcenterRightsService.initWeixinListBtn('wechat.trace', $stateParams.channelid).then(function(data) {
            $scope.status.bigFaceRights = data;
        });
    }

    /**
     * [listenStorage description] 监听本地缓存
     * @return {[type]} [description]
     */
    function listenStorage() {
        storageListenerService.listenWeixin(function() {
            initData();
            storageListenerService.removeListener("weixin");
        });
    }

    /**
     * [creationAxis description] 创作轴
     * @return {[type]} [description]
     */
    $scope.creationAxis = function() {
        var params = {
            serviceid: "mlf_releasesource",
            methodname: "setCreation",
            metadataid: $stateParams.metadataid
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("加入创作轴成功", "", "success", false);
        });
    };

    /**
     * [close description]预览页面关闭
     * @return {[type]} [description]null
     */
    $scope.close = function() {
        $window.close();
    };

    /**
     * [edit description] 编辑
     * @return {[type]} [description]
     */
    $scope.edit = function() {
        var editParams = {
            channelid: $stateParams.channelid,
            chnldocid: $stateParams.chnldocid,
            metadataid: $stateParams.metadataid,
            platform: $stateParams.platform
        };
        var editUrl = $state.href("wxnews", editParams);
        $window.open(editUrl);
    };
    /**
     * [printBtn description：打印]
     */
    $scope.printBtn = function() {
        requestPrintVersion($stateParams.metadataid).then(function(data) {
            requestPrintData(data);
        });
    };
    /**
     * [requestPrintVersion description：打印请求流程]
     */
    function requestPrintVersion(item) {
        var deferred = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), { serviceid: "mlf_metadatalog", methodname: "query", MetaDataId: item }, 'get').then(function(data) {
            deferred.resolve(data.DATA);
        });
        return deferred.promise;
    }
    /**
     * [requestPrintVersion description：打印请求详情]
     */
    function requestPrintData(version) {
        var params = {
            "serviceid": "mlf_website",
            "methodname": $scope.data.params.methodname,
            "MetaDataId": $stateParams.metadataid
        };
        $scope.data.printResult = [];
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var result = data;
            data.VERSION = version;
            data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
            $scope.data.printResult.push(result);
            trsPrintService.trsWebPrintDocument($scope.data.printResult);
        });
    }
    /**
     * [picPreview description：导读图片预览]
     */
    $scope.picPreview = function(outlinePic) {
        trsPicturePreviewService.trsPicturePreview(outlinePic);
    };
}]);
