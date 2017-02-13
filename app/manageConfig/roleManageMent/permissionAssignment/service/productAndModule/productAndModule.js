/*
    Create By BaiZhiming 2015-10-19
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignment.productAndModule", []).controller("productAndModuleCtrl", ["$scope", "$rootScope", "$modal", "$http", "$timeout", "$state", "localStorageService", "trsHttpService", "SweetAlert", "trsSelectItemByTreeService", "trsconfirm", "manageConfigPermissionService", function($scope, $rootScope, $modal, $http, $timeout, $state, localStorageService, trsHttpService, SweetAlert, trsSelectItemByTreeService, trsconfirm, manageConfigPermissionService) {
    initStatus();
    initData();
    $scope.selectPMTab = function(module, moduleName) {
        $scope.status.selectedModule = module;
        $scope.status.moduleName = moduleName;
        switch ($scope.status.selectedModule) {
            case 'planningCenter':
                if (!angular.isDefined($scope.data.plCenterMedias)) {
                    getPlanningCenterProduct();
                }
                break;
            case 'editingCenter':
                if (!angular.isDefined($scope.data.medias)) {
                    getEditingCenterProduct();
                }
                break;
            case 'resourceCenter':
                break;
            case 'visualCenter':
                break;
            case 'operationCenter':
                break;
            case 'manageConfig':
                getManageConfigList();
                break;
        }
    };
    //选择模块方法开始
    $scope.chooseModule = function(module) {
        $state.go("manageconfig.rolemanage.permissionassignment." + module.TYPE, "", { reload: "manageconfig.rolemanage.permissionassignment." + module.TYPE });
    };
    //资源中心选择模块开始
    $scope.resChooseModule = function(module) {
        $state.go("manageconfig.rolemanage.permissionassignment." + module.key, "", { reload: "manageconfig.rolemanage.permissionassignment." + module.key });
    };
    //选择模块方法结束
    //采编中心站点选择开始
    $scope.setEditingCenterPermission = function(siteId, siteDesc, mediaType, classify, channelId) {
        localStorageService.set("setEditingCenterPermission", {
            "siteId": siteId,
            "siteDesc": siteDesc,
            "moduleName": $scope.status.moduleName,
            "mediaType": mediaType,
            "CLASSIFY": classify,
            "channelId": channelId
        });
        var url = "manageconfig.rolemanage.permissionassignment." + classify;
        $state.go(url, '', { reload: url });
        $scope.$close();
    };
    //采编中心站点选择结束
    //采编中心IWO站点选择开始
    $scope.setIwoPermission = function(media) {
        if (media.CLASSIFY === "iwo") {
            localStorageService.set("setEditingCenterPermission", media);
            $scope.$emit("switchSite", "");
            //同路径下切换通知开始
            $timeout(function() {
                $state.go("manageconfig.rolemanage.permissionassignment.iwo", '', { reload: "manageconfig.rolemanage.permissionassignment.iwo" });
                $scope.$close();
            }, 500);
            //同路径下切换通知结束
        }
    };
    //采编中心IWO站点选择结束
    $scope.cancel = function() {
        $scope.$close();
    };
    //协同指挥赋权
    $scope.selectPlCenterNode = function(node) {
        $rootScope.plCenterRight = { chooseNode: node, treeData: $scope.data.plCenterMedias };
        $state.go("manageconfig.rolemanage.permissionassignment.plCCommand", "", { reload: "manageconfig.rolemanage.permissionassignment.plCCommand" });
        $scope.$close();
    };
    //特权取稿
    $scope.privilegedAccess = function() {
        trsSelectItemByTreeService.getDeptAndUser($scope.roleData.ROLEID, function(data) {
            data.serviceid = "mlf_extrole";
            data.methodname = "setPrivilegeRange";
            data.RoleId = $scope.roleData.ROLEID;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), data, "get").then(function(data) {
                trsconfirm.alertType("保存成功", "", "success", false, function() {});
            });
        });
    };

    function initStatus() {
        $scope.data = {
            "resourceCenter": [{
                moduleName: '资源中心',
                key: 'resourcecenter'
            }]
        };
        $scope.status = {
            selectedModule: 'planningCenter'
        };
        manageConfigPermissionService.isAdministrator().then(function(data) {
            $scope.status.isSystemUser = data;
        });
    }
    //获取管理配置列表
    function getManageConfigList() {
        var params = {
            serviceid: "mlf_metadataright",
            methodname: "queryTypesOfConfigmodule",
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.manageConfig = data;
        });
    }

    function initData() {
        getPlanningCenterProduct();
    }
    //获取采编中心产品列表开始
    function getEditingCenterProduct() {
        var params = {
            "serviceid": "mlf_extrole",
            "methodname": "queryMediaProductsTree",
            "RoleId": $scope.roleData.ROLEID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.medias = data;
        });
    }
    //获取采编中心产品列表结束
    //获取策划中心产品列表
    function getPlanningCenterProduct() {
        var params = {
            "serviceid": "mlf_extrole",
            "methodname": "queryPlanMediaProduct",
            "RoleId": $scope.roleData.ROLEID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.plCenterMedias = data;
        });
        /*$scope.data.plCenterMedias = [{
            MEDIANAME: "指挥中心"
        }];*/
    }
    //获取资源中心权限列表
    /*function getResouceCenterProduct() {
        var params = {
            serviceid: "mlf_extrole",
            methodname: "queryResourceMediaProduct",
            RoleId: $scope.roleData.ROLEID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.rsCenterMedias = [data];
        });
    }*/
}]);
