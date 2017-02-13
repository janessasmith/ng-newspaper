/**
 * manageCfg.roleManage.createRole Module
 *
 * Description
 */
"use strict";
angular.module('manageCfg.roleManageMent.editorcreateRole', [
        'manageCfg.roleManageMent.editOrCreateRoleRouter',
        'manageCfg.roleManageMent.editorcreateRole.changeGroup'
        /*'manageCfg.roleManageMent.editorcreateRole.copyAuthority'*/ //废弃
    ])
    .controller("createRoleCtrl", ["$scope", '$sce', "$stateParams", "$state", "$timeout", 'trsHttpService', 'trsconfirm', "trsSelectItemByTreeService", "trsspliceString", function($scope, $sce, $stateParams, $state, $timeout, trsHttpService, trsconfirm, trsSelectItemByTreeService, trsspliceString) {
        //console.log($stateParams.type);
        /*if($stateParams.type=="edit"){
            $scope.roleDesc = $scope.roleData.ROLEDESC;
        }else{
            $scope.roleDesc = "";
        }*/
        if ($stateParams.type == "create") {
            $scope.roleData.ROLEDESC = "";
        }
        $scope.$watch("roleForm.rolename.$viewValue", function(newValue, oldValue) {
            if ($scope.roleForm.$invalid && $scope.roleForm.$dirty) {
                $scope.errorMessage = $sce.trustAsHtml("输入长度请控制在2-60位，且不能包含特殊字符");
                $scope.isShow = true;
                return;
            }
            $scope.isShow = false;
        });
        $scope.changeGroup = function(obj) {
            $(obj.target).removeClass("role-btn-commen").addClass("role-btn-selected");
            $(obj.target).siblings().removeClass("role-btn-selected").addClass("role-btn-commen");
            $state.go("manageconfig.rolemanage.editorcreaterole.changegroup");
        };
        $scope.copyAuthority = function(obj) {
            $state.go("manageconfig.rolemanage.editorcreaterole");
            /*$(obj.target).removeClass("role-btn-commen").addClass("role-btn-selected");*/
            $(obj.target).siblings().removeClass("role-btn-selected").addClass("role-btn-commen");
            /*$state.go("manageconfig.rolemanage.editorcreaterole.copyauthority");*/
            trsSelectItemByTreeService.getRole("选择要复制权限的角色", [], function(data) {
                var params = {
                    "serviceid": "mlf_extrole",
                    "methodname": "copyRoleRight",
                    "RoleId": $scope.roleData.ROLEID,
                    "RoleIds": trsspliceString.spliceString(data, "ROLEID", ","),
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(
                    function(data) {
                        trsconfirm.alertType("复制角色权限成功", "复制角色权限成功", "success", false);
                    }
                );
            });
        };
        $scope.saveRole = function() {
            var params = {
                'ServiceId': 'mlf_extrole',
                "methodname": "save",
                'RoleId': $scope.roleData.ROLEID,
                'GroupID': $scope.realGroupObj.GROUPID,
                'RoleName': $scope.roleData.ROLEDESC
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.roleData.ROLENAME = $scope.roleData.ROLEDESC;
                $scope.$emit("saveRole", $scope.roleData);
                trsconfirm.alertType("保存成功","","success",false);
            });
        };
        $scope.$on("changeGroup", function(event, data) {
            $scope.roleData = null;
        });
    }]);
