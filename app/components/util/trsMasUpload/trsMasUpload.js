"use strict";
/**
 * created by cc 2016-11-1
 * 音视频上传指令
 */
angular.module('trsMasUploadDirective', [])
    .directive('trsMasUpload', ['$timeout', 'trsHttpService', function($timeout, trsHttpService) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                diruploadSrc: "=",
                diruploadName: "=",
                callBack: "=",
                extensions: '=',
                mimeTypes: '=',
                multiple: '=',
            },

            templateUrl: './components/util/trsMasUpload/trsMasUpload_tpl.html',
            controller: function($scope, $element) {},
            link: function(scope, element, attr) {
                var accept = {
                    title: "masUpload",
                    // extensions: 'mp3,mp4,flv,rmvb,avi',
                    // mimeTypes: 'audio/mp3,video/mp4,video/flv,video/rmvb,video/avi'
                    extensions: scope.extensions,
                    mimeTypes: scope.mimeTypes
                };
                var server = attr.src;
                var uploader = WebUploader.create({
                    // 选完文件后，是否自动上传
                    auto: false,
                    // swf文件路径
                    // swf: BASE_URL + '/js/Uploader.swf',
                    swf: './webuploader/util/Uploader.swf',
                    server: trsHttpService.getMasUploadUrl(),
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    threads: 10,
                    pick: {
                        id: element[0],
                        label: attr.innerName,
                        multiple: scope.multiple
                    },
                    // 只允许选择图片文件。
                    method: 'POST',
                    compress: false,
                    //接收文件的类型
                    accept: accept,
                    duplicate: true,
                    fileVal: 'uf',
                    formData: {
                        enctype: 'multipart/form-data'
                    },
                });
                var tempFilesQueued = [];
                uploader.on('filesQueued', function(file) {
                    scope.callBack.file(file, uploader);
                });
                uploader.on('uploadSuccess', function(file, src) {
                    scope.callBack.success(file, src);
                });
                uploader.on('uploadError', function(file) {
                    scope.callBack.error(file);
                });
                uploader.on('uploadProgress', function(file, percentage) {
                    scope.callBack.tar(file, percentage);
                });
                uploader.on('uploadComplete', function(file) {
                    scope.callBack.comp(file);
                });
            }
        };
    }]);
