/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("importUserModule", [])
    .controller("importUserCtrl", ["$scope", "$timeout", "$validation", "trsHttpService", '$http', '$modalInstance', "userManageMentService", "trsspliceString", "importUserInfo", "trsconfirm", "Upload", function($scope, $timeout, $validation, trsHttpService, $http, $modalInstance, userManageMentService, trsspliceString, importUserInfo, trsconfirm, Upload) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数
         */
        function initStatus() {
            $scope.data = {
                modalTitle: importUserInfo.modalTitle,
                fileName: ""
            };
            $scope.file = {
                name: ""
            };
            $scope.params = {
                "name": ""
            };
        }

        /**
         * [initData description]初始化数据
         */
        function initData() {

        }
        $scope.upload = function(file) {};
        //确定
        $scope.confirm = function() {
            Upload.upload({
                url: '/wcm/openapi/uploadImage',
                data: {
                    file: $scope.file
                }
            }).then(function(resp) {
                var params = {
                    "serviceid": "mlf_usermanagement",
                    "methodname": "importUsers",
                    "ImportUserFile": resp.data.imgName,
                    "GroupId": importUserInfo.GroupId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("导入用户成功", "", "success", false, function() {
                        $modalInstance.close(params);
                    });
                });
            }, function(resp) {});
        };
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

    }]);
