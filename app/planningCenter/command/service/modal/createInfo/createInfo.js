/*
    Create by Fhs 2015-1-18
*/
"use strict";
angular.module("createInfoModule", [])
    .controller("createInfoCtrl", ["$scope", "$timeout", "$modalInstance", "trsHttpService", "trsconfirm",'globleParamsSet', 'dateFilter', function($scope, $timeout, $modalInstance, trsHttpService, trsconfirm,globleParamsSet, dateFilter) {
        var info = $scope.info = {
            PlanInformationId: '',
            Title: null,
            Content: null
        };
        var selectedDept;
        $scope.tips = {};
        $scope.toggleExpand = function() {
            $scope.isexpanded = !$scope.isexpanded;
        };
        $scope.checkcomfirm = function() {
            return info.Title && info.Content;
        }
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        $scope.submit = function() {

            var arr = [];
            if ($scope.infoFor === 1) {
                angular.forEach($scope.selectedDepts, function(dept, index) {
                    arr.push(dept.id);
                });
            } else if ($scope.infoFor === 2){
                angular.forEach($scope.itemsSd, function(item, index) {
                    arr.push(item.USERID);
                }); 
            }
            $modalInstance.close({
                PlanInformationId: 0,
                Title: info.Title,
                Content: info.Content,
                Flag: $scope.infoFor,
                InfoType: $scope.selectType.INFORTYPEID,
                InforIds: arr.join(','),
                IsTime: $scope.isTiming?1:0,
                PubTime:dateFilter($scope.startTime, 'yyyy-MM-dd HH:mm:ss')
            });
        };


        init();
        $scope.showSelected = function(node) {
            getGroupData(node);
        };
        $scope.showToggle = function(node) {
            childrenTree(node, function() {});
        };
        $scope.toRight = function() {
            angular.forEach($scope.userDatas, function(data, index, array) {
                if (data.selected === "selected") {
                    delete data.selected;
                    data.DESC = data.TRUENAME;
                    data.USERID = data.ID;
                    data.deptId = $scope.groupObj.GROUPID;
                    $scope.itemsSd = globleParamsSet.arrayContrast([angular.copy(data)], angular.copy($scope.itemsSd), "ID", "USERNAME");
                    $scope.userDatas[index].selected = "";
                }
            });
        };
        $scope.selectedAll = function() {
            angular.forEach($scope.userDatas, function(data, index, array) {
                delete data.selected;
                data.DESC = data.TRUENAME;
                data.deptId = $scope.groupObj.GROUPID;
                $scope.itemsSd = globleParamsSet.arrayContrast([angular.copy(data)], angular.copy($scope.itemsSd), "ID", "OPERTYPE");
                $scope.userDatas[index].selected = "";
            });
        };
        $scope.chooseUserName = function(type, user) {
            if (angular.isDefined(user.selected) && user.selected === "selected") {
                user.selected = "";
            } else {
                user.selected = "selected";
                if (type == "toChoose") {
                    $scope.toChooseUser = user;
                } else if (type == "cancelChoose") {
                    $scope.cancelChooseUser = user;
                }
            }
        };
        //输入过滤器
        $scope.myFilter = function(expected, actual) {
            var flag = true;
            if ($scope.searchWordLeft !== "" && angular.isDefined($scope.searchWordLeft)) {
                flag = expected.TRUENAME.indexOf($scope.searchWordLeft) >= 0 ? true : false;
            }
            return flag;
        };
        //输入过滤器
        //双击选择开始
        $scope.directlyToRight = function(user) {
            user.selected = "";
            user.DESC = user.TRUENAME;
            user.deptId = $scope.groupObj.GROUPID;
            $scope.itemsSd = globleParamsSet.arrayContrast([angular.copy(user)], $scope.itemsSd, "ID", "USERNAME");
        };
        //双击选择结束
        //双击取消选择开始
        $scope.directlyToLeft = function(user) {
            globleParamsSet.contrastAfExclArray([user], $scope.itemsSd, "ID", "USERNAME", function(data) {
                $scope.itemsSd = data;
            });
        };
        //双击取消选择结束
        $scope.toLeft = function() {
            var toRemoveList = [];
            angular.forEach($scope.itemsSd, function(data, index, array) {
                if (angular.isDefined(data.selected) && data.selected === "selected") {
                    toRemoveList.push(data);
                }
            });
            globleParamsSet.contrastAfExclArray(toRemoveList, $scope.itemsSd, "ID", "USERNAME", function(data) {
                $scope.itemsSd = data;
            });
        };
        $scope.checkValid = function() {
            return $scope.topicContet && $scope.topicContet.trim().length > 0 && $scope.itemsSd.length > 0;
        }
        $scope.selectAccepter = function(infoFor) {
            $scope.infoFor = infoFor;
        }

        function init() {
            //组织树配置文件
            $scope.treePAOptions = {
                nodeChildren: "CHILDREN",
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
            /*初始化一些变量 */
            $scope.infoFor = 1;
            $scope.selectedDepts = [];
            $scope.expandedPA = angular.copy($scope.expandedTest);
            $scope.isTiming = false; 
            $scope.startTime = new Date(); 
            var treeParams = {
                "serviceid": "mlf_group",
                "methodname": "queryGroupTreeWithMyPath"
            };
            //获取没有权限的组织树
            trsHttpService.httpServer("/wcm/mlfcenter.do", treeParams, "get").then(function(data) {
                $scope.treedataPA = [data];
                ExpandedNodes();
            }, function(data) {});
            //初始化最近记录限制
            $scope.limitRecordNum = 10;
            //初始化选择列表
            $scope.itemsSd = [];
            /*var selectedParams = {
                "serviceid": "mlf_extrole",
                "methodname": "getPrivilegeRange",
                "RoleId": roleid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), selectedParams, "post").then(function(data) {
                $scope.itemsSd = data; 
            });*/
            // 获取信息类型
            var infotypesParams = {
                "serviceid": "mlf_task",
                "methodname": "queryInfoTypes",
                "PageId": 1
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", infotypesParams, "get").then(function(data) {
                $scope.infotypes = data;
                $scope.selectType = data[0];
            }, function(data) {});
        }
        //默认展开树开始
        function ExpandedNodes() {
            $scope.expandedPA = [];
            $scope.expandedPA.push($scope.treedataPA[0]);
            if ($scope.treedataPA[0].CHILDREN === 0) {
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
            }
        }
        //默认展开树结束
        function getGroupData(node) {
            $timeout(function() {
                    //此判断如果两次点击同一个树，不重复加载角色列表。
                    $scope.groupObj = node;
                    $scope.oldSelectNode = node;
                    $scope.Datas = [];
                    $scope.userData = null;
                    var params = {
                        "serviceid": "mlf_task",
                        "methodname": "getUsersByGroup",
                        "GroupId": $scope.groupObj.GROUPID
                    };
                    //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.userDatas = data;
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
                    "methodname": "queryChildGroupsWithOutRight",
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
            if (item !== "" && item !== undefined && $scope.itemsSd.indexOf(item) !== -1) {
                $scope.itemsSd.splice($scope.itemsSd.indexOf(item), 1);
                if (item.isSelected !== undefined) {
                    item.isSelected = false;
                }
                item.selected = false;
            }
            item = "";
        }
        $scope.getSuggestions = function(viewValue) {
            if (viewValue !== '' && checkValue(viewValue)) {
                var searchUsers = {
                    serviceid: "mlf_report",
                    methodname: "queryUserByName",
                    Name: viewValue
                };
                if ($scope.isRequest) {
                    $scope.isRequest = false;
                    return [];
                } else {
                    return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchUsers, "post").then(function(data) {
                        return data.DATA;
                    });
                }
            }
        };
        var checkValue = function(newValue) {
            if (angular.isObject(newValue)) {
                var flag = true;
                newValue.ID = newValue.ID ? newValue.ID : newValue.USERID;
                angular.forEach($scope.itemsSd, function(data, index, array) {
                    if (data.ID === newValue.ID) {
                        flag = false;
                    }
                });
                if (flag) {
                    $scope.isRequest = true;
                    newValue.OPERTYPE = newValue.TYPE;
                    newValue.DESC = newValue.USERNAME;
                    $scope.itemsSd.push(newValue);
                }
                $scope.searchWord = newValue.USERNAME;
                return false;
            } else {
                return true;
            }
        }


        /* 选择部门相关*/
        $scope.selectDept = function(node) {
            selectedDept = node;
        }
        $scope.chooseDept = function(dept) {
            if (angular.isDefined(dept.selected) && dept.selected === true) {
                dept.selected = false;
            } else {
                dept.selected = true;
            }
        }
        $scope.depttoRight = function() {
            var node = selectedDept;
            var hasthis = false;
            angular.forEach($scope.selectedDepts, function(dept, index) {
                if (dept.id === node.GROUPID) {
                    hasthis = true;
                }
            });
            if (!hasthis) {
                $scope.selectedDepts.push({
                    id: node.GROUPID,
                    name: node.GNAME,
                    selected: false
                });
            }
        };

        $scope.depttoLeft = function() {
            var arr = [];
            angular.forEach($scope.selectedDepts, function(dept, index) {
                if (true !== dept.selected) {
                    arr.push(dept);
                }
                $scope.selectedDepts = arr;

            });
        };
    }]);
