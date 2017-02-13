'use strict';
angular.module('manageCfg.roleManageMent.permissionAssignment.SavePerModule', []).
controller('SavePerModuleController', ["$scope", "$sce","$timeout", "trsHttpService", "SweetAlert", function($scope, $sce,$timeout,trsHttpService, SweetAlert) {
    $scope.cancel = function() {
        $scope.$close();
    };
    $scope.$watch("tempForm.temp.$viewValue", function(newValue, oldValue) {
        $timeout(function() {
            if ($scope.tempForm.$invalid && $scope.tempForm.$dirty) {
                $scope.errorMessage = $sce.trustAsHtml("输入长度请控制在2-60位，且不能包含特殊字符");
                $scope.isShow = true;
                return;
            }
            $scope.isShow = false;
        }, 0);

    });
    $scope.savePer = function() {
        if ($scope.tempForm.$invalid) {
            $scope.errorMessage = $sce.trustAsHtml("输入长度请控制在2-60位，且不能包含特殊字符");
            return;
        }
        if ($scope.authorSelectedNode === undefined) {
            SweetAlert.swal({
                title: "保存失败",
                text: "您未设置权限",
                type: "warning",
                closeOnConfirm: true,
                cancelButtonText: "确定",
            });
            return;
        }
        var TemplateDefIds = "";
        angular.forEach($scope.authorSelectedNode.RIGHTVALUE, function(data, index, array) {
            TemplateDefIds += data;
        });
        var savePer = {
            "serviceid": "mlf_righttemplate",
            "methodname": "save",
            "ObjectId": 0,
            "NEWVALUE": TemplateDefIds,
            "RIGHTTEMPLATENAME": $scope.templateName
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", savePer, "post").then(function(data) {
            if (data.status == -1) {
                SweetAlert.swal({
                    title: "保存失败",
                    text: data.message,
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "确定",
                });
                return;
            }
            SweetAlert.swal({
                title: "提示信息",
                text: "保存成功",
                type: "info",
                closeOnConfirm: true,
                cancelButtonText: "确定",
            });
            $scope.$emit("savaPerSuccess", true);
            $scope.$close();
        });

    };
}]);
