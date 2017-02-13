/*Create by Baizhiming 2015-11-30*/
"use strict";
angular.module("iWoDraftModule", []).
controller('iWoDraftCtrl', ['$scope', '$timeout', '$modalInstance', 'trsHttpService', 'trsResponseHandle', 'SweetAlert', 'trsspliceString', 'trsconfirm', "incomeData", function($scope, $timeout, $modalInstance, trsHttpService, trsResponseHandle, SweetAlert, trsspliceString, trsconfirm, incomeData) {
    init();
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    $scope.showToggle = function(node) {
        childrenTree(node, function() {});
    };
    $scope.chooseUser = function(user) {
        if (angular.isDefined(user.selected) && user.selected === "selected") {
            $scope.selectedUser = {};
            user.selected = "";
        } else {
            if (angular.isDefined($scope.oldUser)) {
                $scope.oldUser.selected = "";
            }
            $scope.selectedUser = user;
            user.selected = "selected";
            $scope.oldUser = user;
        }
    };
    $scope.confirm = function() {
        if (JSON.stringify($scope.selectedUser) === "{}") {
            trsconfirm.alertType("提示信息", "请选择用户", "warning", false, function() {});
        } else {
            if (incomeData.array !== "") {
                var params = {
                    "serviceid": "mlf_myrelease",
                    "methodname": incomeData.methodname,
                    "ChnlDocIds": trsspliceString.spliceString(incomeData.array, "CHNLDOCID", ","),
                    "UserId": angular.isDefined($scope.selectedUser.ID) ? $scope.selectedUser.ID : $scope.selectedUser.OPERID/*,
                    "GroupId": $scope.groupObj.GROUPID*/
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("传稿成功", "", "success", false, function() {
                        $modalInstance.close('success');
                    });
                }, function() {
                    $modalInstance.close('fail');
                });
            } else {
                $modalInstance.close({
                    "ID": angular.isDefined($scope.selectedUser.ID) ? $scope.selectedUser.ID : $scope.selectedUser.OPERID,
                    "GROUPID": $scope.groupObj.GROUPID,
                    "USERNAME": $scope.oldUser.USERNAME
                });
            }
        }
    };

    $scope.showSelected = function(node) {
        $timeout(function() {
                //此判断如果两次点击同一个树，不重复加载角色列表。
                if ($scope.oldSelectNode !== undefined && node.GROUPID == $scope.oldSelectNode.GROUPID) {
                    return;
                }
                $scope.groupObj = node;
                $scope.oldSelectNode = node;
                $scope.Datas = [];
                $scope.userData = null;
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "getUsersByGroup",
                    "GroupId": $scope.groupObj.GROUPID
                };
                //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                    $scope.users = trsResponseHandle.responseHandle(data, false);
                }, function(data) {
                    SweetAlert.swal({
                        title: "错误提示",
                        text: "获取数据失败",
                        type: "warning",
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                });
            },
            100);
    };
    $scope.getSuggestions = function(viewValue) {
        if (viewValue !== '') {
            var searchUsers = {
                serviceid: "mlf_extuser",
                methodname: "searchUserOrDept",
                Name: viewValue
            };
            if ($scope.isRequest) {
                $scope.isRequest = false;
                return [];
            } else {
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchUsers, "post").then(function(data) {
                    return data;
                });
            }
        }
    };
    $scope.$watch('searchWord', function(newValue, oldValue, scope) {
        if (angular.isObject(newValue)) {
            $scope.isRequest = true;
            $scope.users = [newValue];
            $scope.searchWord = newValue.USERNAME;
        }
    });

    function init() {
        $scope.status = incomeData;
        $scope.isRequest = false;
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
        var treeParams = {
            "serviceid": "mlf_group",
            "methodname": "queryGroupTreeWithOutRight"
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", treeParams, "get").
        then(function(data) {
            $scope.treedata = [trsResponseHandle.responseHandle(data, false)];
            ExpandedNodes();
        }, function(data) {});
        var recordParams = {
            "serviceid": "mlf_myrelease",
            "methodname": "getTransferedRecord"
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", recordParams, "get").
        then(function(data) {
            $scope.records = trsResponseHandle.responseHandle(data, false);
        }, function(data) {});
        $scope.selectedUser = {};
        $scope.recordNum = 6;
    }

    function childrenTree(node, callback) {
        if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
            var paramsT = {
                "serviceid": "mlf_group",
                "methodname": "queryChildGroupsWithOutRight",
                "GroupId": node.GROUPID
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                    node.CHILDREN = dataC.CHILDREN;
                    callback();
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
    }
    //默认树展开
    function ExpandedNodes() {
        $scope.expandedTest = [];
        $scope.expandedTest.push($scope.treedata[0]);
        /*if ($scope.treedata[0].CHILDREN === 0) {
            $scope.selectedNode = $scope.treedata[0];
            getGroupData($scope.selectedNode);
        } else {
            angular.forEach($scope.treedata[0].CHILDREN, function(data, index, array) {
                if (data.ISPATH === "true") {
                    $scope.expandedTest.push(data);
                    if (data.CHILDREN.length !== 0) {
                        selfPath(data);
                    } else {
                        $scope.selectedNode = data;
                        getGroupData($scope.selectedNode);
                    }

                }
            });
        }*/
    }

    function getGroupData(node) {
        $timeout(function() {
                $scope.groupObj = node;
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "getUsersByGroup",
                    "GroupId": $scope.groupObj.GROUPID
                };
                //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                    if (data.status !== undefined && data.status == "-1") {
                        trsconfirm.alertType("错误提示", "获取用户失败", "warning", false, function() {});
                    } else {
                        $scope.users = data;
                    }
                }, function(data) {
                    trsconfirm.alertType("错误提示", "获取数据失败", "warning", false, function() {});
                });
            },
            100);
    }

    function selfPath(data) {
        if (data.CHILDREN[0].ISPATH === "true") {
            if (data.CHILDREN[0].HASCHILDREN === "false" || data.CHILDREN[0].CHILDREN.length === 0) {
                $scope.selectedNode = data.CHILDREN[0];
                getGroupData($scope.selectedNode);
            } else {
                $scope.expandedTest.push(data.CHILDREN[0]);
                selfPath(data.CHILDREN[0]);
            }
        }
    }

}]);
