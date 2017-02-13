'use strict';
angular.module('videoModule', [
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.buffering",
        "com.2fdevs.videogular.plugins.overlayplay"
    ])
    .controller('videoCtrl', function($scope, $sce, $stateParams, $q, $timeout, $window, trsHttpService, resCtrModalService, trsconfirm) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_videoFromMas",
                "methodname": "getVideoFromMas",
                "MetaDataId": $stateParams.metadataid
            };
            $scope.status = {
                selectedItem: ""
            };
            $scope.data = {
                //音视频临时数组
                mediaArray: [],
            };

        }

        function initData() {
            requestData().then(function(data) {
                /**
                 * [config description] 视频相关配置
                 * @type {Object}
                 */
                $scope.config = {
                    preload: "none",
                    sources: [{
                        src: $sce.trustAsResourceUrl(data),
                        type: "video/mp4"
                    }],
                    tracks: [{
                        src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }],
                    theme: {
                        url: "./lib/videogular-themes-default/videogular.css"
                    },
                    plugins: {
                        controls: {
                            //是否自动隐藏播放器操作按钮(默认为false)
                            autoHide: true,
                            autoHideTime: 5000
                        },
                    }
                };
            });

            initQqjccInfos();
        }

        function requestData() {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.mediaDetail = data;
                $scope.thumbs = data.VIDEO;
                deferred.resolve(data.VIDEO[0].ANDROIDAPPPLAYURL);
            });
            return deferred.promise;
        }

        /**
         * [initQqjccInfos description] 初始化取签见撤重
         * @return {[type]} [description]
         */
        function initQqjccInfos() {
            var params = {
                "serviceid": "mlf_releasesource",
                "methodname": "queryOpers",
                "MetaDataId": $stateParams.metadataid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.qqjccInfos = data;
            });
        }

        /**
         * [selectThumb description] 选择缩略图
         * @return {[type]} [description]
         */
        $scope.selectThumb = function() {
            $scope.config = {
                preload: "none",
                sources: [{
                    src: $sce.trustAsResourceUrl($scope.activeItem.ANDROIDAPPPLAYURL),
                    type: "video/mp4"
                }],
                tracks: [{
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }],
                theme: {
                    url: "./lib/videogular-themes-default/videogular.css"
                },
                plugins: {
                    controls: {
                        //是否自动隐藏播放器操作按钮(默认为false)
                        autoHide: true,
                        autoHideTime: 5000
                    },
                }
            };
        };

        /**
         * [openTakeDraftModal description] 取稿
         * @return {[type]} [description]
         */
        $scope.openTakeDraftModal = function() {
            var params = {
                serviceid: "mlf_releasesource",
                methodname: "fetch",
                MetaDataIds: $stateParams.metadataid
            };
            var modalInstance = resCtrModalService.fullTakeDraft(params, true);
            modalInstance.result.then(function() {
                $window.close();
            });
        };

        /**
         * [collect description] 收藏
         * @return {[type]} [description]
         */
        $scope.collect = function() {
            var params = {
                "serviceid": "mlf_myrelease",
                "methodname": "collect",
                "MetaDataIds": $stateParams.metadataid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("收藏成功!", "", "success", false, "");
            });
        };

        /**
         * [close description] 关闭
         * @return {[type]} [description]
         */
        $scope.close = function() {
            $window.close();
        };

    });
