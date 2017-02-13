"use strict";
angular.module('toBeCompiledDraftlistModule', []).
controller('toBeCompiledDraftlistCtrl', toBeCompiledDraftlistCtrl);
toBeCompiledDraftlistCtrl.$inject = ["$scope", "$modalInstance", "trsHttpService", "SweetAlert", "initAddMetaDataService"];

function toBeCompiledDraftlistCtrl($scope, $modalInstance, trsHttpService, SweetAlert, initAddMetaDataService) {
    /*初始化函数*/
    init();

    function init() {
        /*初始化选项*/
        $scope.addType = "0";

        /*导航树配置项*/
        $scope.treeOptions = {
            nodeChildren: "CHILDREN",
            allowDeselect: false,
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            },
            isLeaf: function(node) {
                return node.HASCHILDREN == "false";
            }
        };

        /*初始化导航树，从服务器中取得导航树的内容*/
        var params = {
            "serviceid": "mlf_group",
            "methodname": "queryGroupTreeWithOutRight"
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
            $scope.dataForTheTree = [data];
        }, function(data) {
            SweetAlert.swal({
                title: "错误提示",
                text: "获取数据失败",
                type: "warning",
                closeOnConfirm: true,
                cancelButtonText: "取消"
            });
        });
        // $scope.list = initAddMetaDataService.initAtlas();
        trsHttpService.httpServer("./editingCenter/properties/metadataEnum.json", {}, "get").then(function(data) {
                //初始化
                $scope.data = data;
            },
            function(data) {});
    }

    $scope.showSelected = function(sel) {
        $scope.selectedNode = sel;
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function() {
        $modalInstance.close();
    };
}
