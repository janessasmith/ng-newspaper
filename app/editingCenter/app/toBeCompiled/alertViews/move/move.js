/*
    author:XCL
    time:2015-11-11
*/
"use strict";
angular.module('editingCenterCompiledMoveModule', []).
controller('editingCenterCompiledMoveCtrl', ['$scope', '$location', '$stateParams', '$modalInstance', 'trsHttpService', 'trsspliceString', 'SweetAlert', '$timeout', 'selectedChnlId', function($scope, $location, $stateParams, $modalInstance, trsHttpService, trsspliceString, SweetAlert, $timeout, selectedChnlId) {
    initStatus();
    initData();
    //自定义请求数据
    function requestData(callback) {
        trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, "get").then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $timeout(function() {
                    $scope.$parent.items = data.DATA;
                    $scope.$parent.page = data.PAGER;
                });
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE = $scope.page.PAGESIZE.toString() : $scope.page = {
                    "PAGESIZE": 0,
                    "ITEMCOUNT": 0
                };
            }
        }, function(data) {
            SweetAlert.swal({
                title: '数据请求错误',
                text: data,
                type: "error",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        });
    }

    $scope.chooseChannel = function(item) {
        $scope.params.ToChannelId = item.CHANNELID;
    };

    function initStatus() {
        $scope.selectedChnlId = selectedChnlId;
        //组织树配置文件
        $scope.treeOptions = {
            nodeChildren: "CHILDREN",
            dirSelectable: true,
            allowDeselect: false,
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
        $scope.items = "";
    }

    function initData() {
        $scope.params = {
            serviceid: "mlf_mediasite",
            methodname: "queryClassifyBySite",
            SiteId: $stateParams.siteid,
            ChannelId: $stateParams.channelid
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
            $scope.treedata = data.CHILDREN;
        }, function(data) {});

    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function() {
        $modalInstance.close($scope.params.ToChannelId);
    };
}]);
