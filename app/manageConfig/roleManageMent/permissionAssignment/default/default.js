/*
	create by BaiZhiming 2016-2-23
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignment.default",[])
    .controller("defaultCtrl", ["$scope", "$modal", "trsconfirm", function($scope, $modal, trsconfirm) {
        initData();
        //打开产品列表开始
        $scope.productAndModule = function() {
            var productAndModule = $modal.open({
                templateUrl: "./manageConfig/roleManageMent/permissionAssignment/service/productAndModule/productAndModule_tpl.html",
                scope: $scope,
                windowClass: 'manage-authorityAssignment',
                backdrop: false,
                controller: "productAndModuleCtrl"
            });
        };
        //打开产品列表结束
        //主页面保存为模板为无效方法
        $scope.SavePermissions = function() {
            trsconfirm.alertType("您还未设置过权限", "您还未设置权限", "error", false);
        };
        //主页面保存为模板为无效方法
        //主页面保存为无效方法
        $scope.save = function() {
            trsconfirm.alertType("您还未设置过权限", "您还未设置权限", "error", false);
        };
        //主页面保存为无效方法
        function initData(){
            //左侧拆分模板路径定义开始
            $scope.leftTemplatePath = './manageConfig/roleManageMent/permissionAssignment/default/template/left_tpl.html';
            //左侧拆分模板路径定义结束
        }
    }]);
