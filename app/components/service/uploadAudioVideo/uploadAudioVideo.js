/*
上传音频视频工具
创建人：bai.zhiming
时间：2016-7-13
 */
"use strict";
angular.module("trsUploadAudioVideoModule", [])
    .factory("uploadAudioVideoService", ["$q", "$http", "$sce", "globleParamsSet", "trsHttpService", function($q, $http, $sce, globleParamsSet, trsHttpService) {
        var index = 0;
        /**
         * [uploadAndSubmit description:上传及提交发布]
         * @param  {[File]} file [description] 需要上传的文件
         * @return {[null]}   [description] null
         */
        function uploadAndSubmit(fileArray) {
            var defferUs = $q.defer();
            var appendix = [];
            var maxlength = fileArray.length;
            upload(fileArray[0]).then(function(data) {
                doRecursion(appendix, defferUs, data, maxlength, fileArray);
            });
            return defferUs.promise;
        }
        /**
         * [doRecursion description:递归工具
         */
        function doRecursion(appendix, defferUs, data, maxlength, fileArray) {
            appendix.push(data);
            index++;
            if (index < maxlength) {
                upload(fileArray[index]).then(function(data_) {
                    doRecursion(appendix, defferUs, data_, maxlength, fileArray);
                });
            } else {
                index = 0;
                defferUs.resolve(appendix);
            }
        }
        /**
         * [upload description:上传文件]
         * @param  {[File]} fd [description] 需要上传的文件
         * @return {[null]}   [description] null
         */
        function upload(file) {
            var fd = new FormData();
            fd.append("uf", file);
            var defferU = $q.defer();
            $http({
                method: "post",
                url: trsHttpService.getMasUploadUrl(),
                data: fd,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response) {
                submit(response).then(function(data) {
                    defferU.resolve(data);
                });
                /*appendix.push(response);
                index++;
                if (index < maxlength) {
                    upload($scope.data.appendix[index]);
                } else {
                    deffer.resolve();
                }*/
            }).error(function(response) {

            });
            return defferU.promise;
        }
        /**
         * [submit description:提交发布]
         * @param  {[obj]} response [description] 需要提交发布的音视频
         * @return {[null]}   [description] null
         */
        function submit(response) {
            var defferS = $q.defer();
            var params = {
                token: response.token,
                appKey: trsHttpService.getMasConfig(),
                isLightIntegrate: true,
                title: encodeURI(response.originName)
            };
            trsHttpService.httpServer(trsHttpService.getMasSubmitUrl(), params, "post")
                .then(function(data) {
                    defferS.resolve(data);
                });
            return defferS.promise;
        }
        return {
            /**
             * [uploadVoiceOrVideo description:上传音频或视频]
             * @param  {[File]数组} fileArray [description] File类型的数组,数组里只需一个元素
             * @return {[string]} masid  [description] masid 视频播放ID
             */
            uploadVoiceOrVideo: function(fileArray) {
                var deffer = $q.defer();
                uploadAndSubmit(fileArray)
                    .then(function(data) {
                        deffer.resolve(data);
                    });
                return deffer.promise;
            },
            /**
             * [getPlayerById description:根据masid获取视频播放地址]
             * @param  {[string]} id [description] masid
             * @return {[object]}   [description] 视频播放信息，包括地址
             */
            getPlayerById: function(id) {
                var deffer = $q.defer();
                var params = {
                    json: { masId: id, isLive: "false", player: "HTML5" }
                };
                trsHttpService.httpServer(trsHttpService.getMasPubUrl(), params, "get")
                    .then(function(data) {
                        if (angular.isUndefined(data.err)) {
                            data.streamsMap.l.httpURL = $sce.trustAsResourceUrl(data.streamsMap.l.httpURL);
                        }
                        deffer.resolve(data);
                    });
                return deffer.promise;
            },
            download: function(id) {
                window.open(trsHttpService.getMasDownloadUrl() + "&id=" + id);
            },
            submit: function(response) {
                var defferS = $q.defer();
                var params = {
                    token: response.token,
                    appKey: trsHttpService.getMasConfig(),
                    isLightIntegrate: true,
                    title: encodeURI(response.originName)
                };
                trsHttpService.httpServer(trsHttpService.getMasSubmitUrl(), params, "post")
                    .then(function(data) {
                        defferS.resolve(data);
                    });
                return defferS.promise;
            }
        };
    }]);
