/*
    Create By BaiZhiming 2015-10-22
*/
'use strict';
angular.module('manageCfg.roleManageMent.userManageMentaddUser.addUserModal', [])
    .controller("addUserModalCtrl", ['$scope', 'trsHttpService', 'SweetAlert', 'trsconfirm', function($scope, trsHttpService, SweetAlert, trsconfirm) {
        init();
        //点击树方法开始
        $scope.aDshowSelected = function(node) {
            $scope.groupObj = node;
        };
        //点击展开子组
        $scope.showToggle = function(node) {
            if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
                var paramsT = {
                    "serviceid": "mlf_group",
                    "methodname": "queryChildGroupsForGroupUserMgr",
                    "GroupId": node.GROUPID
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                        node.CHILDREN = dataC.CHILDREN;
                    },
                    function(dataC) {
                        SweetAlert.swal({
                            title: "错误提示",
                            text: "获取子组失败",
                            type: "warning",
                            closeOnConfirm: true,
                            cancelButtonText: "取消",
                        });
                    });
            }
        };
        //点击树方法结束
        //获取组织下的未分配角色的用户列表开始
        $scope.$watch("groupObj", function(newValue, oldValue) {
            $scope.groupObj = newValue;
            var paramsWselect = {
                "GroupId": $scope.groupObj.GROUPID,
                "RoleId": $scope.roleData.ROLEID,
                "serviceid": "mlf_extrole",
                "methodname": "queryGroupUsers"
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", paramsWselect, "get").then(function(data) {
                $scope.itemsWselect = data;
            }, function(data) {
                trsconfirm.alertType("获取数据失败", "获取失败", "info", false, function() {});
            });
        });
        //获取组织下的未分配角色的用户列表结束
        //选择将要移动的用户开始
        $scope.adSelectUser = function(obj, item, select) {
            $(obj.target).parent().css("background-color", "#4696D3").css("color", "white");
            $(obj.target).parent().siblings().css("background-color", "white").css("color", "black");
            if (select == "selected") {
                $scope.itemWtoLeft = item;
            } else if (select == "wSelect") {
                $scope.itemWtoRight = item;
            }
        };
        //选择将要移动的用户结束
        //左右移动用户开始
        $scope.itemMove = function(direction) {
            if (direction == "toLeft") {
                if ($scope.itemWtoLeft !== undefined && $scope.itemWtoLeft !== null) {
                    $scope.itemsSelected.splice($scope.itemsSelected.indexOf($scope.itemWtoLeft), 1);
                    $scope.itemsWselect.push($scope.itemWtoLeft);
                    $scope.itemWtoLeft = null;
                } else {
                    trsconfirm.alertType("请选择用户", "请选择用户", "info", false, function() {});
                }
            } else {
                if ($scope.itemWtoRight !== undefined && $scope.itemWtoRight !== null) {
                    $scope.itemsWselect.splice($scope.itemsWselect.indexOf($scope.itemWtoRight), 1);
                    $scope.itemsSelected.push($scope.itemWtoRight);
                    $scope.itemWtoRight = null;
                } else {
                    trsconfirm.alertType("请选择用户", "请选择用户", "info", false, function() {});

                }
            }
        };
        //左右移动用户结束
        //左右移动所有用户开始
        $scope.itemMoveAll = function(direction) {
            if (direction == "toLeft") {
                $scope.itemsWselect = $scope.itemsWselect.concat($scope.itemsSelected);
                $scope.itemsSelected = [];
            } else if (direction == "toRight") {
                $scope.itemsSelected = $scope.itemsSelected.concat($scope.itemsWselect);
                $scope.itemsWselect = [];
            }
        };
        //左右移动酥油用户结束
        //确定开始
        $scope.confirm = function() {
            var userIds = "";
            angular.forEach($scope.itemsSelected, function(data, index, array) {
                if (index != ($scope.itemsSelected.length - 1)) {
                    userIds += data.USERID + ",";
                } else {
                    userIds += data.USERID;
                }
            });
            var params = {
                "UserIds": userIds,
                "RoleId": $scope.roleData.ROLEID,
                "serviceid": "mlf_extrole",
                "methodname": "addUser"
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                    if (data.status === undefined && data.status != "-1") {
                        SweetAlert.swal({
                            title: "保存成功！",
                            type: "info",
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        });
                        $scope.$emit("addUser", true);
                        $scope.$close();
                    } else {
                        SweetAlert.swal({
                            title: "保存失败！",
                            type: "warning",
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        });
                    }
                },
                function(data) {
                    SweetAlert.swal({
                        title: "保存失败！",
                        type: "warning",
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    });
                });
        };
        //确定结束
        //取消开始
        $scope.cancel = function() {
            $scope.$close();
        };
        //取消结束
        //默认展开树开始
        function ExpandedNodes() {
            $scope.expandedAddUser = angular.copy($scope.expandedTest);
        }

        function init() {
            ExpandedNodes();
            $scope.itemsSelected = [];
            $scope.aDtreeOptions = {
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
                    labelSelected: "rolegrouplabselected"
                },
                isLeaf: function(node) {
                    return node.HASCHILDREN === false;
                }
            };
            //树配置结束
            $scope.node1 = $scope.selectedNode;
        }
    }]);
