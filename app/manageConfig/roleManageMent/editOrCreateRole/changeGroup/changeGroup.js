/*
    Create By Baizhiming 2015-10-16
*/
'use strict';
angular.module("manageCfg.roleManageMent.editorcreateRole.changeGroup", []).controller("changeGroupCtrl", ["$scope", "trsconfirm", "trsHttpService", "$state", "$timeout", function($scope, trsconfirm, trsHttpService, $state, $timeout) {
    $scope.groupObjNew = $scope.selectedNodeCopy = angular.copy($scope.selectedNode);
    $scope.cGtreeOptions = {
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
            return node.HASCHILDREN === "false";
        },
        isSelectable: function(node) {
            return node.HASRIGHT === "true";
        }

    };
    //设置默认展开目录开始
    $scope.expandedChangeGroup = angular.copy($scope.expandedTest);
    //设置默认展开目录结束
    $scope.cShowToggle = function(node) {
        if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
            var paramsT = {
                "serviceid": "mlf_group",
                "methodname": "queryChildGroupsWithSecondRight",
                "GroupId": node.GROUPID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), paramsT, "get").then(function(dataC) {
                node.CHILDREN = dataC.CHILDREN;
                ExpandedEmptyNodes(node);
            });
        }
    };
    $scope.cGshowSelected = function(node) {
        $timeout(function() {
            $scope.groupObjNew = node; //$scope.selectedNode; //获取更改后的分组
        }, 100);
    };
    $scope.cancel = function() {
        $state.go("manageconfig.rolemanage.editorcreaterole");
    };
    $scope.confirm = function() {
        //保存角色服务开始
        var params = {
            "serviceid": "mlf_extrole",
            "methodname": "save",
            "RoleId": $scope.roleData.ROLEID,
            "GroupId": $scope.groupObjNew.GROUPID,
            "RoleName": $scope.roleData.ROLENAME
        };
        //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.$emit("changeGroup", $scope.groupObjNew);
            $state.go("manageconfig.rolemanage");
        });
        //保存角色服务结束
    };
    //默认展开树开始
    function ExpandedNodes() {
        $scope.expandedChangeGroup = [];
        $scope.expandedChangeGroup.push($scope.dataForTheTree[0]);
        if ($scope.dataForTheTree[0].CHILDREN.length > 0) {
            angular.forEach($scope.dataForTheTree[0].CHILDREN, function(data, index, array) {
                if ($scope.dataForTheTree[0].CHILDREN[index].CHILDREN.length > 0) {
                    $scope.expandedChangeGroup.push($scope.dataForTheTree[0].CHILDREN[index]);
                } else {
                    $scope.expandedChangeGroup.push([]);
                }
            });
        }
    }
    //默认展开树结束
}]);
