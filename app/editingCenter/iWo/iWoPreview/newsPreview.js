'use strict';
/**
 *  Module  Iwo 新闻详情页
 *
 * Description
 */
angular.module('iWoPreviewModule', []).controller('iWoPreviewCtrl', ['$scope', '$stateParams', '$modal', '$q', '$sce', '$window', '$state', 'trsHttpService', 'editcenterRightsService', 'myManuscriptService', 'trsconfirm', 'initVersionService', 'editingCenterService', 'iWoService', 'storageListenerService', 'trsPrintService', function($scope, $stateParams, $modal, $q, $sce, $window, $state, trsHttpService, editcenterRightsService, myManuscriptService, trsconfirm, initVersionService, editingCenterService, iWoService, storageListenerService, trsPrintService) {
    initStatus();
    initData();
    //初始化状态
    function initStatus() {
        $scope.params = {
            "serviceid": "mlf_myrelease",
            "methodname": "getNewsDoc",
            "MetaDataId": $stateParams.metadataid
        };
        $scope.status = {
            btnRights: {},
            preview: {
                1: "iWoNewsPreview",
                2: "iWoAtlasPreview"
            },
            methodname: {
                1: "getNewsDoc",
                2: "getPicsDoc"
            },
            editType: {
                1: "iwonews",
                2: "iwoatlas",
                "iwo.personal": 0,
                "iwo.received": 1
            },
            docType: $stateParams.type,
            bitFaceTit: "查看痕迹",
            initBtn: true,
            chnldocid: $stateParams.chnldocid,
            isCollectDraft: angular.isDefined($stateParams.doccollectrelid)
        };
        $scope.data = {
            item: "",
            copyDarft: "",
            METADATAID: $stateParams.metadataid,
            typeOfAttachmentArr:[]
        };
    }
    /**
     * [initData description]初始化数据,$statparam.type区分稿件类型,1是新闻稿,2是图集稿
     * @return {[type]} [description]
     */
    function initData() {
        storageListenerService.removeListener("iwo");
        $scope.params.methodname = $scope.status.methodname[$stateParams.type];
        if (angular.isDefined($stateParams.doccollectrelid)) {
            $scope.params.methodname = "queryCollectDoc";
            $scope.params.CollectId = $stateParams.doccollectrelid;
        } else {
            copyNewsDarft();
        }
        requestData();
        editcenterRightsService.initIwoListBtn($stateParams.modalname).then(function(data) {
            $scope.status.btnRights = data;
        });
        //获取查看痕迹按钮权限
        editcenterRightsService.initIwoListBtn("iwo.trace").then(function(data) {
            $scope.status.bigFaceRigths = data;
        });
    }
    //查询复制稿件
    function copyNewsDarft() {
        var copyParams = {
            serviceid: "mlf_releasesource",
            methodname: "queryCopyAndBuildDocs",
            MetaDataId: $stateParams.metadataid
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), copyParams, "get").then(function(data) {
            $scope.data.copyDarft = data;
        });
    }

    function requestData() {
        var defered = $q.defer();
        LazyLoad.css('./components/util/ueditor/service/css/ueditorBuiltInStyles.css?v=1.0', function(arg) {
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                console.log(data);
                getAttachFileType(data.ATTACHFILE);
                $scope.data.item = data;
                $scope.data.item.ABSTRACT = angular.isDefined($scope.data.item.ABSTRACT) ? $scope.data.item.ABSTRACT.replace(/\n/g, "<br/>") : "";
                // $scope.data.item.METADATAID = parseInt($stateParams.metadataid);
                $scope.data.htmlContent = $sce.trustAsHtml(data.HTMLCONTENT);
                document.title = data.TITLE;
                $scope.data.selectedArray = [{
                    'TITLE': $scope.data.item.TITLE,
                    'CHNLDOCID': $stateParams.chnldocid,
                    'METADATAID': $stateParams.metadataid
                }];
            });
        });
        return defered.promise;
    }
    /**
     * [edit description]跳转到编辑
     * @return {[type]} [description]null
     */
    $scope.edit = function() {
        $state.go($scope.status.editType[$stateParams.type], {
            "chnldocid": $stateParams.chnldocid,
            "metadataid": $stateParams.metadataid,
            "status": $scope.status.editType[$stateParams.modalname],
        }, {
            reload: true
        });
    };

    //创作轴
    $scope.creationAxis = function() {
        /*var params = {
            serviceid: "mlf_releasesource",
            methodname: "setCreation",
            metadataid: $stateParams.metadataid
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("加入创作轴成功", "", "success", false);
        });*/
        if ($scope.data.item.MLFTYPE !== "1") {
            addToCreationFromWCM($stateParams.metadataid);
        } else {
            addToCreationFromBD($stateParams.metadataid, $scope.data.item.CHANNELNAME, $scope.data.item.INDEXNAME);
        }
    };
    /**
     * [addToCreationFromWCM description] 从WCM加入到创作轴
     * @param {[type]} imgname    [description] 图片路径
     * @param {[type]} imgauthor  [description] 图片作者
     * @param {[type]} content    [description] 正文
     */
    function addToCreationFromWCM(metadataid) {
        var params = {
            serviceid: "mlf_releasesource",
            methodname: "setCreation",
            metadataid: metadataid,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("该稿件已成功添加到创作轴", "", "success", false);
            $window.document.getSelection().collapse($window.document, 1);
            //console.log("加入WCM创作轴成功");
        });
    }
    /**
     * [addToCreationFromBD description]从大数据加入到创作轴
     * @param {[type]} imgname [description]图片路径
     * @param {[type]} content [description]正文
     */
    function addToCreationFromBD(guid, channelName, indexName) {
        var params = {
            typeid: "zyzx",
            serviceid: "mlf_bigdataexchange",
            methodname: "batchcreation",
            guid: guid,
            channelName: channelName,
            indexname: indexName
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("该稿件已成功添加到创作轴", "", "success", false);
            $window.document.getSelection().collapse($window.document, 1);
            //console.log("加入BD创作轴成功");
        });
    }
    //按钮操作开始
    //提交操作
    $scope.submit = function() {
        var methodname = $stateParams.modalname === 'iwo.personal' ? "personalSubmitMedia" : "receivedSubmitMedia";
        myManuscriptService.submit($scope.data.selectedArray, function() {
            storageListenerService.addListenerToIwo("newsSubmit");
            var opened = $window.open('about:blank', '_self');
            opened.close();
        }, function() {

        }, methodname);
    };
    //关闭操作
    $scope.close = function() {
        var opened = $window.open('about:blank', '_self');
        opened.close();
    };
    /**
     * [showVersionTime description:流程版本时间与操作日志]
     */
    $scope.showVersionTime = function() {
        editingCenterService.getVersionTimeWithCopyDraft($scope.data, true);
    };
    //传稿操作
    $scope.draft = function() {
        var methodname = $stateParams.modalname === 'iwo.personal' ? "personalTransferMetaDatas" : "receivedTransferMetaDatas";
        myManuscriptService.draft("传稿", $scope.data.selectedArray, function() {

            storageListenerService.addListenerToIwo("newsPassed");
            var opened = $window.open('about:blank', '_self');
            opened.close();
        }, function() {

        }, methodname);
    };
    //共享操作
    $scope.batchShare = function() {
        var methodname = $stateParams.modalname === 'iwo.personal' ? 'personalMyShare' : "receivedMyShare";
        editingCenterService.share(function(data) {
            data.serviceid = 'mlf_myrelease';
            data.methodname = methodname;
            data.ChnlDocIds = $stateParams.chnldocid;
            data.MetaDataIds = $stateParams.metadataid;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), data, "post")
                .then(function(data) {
                    trsconfirm.alertType("共享成功", "", "success", false, function() {
                        storageListenerService.addListenerToIwo("newsShared");
                        var opened = $window.open('about:blank', '_self');
                        opened.close();
                    });
                });
        });
    };
    //复制建新稿
    $scope.batchCopyBuildDraft = function() {
        iWoService.copyBuildDraft($scope.data.selectedArray, "docrecordCopyBuildDraft", function() {
            trsconfirm.alertType("复制建新稿成功", "", "success", false, function() {
                storageListenerService.addListenerToIwo("newsCopy");
                var opened = $window.open('about:blank', '_self');
                opened.close();
            });
        });
    };
    //调用操作
    $scope.invoke = function() {
        trsconfirm.confirmModel('调用', "是否取" + "<span style='color:red'>" + $scope.data.selectedArray.length + "</span>" + '篇稿件到已收稿库', function() {
            var invokeParams = {
                serviceid: "mlf_myrelease",
                methodname: "specialCallDocs",
                ChnlDocIds: $stateParams.chnldocid,
                MetaDataIds: $stateParams.metadataid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), invokeParams, "get").then(function(data) {
                trsconfirm.alertType("调用成功", "", "success", false, function() {
                    storageListenerService.addListenerToIwo("newsInvoke");
                    var opened = $window.open('about:blank', '_self');
                    opened.close();
                });
            });
        });
    };
    //复制操作
    $scope.copy = function() {
        var copyParams = {
            serviceid: "mlf_myrelease",
            methodname: "copyCollection",
            Ids: $stateParams.doccollectrelid
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), copyParams, "get").then(function(data) {
            trsconfirm.alertType("稿件复制成功", "", "success", false, function() {
                storageListenerService.addListenerToIwo("newsCopyDraft");
                var opened = $window.open('about:blank', '_self');
                opened.close();
            });
        });
    };
    //还原操作
    $scope.restroe = function() {
        var restroeParams = {
            serviceid: "mlf_myrelease",
            methodname: "restoreReleasesByMetaDataId",
            MetaDataId: $stateParams.metadataid
        };
        trsconfirm.confirmModel("稿件还原", "是否从还原稿件", function() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), restroeParams, "get").then(function(data) {
                trsconfirm.alertType("稿件还原成功", "", "success", false, function() {
                    storageListenerService.addListenerToIwo("newsRestore");
                    var opened = $window.open('about:blank', '_self');
                    opened.close();
                });
            });
        });
    };
    //删除操作
    $scope.deleteDraft = function() {
        var deleteParams = {
            serviceid: "mlf_myrelease",
            methodname: "delReleasesByMetaDataId",
            MetaDataId: $stateParams.metadataid
        };
        trsconfirm.confirmModel("稿件删除", "是否从删除稿件", function() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "get").then(function(data) {
                trsconfirm.alertType("稿件删除成功", "", "success", false, function() {
                    storageListenerService.addListenerToIwo("newsDelete");
                    var opened = $window.open('about:blank', '_self');
                    opened.close();
                });
            });
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
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), {
            serviceid: "mlf_metadatalog",
            methodname: "query",
            MetaDataId: item
        }, 'get').then(function(data) {
            deferred.resolve(data.DATA);
        });
        return deferred.promise;
    }
    /**
     * [requestPrintVersion description：打印请求详情]
     */
    function requestPrintData(version) {
        var params = {
            "serviceid": "mlf_myrelease",
            "methodname": $scope.status.methodname[$stateParams.type],
            "MetaDataId": $stateParams.metadataid
        };
        $scope.data.printResult = [];
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var result = data;
            data.VERSION = version;
            data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
            $scope.data.printResult.push(result);
            trsPrintService.trsIwoPrintDocument($scope.data.printResult);
        });
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
     * [downloadAttachfile description] 下载附件
     * @param  {[type]} file [description] 被下载的附件
     * @return {[type]}      [description]
     */
    // $scope.downloadAttachfile = function(file){
    //     window.open(file.SRCPICURL);
    // };

}]);
