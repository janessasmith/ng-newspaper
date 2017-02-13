'use strict';
/**
 * Author:CC
 *
 * Time:2016-02-25
 */
angular.module('appPreviewModule', []).controller('appPreviewCtrl', ["$scope", "$sce", "$q", "$modal", "$timeout", "$state", "$location", "$window", "trsHttpService", "$stateParams", 'editcenterRightsService', 'trsconfirm', 'initVersionService', 'editingCenterService', 'websiteService', 'trsPrintService', 'editIsLock', 'trsPicturePreviewService', function($scope, $sce, $q, $modal, $timeout, $state, $location, $window, trsHttpService, $stateParams, editcenterRightsService, trsconfirm, initVersionService, editingCenterService, websiteService, trsPrintService, editIsLock, trsPicturePreviewService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化页面参数
     * @return {[type]} [description]null
     */
    function initStatus() {
        $scope.params = {
            "serviceid": "mlf_appmetadata",
            "methodname": "getNewsDoc",
            "ChnlDocId": $stateParams.chnldocid,
        };
        $scope.status = {
            //顶部按钮权限
            btnRightsName: ['app.daibian', 'app.daishen', 'app.yiqianfa', 'appsite.signtime', 'appsite.recyle'],
            //判断从哪块进入
            platform: {
                daibian: 0,
                daishen: 1,
                yiqianfa: 2
            },
            editType: {
                0: "appnews",
                1: "appatlas",
                2: "appsubject",
                3: "appwebsite"
            },
            bitFaceTit: "查看痕迹",
            //初始化按钮
            initBtn: true,
            //通过docType 来判断进入新闻还是图集
            methodname: {
                0: "getNewsDoc",
                1: "getPicsDoc",
                2: "getSpecialDoc",
                3: "getLinkDoc"
            },
            commentset: {
                0: '关闭',
                1: "先审后发",
                2: '先发后审'
            },
            listStyle: {
                0: '图文',
                1: "多图",
                2: '文字'
            },
            displayset: {
                0: '取专题基本信息',
                1: '取新闻列表信息'
            },
            listpicsLen: {
                0: 1,
                1: 3,
                2: 0
            },
            docType: $stateParams.doctype,
        };
        $scope.data = {
            item: [],
            contributor: [],
        };
        //获取查看痕迹按钮权限
        editcenterRightsService.initWebsiteListBtnWithoutChn('appsite.trace', $stateParams.siteid).then(function(data) {
            $scope.status.bigFaceRights = data;
        });
    }
    /**
     * [initListStyle description]初始化列表图，焦点图何题图
     * @return {[type]} [description]
     */
    function initListpics() {
        $scope.data.item.LISTPICS.length = $scope.status.listpicsLen[$scope.data.item.LISTSTYLE];
        $scope.data.item.FOCUSIMAGE.length = $scope.data.item.ISFOCUSIMAGE == 0 ? 1 : 0;
        $scope.data.item.FIGURE.length = $scope.data.item.ISSELECTFIGURE;
    }
    /**
     * [initData description]初始化页面数据
     * @return {[type]} [description]
     */
    function initData() {
        $scope.params.methodname = $scope.status.methodname[$stateParams.doctype];
        requestData();
        if ($stateParams.platform > 2) {
            editcenterRightsService.initAppListBtnWithoutChn($scope.status.btnRightsName[$stateParams.platform], $stateParams.siteid).then(function(rights) {
                $scope.status.btnRights = rights;
            });
        } else {
            editcenterRightsService.initAppListBtn($scope.status.btnRightsName[$stateParams.platform], $stateParams.channelid).then(function(rights) {
                $scope.status.btnRights = rights;
            });
        }
    }
    /**
     * [getContributor description]获取供稿方
     * @param  {[obj]} data [description]稿件具体信息
     * @return {[type]}      [description]
     */
    function getContributor(data) {
        if (angular.isDefined(data.CONTRIBUTORSONE)) {
            $scope.data.contributor.push(data.CONTRIBUTORSONE.name);
            $scope.data.contributor.push(data.CONTRIBUTORSTWO.name);
            $scope.data.contributor.push(data.CONTRIBUTORSTHREE.name);
            $scope.data.item.CONTRIBUTOR = $scope.data.contributor.join(',');
        }
    }
    /**
     * [requestData description]数据请求函数
     * @return {[type]} [description]
     */
    function requestData() {
        var deferred = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.data.item = data;
            getContributor(data);
            initListpics();
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    /**
     * [edit description]跳转到编辑
     * @return {[type]} [description]null
     */
    $scope.edit = function() {
        $state.go($scope.status.editType[$stateParams.doctype], {
            "channelid":$stateParams.channelid,
            "siteid": $stateParams.siteid,
            "chnldocid": $stateParams.chnldocid,
            "metadataid": $stateParams.metadataid,
            "doctype": $scope.status.docType,
            "platform": $stateParams.platform
        }, {
            reload: true
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
     * [preview description]稿件预览
     * @return {[type]} [description]
     */
    $scope.preview = function() {
        editingCenterService.draftPublish($stateParams.chnldocid);
    };
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
            "methodname": $scope.status.methodname[$stateParams.doctype],
            "MetaDataId": $stateParams.metadataid
        };
        $scope.data.printResult = [];
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var result = data;
            data.VERSION = version;
            data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
            $scope.data.printResult.push(result);
            trsPrintService.trsWebPrintDocument($scope.data.printResult, true);
        });
    }
}]);
