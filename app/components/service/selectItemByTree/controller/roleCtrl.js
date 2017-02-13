/*
    Create by BaiZhiming 2015-1-18
*/
"use strict";
angular.module("selectRoleModule", [])
    .controller("selectRoleCtrl", ["$scope", "$timeout", "$modalInstance", "trsHttpService", "trsconfirm", "itemsd", "title", "globleParamsSet", function($scope, $timeout, $modalInstance, trsHttpService, trsconfirm, itemsd, title, globleParamsSet) {
        init();
        $scope.showSelected = function(node) {
            getGroupData(node);
        };
        $scope.showToggle = function(node) {
            childrenTree(node, function() {});
        };
        $scope.toRight = function() {
            angular.forEach($scope.roleDatas, function(data, index, array) {
                if (data.selected === "selected") {
                    delete data.selected;
                    $scope.itemsSd = globleParamsSet.arrayContrast([angular.copy(data)], angular.copy($scope.itemsSd), "ROLEID", "ROLENAME");
                    $scope.roleDatas[index].selected = "";
                    $scope.selectedRole.push(data.ROLEID);
                }
            });
        };
        //输入过滤器
        $scope.myFilter = function(expected, actual) {
            var flag = true;
            if ($scope.searchWordLeft !== "" && angular.isDefined($scope.searchWordLeft)) {
                flag = expected.ROLEDESC.indexOf($scope.searchWordLeft) >= 0 ? true : false;
            }
            return flag;
        };
        //输入过滤器
        $scope.chooseUserName = function(type, role) {
            if (angular.isDefined(role.selected) && role.selected === "selected") {
                role.selected = "";
            } else {
                role.selected = "selected";
                if (type == "toChoose") {
                    $scope.toChooseUser = role;
                } else if (type == "cancelChoose") {
                    $scope.cancelChooseUser = role;
                }
            }
        };
        //双击选择开始
        $scope.directlyToRight = function(user) {
            user.selected = "";
            $scope.selectedRole.push(user.ROLEID);
            $scope.itemsSd = globleParamsSet.arrayContrast([angular.copy(user)], $scope.itemsSd, "ROLEID", "ROLENAME");
        };
        //双击选择结束
        //双击取消选择开始
        $scope.directlyToLeft = function(user) {
            globleParamsSet.contrastAfExclArray([user], $scope.itemsSd, "ROLEID", "ROLENAME", function(data) {
                $scope.itemsSd = data;
            });
        };
        //双击取消选择结束
        $scope.toLeft = function() {
            toLeft($scope.cancelChooseUser);
        };
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        $scope.submit = function() {
            if ($scope.itemsSd.length < 1) return;
            $modalInstance.close($scope.itemsSd);
        };
        $scope.selectedAll = function() {
            angular.forEach($scope.roleDatas, function(data, index, array) {
                delete data.selected;
                $scope.itemsSd = globleParamsSet.arrayContrast([angular.copy(data)], angular.copy($scope.itemsSd), "ROLEID", "ROLENAME");
                $scope.roleDatas[index].selected = "";
                if ($scope.selectedRole.indexOf(data.ROLEID) < 0) {
                    $scope.selectedRole.push(data.ROLEID);
                }
            });
        };

        function init() {
            //组织树配置文件
            $scope.treePAOptions = {
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
                },
                isSelectable: function(node) {
                    return node.HASRIGHT === "true";
                }
            };
            $scope.expandedPA = angular.copy($scope.expandedTest);

            var treeParams = {
                "serviceid": "mlf_group",
                "methodname": "queryGroupTreeWithSecondRight"
            };
            //获取没有权限的组织树
            trsHttpService.httpServer("/wcm/mlfcenter.do", treeParams, "get").then(function(data) {
                $scope.treedataPA = [data];
                ExpandedNodes();
            }, function(data) {});
            //初始化最近记录限制
            $scope.limitRecordNum = 10;
            //初始化选择列表
            $scope.itemsSd = itemsd;
            /*var selectedParams = {
                "serviceid": "mlf_extrole",
                "methodname": "getPrivilegeRange",
                "RoleId": roleid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), selectedParams, "post").then(function(data) {
                $scope.itemsSd = data;
            });*/
            $scope.title = title;
            $scope.selectedRole = [];
        }
        //默认展开树开始
        function ExpandedNodes() {
            $scope.expandedPA = [];
            $scope.expandedPA.push($scope.treedataPA[0]);
            /*if ($scope.treedataPA[0].CHILDREN === 0) {
                $scope.selectedNodePA = $scope.treedataPA[0];
                getGroupData($scope.selectedNodePA);
            } else {
                angular.forEach($scope.treedataPA[0].CHILDREN, function(data, index, array) {
                    if (data.ISPATH === "true") {
                        $scope.expandedPA.push(data);
                        if (data.CHILDREN.length !== 0) {
                            selfPath(data);
                        } else {
                            $scope.selectedNodePA = data;
                            getGroupData($scope.selectedNodePA);
                        }

                    }
                });
            }*/
        }
        //默认展开树结束
        function getGroupData(node) {
            $timeout(function() {
                    //此判断如果两次点击同一个树，不重复加载角色列表。
                    $scope.groupObj = node;
                    $scope.oldSelectNode = node;
                    $scope.Datas = [];
                    $scope.roleData = null;
                    var params = {
                        "serviceid": "mlf_extrole",
                        "methodname": "query",
                        "GroupId": $scope.groupObj.GROUPID
                    };
                    //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.roleDatas = data;
                        /*if (angular.isDefined(node.CHILDREN)&&node.CHILDREN.length === 0) {
                            childrenTree(node, function() {
                                $scope.userDatas = $scope.userDatas.concat(node.CHILDREN);
                            });
                        } else {
                            $scope.userDatas = $scope.userDatas.concat(node.CHILDREN);
                        }*/
                    }, function(data) {
                        trsconfirm.alertType("错误提示", "获取子组失败", "warning", false, function() {});
                    });
                },
                100);
        }

        function selfPath(data) {
            if (data.CHILDREN[0].ISPATH === "true") {
                /*if (data.CHILDREN[0].CHILDREN.length !== 0) {
                    $scope.expandedTest.push(data.CHILDREN[0]);
                    selfPath(data.CHILDREN[0]);
                } else {
                    $scope.selectedNode = data.CHILDREN[0];
                }*/
                if (data.CHILDREN[0].HASCHILDREN === "false" || data.CHILDREN[0].CHILDREN.length === 0) {
                    $scope.selectedNodePA = data.CHILDREN[0];
                    getGroupData($scope.selectedNodePA);
                } else {
                    $scope.expandedPA.push(data.CHILDREN[0]);
                    selfPath(data.CHILDREN[0]);
                }
            }
        }

        function childrenTree(node, callback) {
            if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
                var paramsT = {
                    "serviceid": "mlf_group",
                    "methodname": "queryChildGroupsWithSecondRight",
                    "GroupId": node.GROUPID
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                        node.CHILDREN = dataC.CHILDREN;
                        callback();
                    },
                    function(dataC) {
                        trsconfirm.alertType("错误提示", "获取子组失败", "warning", false, function() {});
                    });
            }
        }

        function toLeft(item) {
            var toRemoveList = [];
            angular.forEach($scope.itemsSd, function(data, index, array) {
                if (angular.isDefined(data.selected) && data.selected === "selected") {
                    toRemoveList.push(data);
                    $scope.selectedRole.splice($scope.selectedRole.indexOf(data.ROLEID), 1);
                }
            });
            globleParamsSet.contrastAfExclArray(toRemoveList, $scope.itemsSd, "ROLEID", "ROLENAME", function(data) {
                $scope.itemsSd = data;
            });
        }

        $scope.getSuggestions = function(viewValue) {
            if (viewValue !== '') {
                var searchUsers = {
                    serviceid: "mlf_extrole",
                    methodname: "searchRole",
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
                var flag = true;
                angular.forEach($scope.itemsSd, function(data, index, array) {
                    if (data.ROLEID === newValue.ROLEID) {
                        flag = false;
                    }
                });
                if (flag) {
                    $scope.isRequest = true;
                    /*newValue.OPERTYPE = newValue.TYPE;
                    newValue.DESC = newValue.USERNAME || newValue.GNAME;*/
                    $scope.itemsSd.push(newValue);
                }
                $scope.searchWord = newValue.USERNAME || newValue.GNAME;
            }
        });
    }]);
