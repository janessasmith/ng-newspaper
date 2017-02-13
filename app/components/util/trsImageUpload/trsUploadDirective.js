"use strict";
/**
 * created by cc 2016-4-13
 * 图集稿，碎片化图片上传指令
 */
angular.module('pieceMgr.imgUpload', [])
    .directive('trsUpload', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                diruploadSrc: "=",
                diruploadName: "=",
                callBack: "="
            },

            templateUrl: './components/util/trsImageUpload/uploaderService.html',
            link: function(scope, element, attr) {
                var accept = {
                    title: "Images",
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
                };
                var server = attr.src;
                var uploader = WebUploader.create({
                    // 选完文件后，是否自动上传
                    auto: false,
                    // swf文件路径
                    // swf: BASE_URL + '/js/Uploader.swf',
                    swf: './webuploader/util/Uploader.swf',
                    server: server,
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    threads: 10,
                    pick: {
                        id: element[0],
                        label: attr.innerName,
                        multiple: true
                    },
                    // 只允许选择图片文件。
                    method: 'POST',
                    compress: false,
                    //接收文件的类型
                    accept: accept,
                    duplicate: true,
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
