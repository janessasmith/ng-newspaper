/*
    create by BaiZhiming 2016-2-23
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignment", [
        "manageCfg.roleManageMent.permissionAssignmentRouter",
        "manageCfg.roleManageMent.permissionAssignment.SavePerModule",
        "manageCfg.roleManageMent.permissionAssignment.productAndModule",
        "manageCfg.roleManageMent.permissionAssignment.default",
        "manageCfg.roleManageMent.permissionAssignment.editingCenter",
        "manageCfg.roleManageMent.permissionAssignment.modulePermission",
        "manageCfg.roleManageMent.permissionAssignment.proRange",
        "manageCfg.roleManageMent.permissionAssignment.orgRange",
        "manageCfg.roleManageMent.permissionAssignment.plCenterCommandModule",
        "manageCfg.roleManageMent.permissionAssignment.usermanage"
    ])
    .controller("permissionAssignmentCtrl", ["$scope", "$modal", "$state", "trsconfirm", function($scope, $modal, $state, trsconfirm) {
        $state.go("manageconfig.rolemanage.permissionassignment.default");
        $scope.$on("roleData", function(event,data) {
            if (data.ROLEID === "1") { //如果是系统管理员角色，不能设置权限
                $state.go("manageconfig.rolemanage");
                return;
            }
        });
    }]);
