/*
    Create by fanglijuan 2016-04-22
*/
'use strict';
angular.module("createUserModule", [])
    .controller("createUserCtrl", ["$scope", "$location", "$stateParams", "$q", "$filter", "$timeout", "$modalInstance", "trsHttpService", 'treeService', "$state", "$validation", "userid", "whichTabShow", "trsspliceString", "globleParamsSet", "userManageMentService", "trsconfirm",
        function($scope, $location, $stateParams, $q, $filter, $timeout, $modalInstance, trsHttpService, treeService, $state, $validation, userid, whichTabShow, trsspliceString, globleParamsSet, userManageMentService, trsconfirm) {
            initStatus();
            initData();

            function initStatus() {
                $scope.status = {
                    UserId: userid,
                    whichTabShow: whichTabShow,
                    treeOptions: {
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
                            return node.HASCHILDREN === "false";
                        }
                    },
                    defultGroupid: $location.search().groupid ? true : false, //默认的groupid
                    isAddOrEdit: userid ? 'edit' : 'add',
                    // selectedModal: "userInfo",
                    pwdName: "密码：",
                    passwordEqual: true,
                };
                $scope.data = {
                    modalTitle: userid ? "修改用户" : "新建用户",
                    selectedRole: [],
                    //delSelectedRole: [], 
                    //delSelectedRoleIds:[],//修改时需要删除的角色ids
                    //oldRoleIds:[],//备份修改时原有的角色ids
                    treeData: [],
                    groupPaths: [],
                    currUser: {
                        UserId: userid ? userid : 0,
                        USERNAME: "",
                        EMAIL:'',
                    },
                    confIrmpwd: "",
                    selectedGroup: [],
                };
            }
            /**
             * [initData description]初始化数据
             */
            function initData() {
                getTreeData();
                requestData();
            }
            /*
            获取用户详细信息(初始化用户信息)
             */
            function requestData() {
                //add
                //1.初始化用户，空对象；
                //2验证保存提交用户 以及选择组织，后台返回UERID，
                //3.判断是否有默认组织groupid ,有则查询该组织；
                //return;
                //edit
                //1.根据uerid查询用户
                //2.给currUser 赋值；
                //3.给defaultRole 默认角色赋值
                //4，查询出该用户所有组织，根据用户ID
                //5，表单验证，比较用户，组织，角色，信息；注：要判断是否修改过用户信息，组织信息，角色信息；未修改不提交；
                if ($scope.status.isAddOrEdit == "add") { //add;
                    if ($scope.status.defultGroupid) {
                        getGroupPaths($stateParams.groupid, "/");
                    }
                } else { //edit
                    queryUserById($scope.status.UserId);
                }
            }
            //查询用户
            function queryUserById(userid) {
                var params = {
                    "serviceid": "mlf_usermanagement",
                    "methodname": "getUsersDetail",
                    "UserId": userid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.data.currUser = data.USER[0];
                    $scope.data.selectedRole = data.ROLEDATA;
                    if (data.GROUP.length > 0) {
                        getGroupPaths(trsspliceString.spliceString(data.GROUP, "GROUPID", ","), "/");
                    }
                    if (data.ROLEDATA.length > 0) {
                        $scope.data.oldRoleIds = trsspliceString.spliceString(angular.copy(data.ROLEDATA), "ROLEID", ",");
                    }
                });
            }
            $scope.checkPwd = function() {
                $scope.status.passwordEqual = $scope.data.currUser.PASSWORD === $scope.data.confIrmpwd ? true : false;
            };
            /**
             * 删除角色
             */
            function delSelectedRole() {
                var params = {
                    serviceid: "mlf_usermanagement",
                    methodname: "deleteUserRoles",
                    UserId: $scope.data.currUser.USERID,
                    RoleIds: delSelectedRoleIds
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {});
            }
            //新建or修改：点击确定
            $scope.confirm = function() {
                $validation.validate($scope.createUserSubmitForm).success(function() {
                    if ($scope.status.isAddOrEdit == "add") {
                        if ($scope.data.currUser.PASSWORD !== $scope.data.confIrmpwd) {
                            $scope.status.passwordEqual = false;
                            return;
                        }
                    }
                    if ($location.search().status != null) {
                        //组织不为空
                        if ($scope.data.groupPaths.length < 1) {
                            $scope.status.whichTabShow = 'group';
                            trsconfirm.alertType('所属组织不允许为空', "", "error", false);
                            return;
                        }
                    }
                    saveUser(angular.copy($scope.data.currUser), $scope.data.groupPaths, $scope.data.selectedRole).then(function() {
                        trsconfirm.alertType('保存成功', "", "success", false, function() {
                            $modalInstance.close();
                        });
                    });
                }).error(function() {
                    trsconfirm.alertType('保存失败', "请检查填写项", "warning", false);
                });
            };
            //保存用户
            function saveUser(currUser, groupPaths, selectedRole) {
                var defer = $q.defer();
                var params = currUser;
                params.serviceid = "mlf_usermanagement";
                params.methodname = "saveUser"; //新建用户
                if ($scope.status.defultGroupid) {
                    params.methodname = "saveGroupUser"; //组织下新建修改用户
                    params.GroupId = $location.search().groupid;
                }
                params.GroupIds = trsspliceString.spliceString(groupPaths, "GROUPID", ",");
                if (selectedRole.length > 0) {
                    params.RoleIds = trsspliceString.spliceString(selectedRole, "ROLEID", ",");
                }
                /*if ($scope.data.delSelectedRole > 0) {
                    delSelectedRole(); //删除角色
                }*/
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    defer.resolve("succsss");
                });
                return defer.promise;
            }
            /**
             * [showToggle description]树展开方法
             * @param  {[obj]} node [description]父节点
             * @return {[type]}        [description]
             */
            $scope.showToggle = function(node) {
                /*if (node.HASCHILDREN === "false" || (angular.isDefined(node.CHILDREN) && node.CHILDREN.length !== 0))
                    return;
                treeService.queryChildGroupsForGroupUserMgr("", node.GROUPID).then(function(data) {
                    node.CHILDREN = data.CHILDREN;
                });*/
                childrenTree(node, function() {});
            };
            /**
             * [childrenTree description获取子组织]
             * @param  {[type]}   node     [description]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            function childrenTree(node, callback) {
                if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
                    var paramsT = {
                        "serviceid": "mlf_group",
                        "methodname": "queryChildGroupsWithSecondRight",
                        "GroupId": node.GROUPID
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), paramsT, "get").then(function(dataC) {
                            node.CHILDREN = dataC.CHILDREN;
                            callback();
                        },
                        function(dataC) {
                            trsconfirm.alertType("错误提示", "获取子组失败", "warning", false, function() {});
                        });
                }
            }
            /**
             * [showSelected description]点击组织树节点
             * @param  {[obj]} node [description]点击的节点
             * @return {[type]}        [description]
             */
            $scope.showSelected = function(node) {
                $scope.GroupId = node.GROUPID;
            };
            /**
             * [getTreeData description]获取树数据
             * @param  {[obj]} params [description]请求参数
             * @param  {[string]} roleid   [description]角色Id非必传
             * @return {[type]}        [description]
             */
            function getTreeData() {
                treeService.queryGroupTreeWithSecondRight().then(function(data) {
                    $scope.data.treeData = [data];
                    ExpandedNodes();
                });
            }

            //默认展开树开始
            function ExpandedNodes() {
                $scope.expandedTest = [];
                $scope.expandedTest.push($scope.data.treeData[0]);
                if ($scope.data.treeData[0].CHILDREN === 0) {
                    $scope.selectedNode = $scope.data.treeData[0];
                    getGroupData($scope.selectedNode);
                } else {
                    angular.forEach($scope.data.treeData[0].CHILDREN, function(data, index, array) {
                        if (data.ISPATH === "true") {
                            $scope.expandedTest.push(data);
                            if (data.CHILDREN.length !== 0) {
                                // selfPath(data);
                            } else {
                                $scope.selectedNode = data;
                                getGroupData($scope.selectedNode);
                            }

                        }
                    });
                }
            }
            //默认展开树结束
            function getGroupData(node) {
                $timeout(function() {
                        //此判断如果两次点击同一个树，不重复加载角色列表。
                        if ($scope.oldSelectNode !== undefined && node.GROUPID == $scope.oldSelectNode.GROUPID) {
                            return;
                        }
                        $scope.groupObj = node;
                        $scope.oldSelectNode = node;
                        $scope.roleDatas = [];
                        $scope.roleData = null;
                        var params = {
                            "serviceid": "mlf_extrole",
                            "methodname": "query",
                            "GroupId": $scope.groupObj.GROUPID
                        };
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            $scope.data.roleDatas = data;
                        }, function(data) {});
                    },
                    100);
            }
            //点击树回调函数开始
            $scope.showSelected = function(node) {
                getGroupData(node);
            };
            //点击树回调函数结束



            //单击列表项效果
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
            //初始化选择列表
            $scope.toRight = function() {
                angular.forEach($scope.data.roleDatas, function(data, index, array) {
                    if (data.selected === "selected") {
                        $scope.data.roleDatas[index].selected = "";
                        $scope.data.selectedRole.push(angular.copy($scope.data.roleDatas[index]));
                    }
                });
            };
            //双击选择开始
            $scope.directlyToRight = function(role) {
                role.selected = "";
                $scope.data.selectedRole.push(angular.copy(role));
            };
            //双击选择结束
            //双击取消选择开始
            $scope.directlyToLeft = function(role) {
                role.selected = "";
                $scope.data.selectedRole.splice($scope.data.selectedRole.indexOf(role), 1);
            };
            //双击取消选择结束
            //选中删除
            $scope.toLeft = function() {
                var i = $scope.data.selectedRole.length - 1;
                while (i >= 0) {
                    if (angular.isDefined($scope.data.selectedRole[i]) && $scope.data.selectedRole[i].selected === "selected") {
                        $scope.data.selectedRole.splice(i, 1);
                    }
                    i--;
                }
            };
            //全选
            $scope.selectedAll = function() {
                $scope.data.selectedRole = [];
                angular.forEach($scope.data.roleDatas, function(data, index, array) {
                    $scope.data.roleDatas[index].selected = "";
                    $scope.data.selectedRole.push(angular.copy($scope.data.roleDatas[index]));
                });
            };

            /**
             * [addGroup description]添加用户组
             */
            $scope.addGroup = function() {
                userManageMentService.chooseGroup(angular.copy($scope.data.groupPaths)).then(function(data) {
                    getGroupPaths(data.groupIds, "/");
                    $scope.data.groupIds = data.groupIds;
                }, function(data) {

                });
            };
            //根据组织IDS获取组织路径
            function getGroupPaths(groupIds, dcim) {
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "getGroupPaths",
                    "GroupIds": groupIds,
                    "dcim": dcim
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    //$scope.data.groupPaths = $filter('unique')($scope.data.groupPaths.concat(data), 'GROUPID');
                    $scope.data.groupPaths = data;
                    $scope.data.oldGroupPaths = angular.copy($scope.data.groupPaths);
                });
            }
            $scope.selectedGroup = function(group) {
                if ($scope.data.selectedGroup.indexOf(group) < 0) {
                    $scope.data.selectedGroup.push(group);
                } else {
                    $scope.data.selectedGroup.splice($scope.data.selectedGroup.indexOf(group), 1);
                }
            };
            /**
             * [delGroups description]用户组织删除
             * @return {[type]} [description]
             */
            /*$scope.delGroups = function() {
                if ($scope.status.UserId > 0) {
                    var params = {
                        serviceid: "mlf_usermanagement",
                        methodname: "deleteUserGroups",
                        UserId: $scope.status.UserId,
                        GroupIds: trsspliceString.spliceString($scope.data.selectedGroup, "GROUPID", ","),
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {});
                }
                for (var i = 0; i < $scope.data.selectedGroup.length; i++) {
                    for (var j = 0; j < $scope.data.groupPaths.length; j++) {
                        if ($scope.data.groupPaths[j].GROUPID === $scope.data.selectedGroup[i].GROUPID) {
                            $scope.data.groupPaths.splice($scope.data.groupPaths.indexOf($scope.data.groupPaths[j]), 1);
                        }
                    }
                }
                $scope.data.selectedGroup = [];
            };*/
            /**
             * [delGroups description]页面删除所属组织
             * @return {[type]} [description]
             */
            $scope.delGroups = function() {
                for (var i = 0; i < $scope.data.selectedGroup.length; i++) {
                    for (var j = 0; j < $scope.data.groupPaths.length; j++) {
                        if ($scope.data.groupPaths[j].GROUPID === $scope.data.selectedGroup[i].GROUPID) {
                            $scope.data.groupPaths.splice($scope.data.groupPaths.indexOf($scope.data.groupPaths[j]), 1);
                        }
                    }
                }
            };

            //取消
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

            /**
             * [getSuggestions description]角色全局搜索
             * @param  {[type]} viewValue [description]
             * @return {[type]}           [description]
             */
            $scope.getSuggestions = function(viewValue) {
                if (viewValue != '') {
                    var searchUsers = {
                        serviceid: "mlf_extrole",
                        methodname: "searchRole",
                        Name: viewValue,
                        IsHasRight:true,
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
            $scope.$watch('searchRoleWord', function(newValue, oldValue) {
                if (angular.isObject(newValue)) {
                    var flag = true;
                    angular.forEach($scope.data.selectedRole, function(data, index, array) {
                        if (data.ROLEID == newValue.ROLEID) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        $scope.isRequest = true;
                        $scope.data.selectedRole.push(newValue);
                    }
                    $scope.searchRoleWord = newValue.ROLENAME;
                }
            });
        }
    ]);
