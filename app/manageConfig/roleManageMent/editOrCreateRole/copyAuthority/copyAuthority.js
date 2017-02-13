/*
    create by BaiZhiming
    2015-10-17
*/
'use strict';
angular.module("manageCfg.roleManageMent.editorcreateRole.copyAuthority", []).controller("copyAuthorityCtrl", ["$scope", "$timeout", "$http", "trsHttpService", "SweetAlert", "$state", function($scope, $timeout, $http, trsHttpService, SweetAlert, $state) {
    $scope.selectedNodeCopy = angular.copy($scope.selectedNode);
    getGroupData($scope.selectedNodeCopy);
    $scope.cadRoleDatas = [];
    //初始化未选择角色列表开始
    // getTreeData($scope.selectedNodeCopy.GROUPID);
    //初始化未选择角色列表结束
    $scope.cAtreeOptions = {
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
    //初始化列表展开情况开始
    $scope.expandedCopy = angular.copy($scope.expandedTest);
    //初始化列表展开情况结束
    $scope.showToggleCopy = function(node) {
        if (node.HASCHILDREN == "true" && node.CHILDREN.length == 0) {
            var paramsT = {
                "serviceid": "mlf_group",
                "methodname": "queryChildGroupsForGroupUserMgr",
                "GroupId": node.GROUPID
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                    node.CHILDREN = dataC.CHILDREN;
                    ExpandedEmptyNodes(node);
                    //console.log(dataC.CHILDREN);
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
    $scope.cAshowSelected = function(node) {
        getGroupData(node);
        //获取子组开始
        //获取子组结束
        /*$http.get("manageConfig/data/roledata_"+node.id+".json").success(function(data){
            $timeout(function(){
                $scope.wCaRoleDatas = data;
            },100)                          
        });*/
    };
    $scope.selectWCaRole = function(obj, roleData) {
        $(obj.target).parent().css("background-color", "#4696D3");
        $(obj.target).parent().css("color", "white");
        $(obj.target).parent().siblings().css("background-color", "white");
        $(obj.target).parent().siblings().css("color", "black");
        $scope.wRoleData = roleData;
    };
    $scope.selectCadRole = function(obj, roleData) {
        $(obj.target).parent().css("background-color", "#4696D3");
        $(obj.target).parent().css("color", "white");
        $(obj.target).parent().siblings().css("background-color", "white");
        $(obj.target).parent().siblings().css("color", "black");
        $scope.nRoleData = roleData;
    };
    $scope.rightRole = function() {
        if ($scope.wRoleData !== undefined && $scope.wRoleData !== null) {
            var j;
            for (var i = 0; i < $scope.wCaRoleDatas.length; i++) {
                if ($scope.wCaRoleDatas[i].ROLEID == $scope.wRoleData.ROLEID) {
                    //console.log($scope.wCaRoleDatas[i]);
                    j = i;
                }
            }
            $scope.wCaRoleDatas.splice(j, 1);
            $scope.cadRoleDatas.push($scope.wRoleData);
            $scope.wRoleData = null;
            $scope.nRoleData = null;
        } else {
            SweetAlert.swal({
                title: "提示信息",
                text: "请先选择角色！",
                type: "info",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        }
    };
    $scope.leftRole = function() {
        if ($scope.nRoleData !== undefined && $scope.nRoleData != null) {
            var j;
            for (var i = 0; i < $scope.cadRoleDatas.length; i++) {
                if ($scope.cadRoleDatas[i].ROLEID == $scope.nRoleData.ROLEID) {
                    //console.log($scope.wCaRoleDatas[i]);
                    j = i;
                }
            }
            $scope.cadRoleDatas.splice(j, 1);
            $scope.wCaRoleDatas.push($scope.nRoleData);
            $scope.nRoleData = null;
            $scope.RoleData = null;
        } else {
            SweetAlert.swal({
                title: "提示信息",
                text: "请先选择角色！",
                type: "info",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        }
    }
    $scope.rightAllRole = function() {
        if ($scope.wCaRoleDatas != undefined) {
            for (var i = 0; i < $scope.wCaRoleDatas.length; i++) {
                $scope.cadRoleDatas.push($scope.wCaRoleDatas[i]);
            }
            $scope.wCaRoleDatas = [];
        } else {
            SweetAlert.swal({
                title: "提示信息",
                text: "请先选择组织！",
                type: "info",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        }
    }
    $scope.leftAllRole = function() {
        if ($scope.wCaRoleDatas != undefined) {
            for (var i = 0; i < $scope.cadRoleDatas.length; i++) {
                $scope.wCaRoleDatas.push($scope.cadRoleDatas[i]);
            }
            $scope.cadRoleDatas = [];
        } else {
            SweetAlert.swal({
                title: "提示信息",
                text: "请先选择组织！",
                type: "info",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        }
    }
    $scope.confirm = function() {
        var roleIds = "";
        angular.forEach($scope.cadRoleDatas, function(data, index, array) {
            if (index == $scope.cadRoleDatas.length - 1) {
                roleIds += data.ROLEID;
            } else {
                roleIds += data.ROLEID + ",";
            }
        });
        var params = {
            "serviceid": "mlf_extrole",
            "methodname": "copyRoleRight",
            "RoleId": $scope.roleData.ROLEID,
            "RoleIds": roleIds,
        };
        //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
        trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
            if (data.status == "-1") {
                SweetAlert.swal({
                    title: "提示信息",
                    text: data.message,
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "取消",
                });
            } else if (data.status == undefined) {
                SweetAlert.swal({
                    title: "提示信息",
                    text: "保存成功",
                    type: "info",
                    closeOnConfirm: true,
                    cancelButtonText: "取消",
                });
                $state.go("manageconfig.rolemanage.editorcreaterole");
            }
        }, function(data) {
            SweetAlert.swal({
                title: "错误提示",
                text: "数据获取失败",
                type: "warning",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        });
    };
    $scope.cancel = function() {
        //需要请求服务
        $state.go("manageconfig.rolemanage.editorcreaterole");
    };

    function getTreeData(groupId) {
        var params = {
            "serviceid": "mlf_extrole",
            "methodname": "query",
            "GroupId": groupId //$scope.chooseGroupObj.GROUPID
        };
        //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
        trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
            $scope.wCaRoleDatas = data;
        }, function(data) {
            SweetAlert.swal({
                title: "错误提示",
                text: "获取数据失败",
                type: "warning",
                closeOnConfirm: true,
                cancelButtonText: "取消",
            });
        });
    }
    //无子节点的节点默认展开开始
    function ExpandedEmptyNodes(node) {
        angular.forEach(node.CHILDREN, function(data, index, array) {
            if (data.HASCHILDREN == "false") {
                $scope.expandedTest.push(node.CHILDREN[index]);
            }
        })
    }
    //无子节点的节点默认展开结束
    function getGroupData(node) {
        $timeout(function() {
            //$scope.cadRoleDatas = [];
            if ($scope.selectedNodeCopyOld !== undefined && $scope.selectedNodeCopyOld.GROUPID == node.GROUPID) {
                return;
            }
            $scope.selectedNodeCopyOld = node;
            $scope.wRoleData = null;
            $scope.wCaRoleDatas = [];
            $scope.chooseGroupObj = node; //获取更改后的分组
            getTreeData($scope.chooseGroupObj.GROUPID);
        }, 100);
    }

}]);
