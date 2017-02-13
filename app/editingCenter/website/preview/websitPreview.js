'use strict';
/**
 * Author:CC
 *
 * Time:2016-02-25
 */
angular.module('websitePreviewModule', []).controller('websitePreviewCtrl', ["$scope", "$sce", "$q", "$modal", "$timeout", "$state", "$location", "$window", "trsHttpService", "$stateParams", 'editcenterRightsService', 'trsconfirm', 'initVersionService', 'editingCenterService', 'websiteService', 'trsPrintService', 'editIsLock', 'trsPicturePreviewService', function($scope, $sce, $q, $modal, $timeout, $state, $location, $window, trsHttpService, $stateParams, editcenterRightsService, trsconfirm, initVersionService, editingCenterService, websiteService, trsPrintService, editIsLock, trsPicturePreviewService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化页面参数
     * @return {[type]} [description]null
     */
    function initStatus() {
        $scope.data = {
            params: {
                "serviceid": "mlf_website",
                "methodname": "getPicsDoc",
                "MetaDataId": $stateParams.metadataid,
                "MetaDataIds": $stateParams.metadataid,
                "ChnlDocIds": $stateParams.chnldocid,
                "ChannelId": $stateParams.channelid
            },
            typeOfAttachmentArr: [],
            editPath: websiteService.getEditandPreviewPath().edit,
            item: [],
            METADATAID:$stateParams.metadataid,
        };
        $scope.status = {
            //顶部按钮权限
            btnRightsName: ['web.daibian', 'web.daishen', 'web.yiqianfa', 'web.signtime', 'web.recyclemgr', 'web.draft'],
            //网站待编，待审
            directSigned: ['webDaiBianPublish', 'webDaiShenPublish'],
            //直接签发，定时签发
            timeingSinged: ['webDaiBianTimingPublish', 'webDaiShenTimingPublish'],
            //判断从哪块进入
            platform: {
                daibian: 0,
                daishen: 1,
                yiqianfa: 2,
                signtime: 3,
                recyclemgr: 4,
                draft: 5
            },
            preview: {
                news: 1,
                atlas: 2,
                subject: 3,
                linkDoc: 4
            },
            //初始化按钮
            initBth: true,
            //通过typeId 来判断进入新闻还是图集
            methodname: {
                1: "getNewsDoc",
                2: "getPicsDoc",
                3: "getSpecialDoc",
                4: "getLinkDoc"
            },
            bitFaceTit: "查看痕迹",
            //是否含有各种类型的媒体
            media: {
                noPic: "0"
            },
            typeOfDraft:$stateParams.typeid
        };
        //误删，链接稿没有创作轴按钮，依靠此判断
        $scope.data.params.methodname = $scope.status.methodname[$stateParams.typeid];
        //获取查看痕迹按钮权限
        editcenterRightsService.getRightsofBigFace($stateParams.siteid, 'website.trace').then(function(data) {
            $scope.status.bigFaceRights = data;
        });
        // $scope.params = {
        //     "serviceid": "mlf_website",
        //     "methodname": "getPicsDoc",
        //     "MetaDataId": $stateParams.metadataid,
        //     "MetaDataIds": $stateParams.metadataid,
        //     "ChnlDocIds": $stateParams.chnldocid,
        //     "ChannelId": $stateParams.channelid
        // };
        // $scope.btnRightsName = ['web.daibian', 'web.daishen', 'web.yiqianfa', 'web.signtime', 'web.recyclemgr', 'web.draft'];
        // $scope.status = {
        //     directSigned: ['webDaiBianPublish', 'webDaiShenPublish'],
        //     timeingSinged: ['webDaiBianTimingPublish', 'webDaiShenTimingPublish'],
        //     platform: {
        //         daibian: 0,
        //         daishen: 1,
        //         yiqianfa: 2,
        //         signtime: 3,
        //         recyclemgr: 4,
        //         draft: 5
        //     }
        // };
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
                //$scope.item.htmlContent = $sce.trustAsHtml(data.HTMLCONTENT);
                $scope.extendItems = data.RELATEDNEWS;
                getAttachFileType(data.ATTACHFILE);
                getAttachFileType(data.SPECIALFILE);
                document.title = data.TITLE;
            });
            if ($stateParams.platform > 2) {
                editcenterRightsService.initWebsiteListBtnWithoutChn($scope.status.btnRightsName[$stateParams.platform], $stateParams.siteid).then(function(rights) {
                    $scope.status.btnRights = rights;
                });
            } else {
                editcenterRightsService.initWebsiteListBtn($scope.status.btnRightsName[$stateParams.platform], $stateParams.channelid).then(function(rights) {
                    $scope.status.btnRights = rights;
                });
            }
        });
    }
    /**
     * [requestData description]数据请求
     * @param  {[obj]} params [description]请求参数
     * @return {[obj]}        [description]请求返回值
     */
    function requestData(params) {
        var deferred = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.item = data;
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    /**
     * [getAttachFileType description]获取附件后缀
     * @param  {[obj]} params [description]请求参数
     * @return {[obj]}        [description]请求返回值
     */
    function getAttachFileType(data) {
        angular.forEach(data, function(value, key) {
            var attachmentType = value.APPFILE.split(".");
            var length = value.APPFILE.split(".").length;
            $scope.data.typeOfAttachmentArr.push(attachmentType[length - 1]);
        });
    }

    /**
     * [webDraftKill description]退稿操作
     * @return {[type]} [description]null
     */
    $scope.webDraftKill = function() {
        trsconfirm.inputModel('是否确认退稿', '退稿原因(可选)', function(content) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "rejectionMetaDatas",
                MetaDataIds: $stateParams.metadataid,
                Title: content,
                ChnlDocIds: $stateParams.chnldocid,
                ChannelId: $stateParams.channelid
            };
            requestData(params).then(function(data) {
                trsconfirm.alertType('退稿成功', '', "success", false, function() {
                    $window.opener.location.reload();
                    $window.close();
                });
            });
        });
    };
    /**
     * [webSignDirect description]稿件直接签发
     * @return {[type]} [description]null
     */
    $scope.webSignDirect = function() {
        var params = {
            "serviceid": "mlf_websiteoper",
            "methodname": $scope.status.directSigned[$stateParams.platform],
            "ObjectIds": $stateParams.chnldocid,
            "MetaDataIds": $stateParams.metadataid,
            "ChnlDocIds": $stateParams.chnldocid,
            "ChannelId": $stateParams.channelid
        };
        trsconfirm.confirmModel('签发', '确认发布稿件', function() {
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(dataC) {
                trsconfirm.alertType("直接签发成功", "", "success", false,
                    function() {
                        $window.opener.location.reload();
                        $window.close();
                    });
            });
        });
    };
    /**
     * [webSignTime description]稿件定时签发
     * @return {[type]} [description]null
     */
    $scope.webSignTime = function() {
        var params = {
            selectedArray: [$scope.item],
            isNewDraft: true,
            methodname: $scope.status.timeingSinged[$stateParams.platform]
        };
        editingCenterService.draftTimeSinged(params).then(function(data) {
            trsconfirm.alertType("定时签发成功", "", "success", false,
                function() {
                    $window.opener.location.reload();
                    $window.close();
                });
        });
    };


    //创作轴
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
     * [preview description]稿件预览
     * @return {[type]} [description]null
     */
    $scope.preview = function() {
        var params = {
            methodname: "preview",
            serviceid: "mlf_metadatacenter",
            ObjectId: $stateParams.chnldocid
        };
        requestData(params).then(function(data) {
            $window.open(data.URLS);
        });
    };
    /**
     * [showVersionTime description]展示流程版本与操作日志
     * @param  {[str]} MetaDataId [description]
     * @return {[type]}            [description]null
     */
    $scope.showVersionTime = function() {
        editingCenterService.getVersionTime($scope.data,false);
    };
    /**
     * [close description]预览页面关闭
     * @return {[type]} [description]null
     */
    $scope.close = function() {
        $window.close();
    };
    /**
     * [webDraftPend description]稿件送审
     * @return {[type]} [description]null
     */
    $scope.webDraftPend = function() {
        trsconfirm.inputModel("送审", "确定送审吗？", function(content) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "trialMetaDatas",
                MetaDataIds: $stateParams.metadataid,
                Title: content,
                ChnlDocIds: $stateParams.chnldocid
            };
            requestData(params).then(function(data) {
                trsconfirm.alertType("稿件送审成功", "", "success", false,
                    function() {
                        $window.opener.location.reload();
                        $window.close();
                    });
            });
        });
    };
    /**
     * [cancelTiming description]稿件取消定时签发
     * @return {[type]} [description]null
     */
    $scope.cancelTiming = function() {
        trsconfirm.confirmModel('撤销定时签发', '确认取消定时签发', function() {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "webRepealTimingPublish",
                ObjectIds: $stateParams.chnldocid,
                ChnlDocIds: $stateParams.chnldocid,
                MetaDataIds: $stateParams.metadataid,
                ScheduleTime: ""
            };
            requestData(params).then(function(data) {
                trsconfirm.alertType("取消定时签发", "", "success", false,
                    function() {
                        $window.opener.location.reload();
                        $window.close();
                    });
            });
        });
    };
    /**
     * [modifTiming description]修改定时签发
     * @return {[type]} [description]null
     */
    $scope.modifTiming = function() {
        var params = {
            selectedArray: [$scope.item],
            isNewDraft: true,
            methodname: "webChangeTimingPublish"
        };
        editingCenterService.draftTimeSinged(params).then(function(data) {
            trsconfirm.alertType("修改定时签发成功", "", "success", false,
                function() {
                    $window.opener.location.reload();
                    $window.close();
                });
        });
    };
    //存在问题（频道ID）
    $scope.restore = function() {
        trsconfirm.confirmModel("还原", "是否确认还原选中的稿件", function() {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "restoreMetaDatas",
                ChnlDocIds: $stateParams.chnldocid,
                SiteId: $stateParams.siteid,
                MetadataIds: $stateParams.metadataid
            };
            requestData(params).then(function() {
                trsconfirm.alertType("稿件还原成功", "", "success", false,
                    function() {
                        $window.opener.location.reload();
                        $window.close();
                    });
            });
        });
    };
    //存在问题（频道ID）
    $scope.delete = function() {
        trsconfirm.confirmModel("删除", "是否确认删除选中的稿件", function() {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "removeMetaDatas",
                ChnlDocIds: $stateParams.chnldocid,
                SiteId: $stateParams.siteid,
                MetadataIds: $stateParams.metadataid
            };
            requestData(params).then(function() {
                trsconfirm.alertType("稿件删除成功", "", "success", false,
                    function() {
                        $window.opener.location.reload();
                        $window.close();
                    });
            });
        });
    };


    //编辑
    $scope.edit = function() {
        editIsLock.isLock($scope.item).then(function(data) {
            var editPath = $scope.data.editPath[$scope.item.DOCTYPEID];
            var editParams = {
                channelid: $stateParams.channelid,
                chnldocid: $stateParams.chnldocid,
                metadataid: $stateParams.metadataid,
                siteid: $stateParams.siteid,
                status: $stateParams.platform,
            };
            var editUrl = $state.href(editPath, editParams);
            if (data.ISLOCK == "false") {
                $window.open(editUrl);
            } else {
                trsconfirm.alertType("稿件已经被【" + data.LOCKUSER + "】锁定,是否强制解锁", "", "warning", true, function() {
                    editIsLock.forceDeblocking($scope.item).then(function(data) {
                        $window.open(editUrl);
                    });
                }, function() {});
            }
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
            "methodname": $scope.status.methodname[$stateParams.typeid],
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
     * [toExtendPreview description：扩展阅读页面跳转]
     */
    $scope.toExtendPreview = function(item) {

    };

    /**
     * [picPreview description：导读图片预览]
     */
    $scope.picPreview = function(outlinePic) {
        trsPicturePreviewService.trsPicturePreview(outlinePic);
    };
}]);
