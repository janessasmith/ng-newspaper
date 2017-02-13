/*Create by BaiZhiming 2015-12-08*/
"use strict";
angular.module("editFlowModule", [])
    .controller("editFlowCtrl", ["$scope", "$modalInstance", "trsHttpService", "trsResponseHandle", "trsconfirm", function($scope, $modalInstance, trsHttpService, trsResponseHandle, trsconfirm) {
        init();
        $scope.confirm = function() {
            $scope.chooseEditor = [];
            angular.forEach(angular.copy($scope.editors), function(data, index, array) {
                if (data.selected) {
                    delete data.selected;
                    delete data.GROUPPATH;
                    $scope.chooseEditor.push(data);
                }
            });
            $modalInstance.close($scope.chooseEditor);
        };
        $scope.cancel = function() {
            $scope.$close();
        };

        function init() {
            //获取编辑流列表开始
            var paramEditorFlow = {
                "serviceid": "mlf_appfgd",
                "methodname": "queryEditFlowGroupPath",
                "MetaViewDataId": $scope.metaDataId
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", paramEditorFlow, "get").then(function(data) {
                $scope.editors = trsResponseHandle.responseHandle(data);
                contrast($scope.editorJson, $scope.editors, "ID");
            }, function(data) {
                trsconfirm.alertType("获取编辑流失败", "获取编辑流失败", "error", false, function() {});
            });
            contrast($scope.editorJson, $scope.editors, "ID");
            //获取编辑流列表结束
        }
        //对比是否重复开始
        function contrast(array1, array2, attribute) {
            angular.forEach(array1, function(data, index, array) {
                angular.forEach(array2, function(_data, _index, _array) {
                    if (data[attribute] === _data[attribute]) {
                        array2[_index].selected = true;
                    }
                });
            });
        }
        //对比是否重复结束
    }]);
