"use strict";
/*
    createBy CC 2016-8-16
 */
angular.module('replyLiveMoudle', ["mgcrea.ngStrap.timepicker", "mgcrea.ngStrap.datepicker"]).controller('replyLiveController', ['$scope', '$state', '$q', '$modal', '$modalInstance', '$validation', '$filter', '$stateParams', '$timeout', '$sce', 'trsHttpService', 'globleParamsSet', 'incomeData', 'Upload', 'trsconfirm', 'trsspliceString', 'uploadAudioVideoService', function($scope, $state, $q, $moadl, $modalInstance, $validation, $filter, $stateParams, $timeout, $sce, trsHttpService, globleParamsSet, incomeData, Upload, trsconfirm, trsspliceString, uploadAudioVideoService) {
    initStatus();
    initData();

    function initStatus() {
        $scope.data = {
            hosters: [],
            item: incomeData.item,
            isCreate: incomeData.isCreate,
            imgList: [],
            index: 0,
            isUploadingVideo: false, //isUploadingVideo表示音视频是否正在上传,正在上传时展现lodaing图可以编辑但是不能保存
        };
        $scope.reply = {
            INSERTTIME: new Date(),
            CONTENT: "",
            COMPEREID: "",
            PICNAME: "",
            VIDEOURL: "",
            MUSICURL: "",
            ISSHOW: 1,
        };
        $scope.status = {
            promptInfo:{
                video:"视频",
                audio:"音频"
            },
            videoInfoTitle: {
                "maxSize": "视频文件过大",
                "pattern": "请上传视频文件"
            },
            videoInfoContent: {
                "maxSize": "请不要上传超过",
                "pattern": "支持上传的文件格式为："
            }
        };
        $scope.reply.ZHUTIID = angular.isDefined($stateParams.zhutiid) ? $stateParams.zhutiid : $scope.data.item.XWCMLIVESHOWZHUTIID;
    }

    function initData() {
        getHosters().then(function() {
            if (incomeData.isCreate === false) {
                initEditData();
            }
        });
    }
    /**
     * [initEditData description]回复编辑操作，包括已上传的图片与音视频的处理
     * @return {[type]} [description]
     */
    function initEditData() {
        var params = {
            serviceid: "mlf_liveshowreply",
            methodname: "getLiveShowReply",
            XWCMLiveShowReplyId: $scope.data.item.XWCMLIVESHOWREPLYID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.reply = data;
            $scope.data.videoOrAudio = $scope.reply.VIDEOURL === "" ? 'audio' : "video"; //区分已上传的是音频还是视频
            if ($scope.reply.VIDEOURL !== '' || $scope.reply.MUSICURL !== '') {
                $scope.data.videoFile = "file"; //data.videoFile表示选择还未上传的文件对象，用于展现图片、音视频的预览地址,还是要根据videoFile区分添加和预览
            }
            $scope.data.selectedHoster = { name: $scope.reply.COMPERENAME, value: $scope.reply.COMPEREID };
            if (angular.isDefined($scope.reply.PICNAME)) {
                getImgList();
            } else {
                $scope.reply.PICNAME = "";
            }
            deleteField();
        });
    }
    /**
     * [deleteField description]编辑再保存时删除多余字段
     * @return {[type]} [description]
     */
    function deleteField() {
        $scope.reply.CRUSER = null;
        $scope.reply.HTMLCONTENT = null;
        $scope.reply.SORT = null;
        $scope.reply.COMPERENAME = null;
        $scope.reply.PICURL = null;
    }
    /**
     * [getImgList description]获得已上传的图片列表
     * @return {[type]} [description]
     */
    function getImgList() {
        $scope.reply.PICNAME = $scope.reply.PICNAME.split(',');
        $scope.reply.PICURL = $scope.reply.PICURL.split(',');
        angular.forEach($scope.reply.PICNAME, function(data, index) {
            $scope.data.imgList.push({ imgName: data, imgSrc: $scope.reply.PICURL[index], loading: false });
            $scope.data.index++;
        });
    }
    $scope.close = function() {
        $modalInstance.dismiss();
    };

    $scope.confirm = function() {
        $validation.validate($scope.replyForm).success(function() {
            $scope.reply.serviceid = "mlf_liveshowreply";
            $scope.reply.methodname = "saveLiveShowReply";
            $scope.reply.INSERTTIME = $filter('date')($scope.reply.INSERTTIME, "yyyy-MM-dd HH:mm:ss").toString();
            if ($scope.data.imgList.length > 0) {
                $scope.reply.PICNAME = trsspliceString.spliceString($scope.data.imgList, 'imgName', ',');
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.reply, "GET").then(function() {
                trsconfirm.alertType('新建回复成功', "", "success");
                $modalInstance.close();
            });
        }).error(function() {
            trsconfirm.alertType('提交回复失败', "请检查填写项", "error");
        });
    };
    /**
     * [chooseImg description]选择图片上传
     * @param  {[obj]} file  [description]当前文件对象
     * @param  {[array]} files [description]选择的文件集合
     * @return {[type]}       [description]
     */
    $scope.chooseImg = function(file, files) {
        if (files) { //处理二次选择文件时执行方法的错误
            for (var i = 0; i < files.length; i++) {
                if (files[i].$error) {
                    trsconfirm.alertType("请选择图片文件", "", "warning", false);
                    continue;
                } else {
                    $scope.data.imgList.push({ imgName: "", imgSrc: "", loading: true });
                    Upload.upload({
                        url: '/wcm/openapi/uploadImage',
                        data: {
                            file: files[i],
                        }
                    }).then(function(resp) {
                        if (resp.data.imgSrc) {
                            $scope.data.imgList[$scope.data.index].imgName = resp.data.imgName;
                            $scope.data.imgList[$scope.data.index].imgSrc = resp.data.imgSrc;
                            $scope.data.imgList[$scope.data.index].loading = false;
                            $scope.data.index++;
                        } else {
                            trsconfirm.alertType("图片上传失败", resp.data.error, "warning", false);
                        }
                    }, function(resp) {
                        trsconfirm.alertType("图片上传失败", "", "warning", false);
                    }, function(evt) {});
                }
            }
        }
    };
    /**
     * [chooseVideo description]选择视频
     * @param  {[obj]} file  [description]当前文件对象
     * @param  {[array]} files [description]文件集合
     * @return {[type]}       [description]
     */
    $scope.chooseVideo = function(file, files) {
        if (files) {
            if (angular.isUndefined(files[0].$error)) {
                $scope.data.videoOrAudio = files[0].type.split('/')[0]; //使用vidoeOrAudio区分选择的文件时音频还是视频
            } else {
                trsconfirm.alertType($scope.status.videoInfoTitle[files[0].$error], $scope.status.videoInfoContent[files[0].$error] + files[0].$errorParam, "warning", false);
            }
        }
    };
    /**
     * [deleteVideo description]删除视频
     * @return {[type]} [description]
     */
    $scope.deleteVideo = function() {
        delete $scope.data.videoFile;
        $scope.reply.VIDEOURL = "";
        $scope.reply.MUSICURL = "";
        $scope.reply.MASID = null;
    };
    /**
     * [uploadVideo description]上传视频
     * @return {[type]} [description]
     */
    $scope.uploadVideo = function() {
        $scope.loadingPromise = uploadAudioVideoService.uploadVoiceOrVideo([$scope.data.videoFile])
            .then(function(data) {
                getPlayerUrl(data);
            });
    };
    /**
     * [getPlayerUrl description]获得音视频的播放地址
     * @param  {[ojb]} item [description]mas返回的信息
     * @return {[type]}      [description]
     */
    function getPlayerUrl(item) {
        $scope.data.isUploadingVideo = true;
        $scope.reply.MASID = item[0].masId;
        uploadAudioVideoService.getPlayerById(item[0].masId).then(function(data) {
            if (angular.isDefined(data.err)) {
                $timeout(function() {
                    getPlayerUrl(item);
                }, 10000);
            } else {
                $scope.data.isUploadingVideo = false;
                if ($scope.data.videoOrAudio == 'video') {
                    $scope.reply.VIDEOURL = $sce.getTrustedResourceUrl(data.streamsMap.l.httpURL);
                } else {
                    $scope.reply.MUSICURL = $sce.getTrustedResourceUrl(data.streamsMap.l.httpURL);
                }
            }
        });
    }
    /**
     * [deleteImg description]删除回复图片列表
     * @param  {[obj]} img [description]要删除的图片对象
     * @return {[type]}     [description]
     */
    $scope.deleteImg = function(img) {
        $scope.data.imgList.splice($scope.data.imgList.indexOf(img), 1);
        $scope.data.index--;
    };
    /**
     * [selectHoster description]选择主持人
     * @return {[type]} [description]
     */
    $scope.selectHoster = function() {
        $scope.reply.COMPEREID = $scope.data.selectedHoster.value;
    };
    /**
     * [getHosters description]获得主持人
     * @return {[type]} [description]
     */
    function getHosters() {
        var deffered = $q.defer();
        var params = {
            serviceid: "mlf_liveshowcompere",
            methodname: "queryLiveShowComperes",
            CurrPage: 1,
            PageSize: 50
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            if (data.DATA.length > 0) {
                angular.forEach(data.DATA, function(data, index) {
                    $scope.data.hosters.push({ name: data.COMPERENAME, value: data.XWCMLIVESHOWCOMPEREID });
                    $scope.data.selectedHoster = angular.copy($scope.data.hosters[0]);
                    $scope.reply.COMPEREID = $scope.data.selectedHoster.value;
                });
            }
            return deffered.resolve();
        });
        return deffered.promise;
    }
}]);
