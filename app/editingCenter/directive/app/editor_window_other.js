/*Create by BaiZhiming 2015-12-08*/
"use strict";
angular.module("editorOtherModule", [])
    .controller("editorOtherCtrl", ["$scope", "$timeout", "trsHttpService", "trsconfirm", "$modalInstance", function($scope, $timeout, trsHttpService, trsconfirm, $modalInstance) {
        init();
        $scope.showToggle = function(node) {
            if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
                var paramsT = {
                    "serviceid": "mlf_group",
                    "methodname": "queryChildGroupsWithOutRight",
                    "GroupId": node.GROUPID
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                        node.CHILDREN = dataC.CHILDREN;
                    },
                    function(dataC) {
                        trsconfirm.alertType("错误提示", "获取子组失败", "warning", false, function() {});
                    });
            }
        };
        //输入过滤器
        $scope.myFilter = function(expected, actual) {
            var flag = true;
            if ($scope.searchWordLeft !== "" && angular.isDefined($scope.searchWordLeft)) {
                flag = expected.USERNAME.indexOf($scope.searchWordLeft) >= 0 ? true : false;
            }
            return flag;
        };
        //输入过滤器
        //点击树回调函数开始
        $scope.showSelected = function(node) {
            getGroupData(node);
        };
        //点击树回调函数结束
        //双击选择
        $scope.dbckChoose = function(user) {
            delete user.selected;
            $scope.userSelectedList = contrast([angular.copy(user)], angular.copy($scope.userSelectedList), "ID");
        };
        //双击撤销
        $scope.dbckRemove = function(user) {
            $scope.userSelectedList = removeList([angular.copy(user)], angular.copy($scope.userSelectedList), "ID");
        };

        //单击选择
        $scope.singleSelect = function() {
            var selectedArray = [];
            angular.forEach(angular.copy($scope.userDatas), function(data, index, array) {
                if (data.selected) {
                    if (angular.isDefined(data.selected)) {
                        $scope.userDatas[index].selected = false;
                        delete data.selected;
                    }
                    selectedArray.push(data);
                }
            });
            $scope.userSelectedList = contrast(selectedArray, angular.copy($scope.userSelectedList), "ID");
        };
        //单击撤销
        $scope.singleRemove = function() {
            var removeArray = [];
            angular.forEach(angular.copy($scope.userSelectedList), function(data, index, array) {
                if (data.selected) {
                    if (angular.isDefined(data.selected)) {
                        $scope.userSelectedList[index].selected = false;
                        delete data.selected;
                    }
                    removeArray.push(data);
                }
            });
            $scope.userSelectedList = removeList(removeArray, angular.copy($scope.userSelectedList), "ID");
        };
        $scope.selectedAll = function() {
            angular.forEach($scope.userDatas, function(data, index, array) {
                if (angular.isDefined(data.selected)) {
                    delete $scope.userDatas[index].selected;
                }
            });
            $scope.userSelectedList = contrast(angular.copy($scope.userDatas), angular.copy($scope.userSelectedList), "ID");
        };
        $scope.removeAll = function() {
            $scope.userSelectedList = [];
        };
        //接收搜索框内容开始
        $scope.getStatus = function(viewValue) {
            $scope.searchParams = {
                "methodname": "queryUsersByName",
                "serviceid": "mlf_extuser",
                "Name": viewValue
            };
            return trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.searchParams, "post").then(function(data) {
                angular.forEach(data,function(data_,index,array){
                    data[index].pinyin = $scope.searchUser;
                });
                return data;
            }, function() {});
        };
        $scope.confirm = function() {
            if ($scope.userSelectedList.length !== 0) {
                $modalInstance.close($scope.userSelectedList);
            } else {
                trsconfirm.alertType("请选择用户", "请选择用户", "warning", false);
            }

        };
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.$watch("searchUser", function(newValue, oldValue) {
            if (newValue !== undefined && newValue !== "") {
                if (typeof newValue === "object") {
                    $scope.userSelectedList = contrast([newValue], angular.copy($scope.userSelectedList), "ID");
                    $scope.searchUser = "";
                }
            }
        });
        //接收搜索框内容结束

        function init() {
            $scope.userSelectedList = $scope.editorJson;
            //树配置开始
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
            //树配置结束
            //获取树开始
            var params = {
                "serviceid": "mlf_group",
                "methodname": "queryGroupTreeWithOutRight",
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                $scope.dataForTheTree = [data];
                //默认展开树操作开始
                ExpandedNodes($scope);
                //默认展开树操作结束
            }, function(data) {
                trsconfirm.alertType("错误提示", "获取数据失败", "warning", false, function() {});
            });
            //获取树结束
        }
        //默认展开树函数开始
        function ExpandedNodes($scope) {
            $scope.expandedTest = [];
            $scope.expandedTest.push($scope.dataForTheTree[0]);
            if ($scope.dataForTheTree[0].CHILDREN === 0) {
                $scope.selectedNode = $scope.dataForTheTree[0];
                getGroupData($scope.selectedNode);
            } else {
                angular.forEach($scope.dataForTheTree[0].CHILDREN, function(data, index, array) {
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
            }
        }
        //默认展开树函数结束
        //对比是否重复开始
        function contrast(array1, array2, attribute) {
            angular.forEach(array1, function(data, index, array) {
                var flag = true;
                angular.forEach(array2, function(_data, _index, _array) {
                    if (data[attribute] === _data[attribute]) {
                        flag = false;
                    }
                });
                if (flag) {
                    array2.push(data);
                }
            });
            return array2;
        }
        //对比是否重复结束
        function removeList(array1, array2, attribute) {
            angular.forEach(array1, function(data, index, array) {
                var i = 0;
                while (i < array2.length) {
                    if (data[attribute] === array2[i][attribute]) {
                        array2.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            });
            return array2;
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
                    $scope.selectedNode = data.CHILDREN[0];
                    getGroupData($scope.selectedNode);
                } else {
                    $scope.expandedTest.push(data.CHILDREN[0]);
                    selfPath(data.CHILDREN[0]);
                }
            }
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
                            $scope.userDatas = data;
                        }
                    }, function(data) {
                        trsconfirm.alertType("错误提示", "获取数据失败", "warning", false, function() {});
                    });
                },
                100);
        }
    }]);
