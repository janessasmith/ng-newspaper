/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("resetPwdModule", [])
    .controller("resetPwdCtrl", ["$scope", "$stateParams", "$validation", "trsHttpService", '$modalInstance', "userManageMentService", "trsspliceString", "resetPwdInfo", "trsconfirm",
        function($scope, $stateParams, $validation, trsHttpService, $modalInstance, userManageMentService, trsspliceString, resetPwdInfo, trsconfirm) {
            initStatus();
            initData();
            /**
             * [initStatus description]初始化参数
             */
            function initStatus() {
                $scope.status = {
                    pwdName: "输入新密码：",
                    passwordEqual: true,
                    resetTypeVal: 0, //初始化默认选中重置为系统默认密码
                };
                $scope.data = {
                    modalTitle: resetPwdInfo.modalTitle,
                    PASSWORD: "",
                    confirmPwd: "",
                    parentGroupid: $stateParams.groupid ? $stateParams.groupid : null,
                    currStatus: $stateParams.status ? $stateParams.status : null
                };
            }

            /**
             * [initData description]初始化数据
             */
            function initData() {

            }
            $scope.resetTypeVal = function(val) {
                $scope.status.resetTypeVal = val;
            };
            //确定
            $scope.confirm = function() {
                $validation.validate($scope.resetPwdSubmitForm).success(function() {
                    var params = {
                        "serviceid": "mlf_usermanagement",
                        /*"methodname": "resetMrPassword",*/
                        "UserIds": resetPwdInfo.UserIds
                    };
                    if ($scope.data.PASSWORD === $scope.data.confirmPwd) {
                        if ($scope.status.resetTypeVal == 0) { //重置为系统默认密码        
                            if ($scope.data.parentGroupid != null) { //组织下重置系统密码
                                params.methodname = "resetGroupMrPassword";
                                params.GroupId = $scope.data.parentGroupid;
                            } else if ($scope.data.currStatus != null) { //已开通批量设置为系统密码
                                params.methodname = "clearcResetMrPassword";
                            } else { //未分配批量设置为系统密码
                                params.methodname = "noAssignedResetMrPassword";
                            }
                        } else { //手动输入新密码
                            params.NewPassWord = $scope.data.PASSWORD;
                            //组织下重置密码
                            if ($scope.data.parentGroupid != null) {
                                params.methodname = "resetGroupUserPassword";
                                params.GroupId = $scope.data.parentGroupid;
                            } else if ($scope.data.currStatus != null) { //已开通批量重置新密码
                                params.methodname = "clearcResetPassword";
                            } else { //未分配批量重置新密码
                                params.methodname = "noAssignedResetPassword";
                            }
                        }
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            trsconfirm.alertType("密码重置成功", "", "success", false, function() {
                                $modalInstance.close();
                            });
                        });
                    } else {
                        $scope.status.passwordEqual = false;
                    }

                });
            };
            //取消
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
            $scope.checkPwd = function() {
                if ($scope.data.PASSWORD != "" && $scope.data.confirmPwd != "") {
                    $scope.status.passwordEqual = $scope.data.PASSWORD === $scope.data.confirmPwd ? true : false;
                }
            };

        }
    ]);
