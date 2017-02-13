"use strict";
angular.module("draftImportModule", [])
    .controller("draftImportCtrl", ["$scope", "$modalInstance", "Upload", "trsHttpService", "trsconfirm", "params", function($scope, $modalInstance, Upload, trsHttpService, trsconfirm, params) {
        initStatus();
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            if (angular.isUndefined($scope.file) || $scope.file === null) {
                trsconfirm.alertType("请先上传文件", "", "warning", false);
                return;
            }
            $scope.loadingPromise = Upload.upload({
                url: '/wcm/openapi/uploadFile',
                data: {
                    file: $scope.file
                }
            }).then(function(resp) {
                if(resp.data.error){
                    trsconfirm.alertType(resp.data.error, "", "error", false);
                    return;
                }
                var params = {
                    "serviceid": $scope.status.params.serviceid,
                    "methodname": $scope.status.params.methodname,
                    "FileName": resp.data.imgName
                };
                if ($scope.status.params.channelid !== "") {
                    params.ChannelId = $scope.status.params.channelid;
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("导入稿件成功", "", "success", false, function() {
                        $modalInstance.close(params);
                    });
                });
            });
        };

        function initStatus() {
            $scope.status = {
                params: params
            };
        }

        function initData() {}
    }]);
