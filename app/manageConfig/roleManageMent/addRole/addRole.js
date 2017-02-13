"use strict";
angular.module("manageCfg.roleManageMent.newRoteModule", []).
controller("addRoleModuleCtrl", addRoleModuleCtrl);
addRoleModuleCtrl.$injector = ['$scope', '$sce', '$timeout', 'trsHttpService', 'SweetAlert', "trsconfirm"];

function addRoleModuleCtrl($scope, $sce, $timeout, trsHttpService, SweetAlert,trsconfirm) {
    /*
    初始化参数
     */
    $scope.groupName = $scope.groupObj.GNAME;
    $scope.passover = false;
    $scope.specialName = false;
    $scope.roleNameLength = false;
    $scope.cancel = function() {
        $scope.$close();
    };
    $scope.confirm = function() {
        var paramsC = {
            'ServiceId': 'mlf_extrole',
            "methodname": "existsRoleName",
            'RoleId': 0,
            'GroupID': $scope.groupObj.GROUPID,
            'RoleName': $scope.roleName
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", paramsC, "post").then(function(data) {
            if (data === "true") {
                trsconfirm.alertType("角色名称重复","存在同名角色","info",false,function(){});
            } else {
                $scope.isShow = false;
                var params = {
                    'ServiceId': 'mlf_extrole',
                    "methodname": "save",
                    'RoleId': 0,
                    'GroupID': $scope.groupObj.GROUPID,
                    'RoleName': $scope.roleName
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                    $scope.$emit("changeGroup", true);
                    trsconfirm.alertType("新增角色成功","","success",false);
                    $scope.$close();
                }, function(data) {});
            }
        }, function(data) {});
    };

}
