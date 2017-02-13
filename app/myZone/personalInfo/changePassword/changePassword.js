/**
 * Created by 马荣钦 on 2016/1/21.
 */
angular.module("myZonePerInfoChangePwdModule",[])
    .controller("myZonePerInfoChangePwdCtrl",["$scope","$validation","trsHttpService","trsconfirm",function($scope,$validation,trsHttpService,trsconfirm){
        initStatus();
        initData();
        function initData(){
            requestData()
        }
        function initStatus(){
            $scope.params = {
                serviceid: "mlf_extuser",
                methodname: "getCurrUserInfo"
            }
        }
        function requestData(){
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.info = data;
            });
        }
        $scope.savePwd = function(){
            $validation.validate($scope.changePwdForm).success(function() {
                var params = {
                    serviceid: "mlf_extuser",
                    methodname: "resetPassword",
                    "UserName":$scope.info.USERNAME,
                    "OldPassword":$scope.oldPwd,
                    "NewPassword":$scope.newPwd,
                    "NewPasswordTwo":$scope.newPwdTwo
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("密码修改成功", "", "success", false);
                });
            });
        }
    }]);