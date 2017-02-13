/*
    created by cc 编辑图片
    2016-3-30
 */
'use strict';
angular.module('atlasEditImageModule', []).
controller('editImageCtrl', editImageCtrl);
editImageCtrl.$injector = ["$scope", "$stateParams", "$timeout", "$modalInstance", "uploadImg"];

function editImageCtrl($scope, $stateParams, $timeout, $modalInstance, uploadImg) {
    initStatus();
    initData();

    function initStatus() {
        $scope.status = {
            uploadImg: {
                'src': uploadImg.PERPICURL
            },
            lockBtn: false,
            progress: ""
        };
        $scope.status.tilte = angular.isDefined($stateParams.channelid) ? "更换图片" : "图片编辑";
    }

    function initData() {
        $scope.callBack = {
            success: function(file, src, uploader) {
                var uploadedSrc = {
                    'PERPICURL': src.imgSrc,
                    'APPFILE': src.imgName,
                    'APPDESC': file.name.replace(/\.\w+$/, ''),
                };
                if ($scope.status.progress == '100%') {
                    $modalInstance.close(uploadedSrc);
                }
            },
            error: function(file) {
                $modalInstance.dismiss();
            },
            file: function(file, uploader) {
                uploader.makeThumb(file[0], function(error, src) {
                    $timeout(function() {
                        $scope.status.uploadImg = {
                            'src': src
                        };
                    });
                });
                $scope.finish = function() {
                    $scope.status.lockBtn = true;
                    uploader.upload();
                };
            },
            tar: function(file, percentage) {
                $timeout(function() {
                    $scope.status.progress = Math.ceil(percentage * 100)+"%";
                });
            },
            comp: function(file) {}
        };
    }
    $scope.close = function() {
        $modalInstance.dismiss();
    };
}
