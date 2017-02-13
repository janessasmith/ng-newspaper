/**
 * created by cc 批量图上传
 * 2016-3-30
 */
'use strict';
angular.module('atlasMultiImagesUploaderModule', []).
controller('multiImgsUpladerCtrl', multiImgsUpladerCtrl);
multiImgsUpladerCtrl.$injector = ["$scope", "$timeout", "$modalInstance", "$q", "$modal"];

function multiImgsUpladerCtrl($scope, $timeout, $modalInstance, $q, $modal) {
    initStatus();
    initData();

    function initStatus() {
        $scope.status = {
            lockBtn: false,
        };
        $scope.data = {
            uploadImgs: [],
            uploadedSrcs: [],
            progress: {}
        };
    }
    /**
     
     * @return {[type]} [description]
     */
    function initData() {
        $scope.callBack = {
            success: function(file, src, uploader) {
                getuploaderData(src, file).then(function(data) {
                    if (data.length === $scope.data.uploadImgs.length) {
                        data.sort(function(x, y) {
                            return x.APPSORT > y.APPSORT ? 1 : -1;
                        });
                        angular.forEach(data, function(value, key) {
                            delete value.APPSORT;
                        });
                        $modalInstance.close(data);
                    }
                });
            },
            error: function(file) {
                $modalInstance.dismiss();
            },
            file: function(file, uploader) {
                angular.forEach(file, function(value, key) {
                    uploader.makeThumb(value, function(error, src) {
                        $timeout(function() {
                            $scope.data.uploadImgs.push({
                                src: src,
                                id: value.id
                            });
                        }, 200);
                    });
                });

                $scope.finish = function() {
                    $scope.status.lockBtn = true;
                    uploader.upload();
                };
            },
            tar: function(file, percentage) {

                var per = Math.ceil(percentage * 100) + "%";
                $timeout(function() {
                    $scope.data.progress[file.id] = per;
                });
            },
            comp: function(file) {

            }
        };
    }
    /**
     * [getuploaderData description]获得图片上传后的路径和文件名
     * @param  {[ob]} src  [description]图片上传后的地址
     * @param  {[obj]} file [description]图片队列
     * @return {[type]}      [description]
     */
    function getuploaderData(src, file) {
        var deferred = $q.defer();
        $scope.data.uploadedSrcs.push({
            'PERPICURL': src.imgSrc,
            'APPFILE': src.imgName,
            'APPDESC': file.name.replace(/\.\w+$/, ''),
            'APPSORT': file.id.substr(file.id.length - 1, 1)
        });
        deferred.resolve($scope.data.uploadedSrcs);
        return deferred.promise;
    }
    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
}
