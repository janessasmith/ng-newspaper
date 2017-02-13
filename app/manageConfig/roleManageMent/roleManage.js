    "use strict";
    angular.module('roleManageModule', [
            'manageCfg.roleManageMent.permissionAssignment.serviceModule',
            'manageCfg.roleManageMent.editorcreateRole',
            'manageCfg.roleManageMent.permissionAssignment',
            'manageCfg.roleManageMent.userManageMentaddUser',
            'manageCfg.roleManageMent.permissionAssignment.resourceCenter',
            'trsAddFooterModule',
            'manageCfg.roleManageMent.newRoteModule',
            'trsLimitToModule',
            'trsPermissionAssignmentDirectve'
        ])
        .controller("roleManageMentCtrl", ['$scope', '$timeout', '$q', '$modal', '$compile', "$state", "trsHttpService", "SweetAlert", "trsconfirm", "manageConfigPermissionService", '$http', '$templateCache', "globleParamsSet", function($scope, $timeout, $q, $modal, $compile, $state, trsHttpService, SweetAlert, trsconfirm, manageConfigPermissionService, $http, $templateCache, globleParamsSet) {
            initStatus();
            $scope.showToggle = function(node) {
                if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
                    var paramsT = {
                        "serviceid": "mlf_group",
                        "methodname": "queryChildGroupsWithSecondRight", //"queryChildGroupsForGroupUserMgr",
                        "GroupId": node.GROUPID
                    };
                    trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                        node.CHILDREN = dataC.CHILDREN;
                        ExpandedEmptyNodes(node);
                    });
                }
            };
            //点击树回调函数开始
            $scope.showSelected = function(node) {
                $scope.status.isSystemRole = false;
                $scope.status.operatingAuthority = {};
                //清楚按钮选中状态
                $scope.buttons=[false,false,false,false];
                getGroupData(node);
                getOperatingAuthority(node).then(function(data) {
                    for (var i in data) {
                        if (i === "add") {
                            $scope.status.operatingAuthority[i] = data[i];
                        }
                    }
                });
            };
            //点击树回调函数结束
            //初始化导航树数据开始
            var params = {
                "serviceid": "mlf_group",
                "methodname": "queryGroupTreeWithSecondRight" //"queryGroupTreeWithMyPath",
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.dataForTheTree = [data];
                //默认展开树操作开始
                ExpandedNodes();
                //默认展开树操作结束
            });
            //初始化导航树数据结束
            //监控更改分组成功开始
            $scope.$on("changeGroup", function(event, data) {
                var params = {
                    "serviceid": "mlf_extrole",
                    "methodname": "query",
                    "GroupId": $scope.groupObj.GROUPID
                };
                //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(dataC) {
                    $scope.roleDatas = dataC;
                });
            });
            //监控更改分组成功结束
            //监控保存角色开始
            $scope.$on("saveRole", function(event, data) {
                for (var i = 0; i < $scope.roleDatas.length; i++) {
                    if (data.ROLEID === $scope.roleDatas[i].ROLEID) {
                        $scope.roleDatas[i] = data;
                    }
                }
                $scope.roleData = data;
            });
            //监控保存角色结束
            /*$http.get("manageConfig/data/group.json").success(function(data) {
                $scope.dataForTheTree = data;
            });*/
            //调用获取组织树的服务结束
            //创建角色按钮开始
            $scope.createRole = function() {
                if (angular.isUndefined($scope.groupObj)) {
                    SweetAlert.swal({
                        title: "请选择组织",
                        type: "warning"
                    });
                    return;
                }
                $modal.open({
                    templateUrl: "./manageConfig/roleManageMent/addRole/addRole_tpl.html",
                    scope: $scope,
                    windowClass: 'new-role-window',
                    backdrop: false,
                    controller: "addRoleModuleCtrl"
                });
            };
            //创建角色按钮结束
            //选择角色功能开始
            $scope.selectRole = function(obj, roleData) {
                //$state.go("manageconfig.rolemanage");
                $(obj.target).parent().parent().siblings().removeClass("manage-role-selected").addClass("manage-role-select");
                $(obj.target).parent().parent().removeClass("manage-role-select").addClass("manage-role-selected");
                $scope.$broadcast("roleData", roleData);
                //console.log(roleData);
                $scope.roleData = roleData;
                if (roleData.ROLEID === "1" || roleData.ROLEID === '2') {
                    $scope.status.operatingAuthority = {};
                    return;
                }
                getRealGroupObj(roleData.ROLEID).then(function(data) {
                    $scope.realGroupObj = data;
                    getOperatingAuthority(data).then(function(data) {
                        for (var i in data) {
                            if (i !== "add") {
                                $scope.status.operatingAuthority[i] = data[i];
                            }
                        }
                    });
                });
            };
            //选择角色功能结束
            //主页面头部切换开始
            $scope.selectModule = function(obj) {
                $(obj.target).addClass("manage-head-tabSelected").siblings().removeClass("manage-head-tabSelected");
            };
            //主页面头部切换结束
            //编辑角色按钮开始
            $scope.editRole = function() {
                $scope.buttons = [false, false, false, false];
                $scope.buttons[1] = [true, false, false, false];
                if ($scope.roleData === undefined || $scope.roleData === null) {
                    SweetAlert.swal({
                        title: "错误提示",
                        text: "请先选择角色！",
                        type: "info",
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    $state.go("manageconfig.rolemanage.editorcreaterole", {
                        "type": "edit"
                    });
                }
            };
            //编辑角色按钮结束
            //获取系统角色开始
            $scope.systemRole = function() {
                $scope.status.operatingAuthority = {};
                $scope.buttons = [false, false, false, false];
                $scope.buttons[4] = [true, false, false, true];
                $scope.status.isSystemRole = true;
                //取消右边树选择
                $state.go("manageconfig.rolemanage");
                delete $scope.roleData;
                delete $scope.selectedNode;
                delete $scope.groupObj;
                delete $scope.oldSelectNode;
                //取消右边树选择结束
                $scope.roleDatas = [{
                    "ROLEID": "1",
                    "ROLENAME": "Administrator",
                    "ROLEDESC": "Administrator"
                }, {
                    "ROLEID": "2",
                    "ROLENAME": "Everyone",
                    "ROLEDESC": "Everyone"
                }];
            };
            //获取系统角色结束
            //添加用户按钮开始
            $scope.addUser = function() {
                $scope.buttons = [false, false, false, false];
                $scope.buttons[3] = [false, false, true, false];
                if ($scope.roleData === undefined || $scope.roleData === null) {
                    SweetAlert.swal({
                        title: "错误提示",
                        text: "请先选择角色！",
                        type: "info",
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    $state.go("manageconfig.rolemanage.adduser");
                }
            };
            //添加用户按钮结束
            //权限分配按钮开始
            $scope.rightAssign = function() {
                $scope.buttons = [false, false, false, false];
                $scope.buttons[2] = [false, true, false, false];
                if ($scope.roleData === undefined || $scope.roleData === null) {
                    SweetAlert.swal({
                        title: "错误提示",
                        text: "请先选择角色！",
                        type: "info",
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    $state.go("manageconfig.rolemanage.permissionassignment.default");
                }
            };
            //权限分配按钮结束
            //
            $scope.limitInput = function() {
                if (!angular.isUndefined($scope.roleSearch)) {
                    $scope.roleSearch = $scope.roleSearch.length > 16 ? $scope.roleSearch.substr(0, 16) : $scope.roleSearch;
                }
            };
            //删除角色
            $scope.deleteRole = function(roleID, roleDesc) {
                /*截取字符串*/
                if (roleDesc.length >= 18) {
                    roleDesc = roleDesc.substr(0, 3) + '...';
                }
                if (roleID == 1) {

                    SweetAlert.swal({
                        title: "错误提示",
                        text: "该角色不能删除",
                        type: "info",
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    var DeleteRpleparams = {
                        "serviceid": "mlf_extrole",
                        "methodname": "delete",
                        "ObjectIds": roleID
                    };
                    trsconfirm.confirmModel("您确定要删除该角色？", "您确定要删除该角色？", function() {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), DeleteRpleparams, "post")
                            .then(function(data) {
                                var params = {
                                    "serviceid": "mlf_extrole",
                                    "methodname": "query",
                                    "GroupId": $scope.groupObj.GROUPID
                                };
                                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                                    $scope.roleDatas = data;
                                });
                            });
                    });
                }
            };
            /*字数限制*/
            $scope.roleNameNum = 18;
            //默认展开树开始
            function ExpandedNodes() {
                $scope.expandedTest = [];
                $scope.expandedTest.push($scope.dataForTheTree[0]);
                /*if ($scope.dataForTheTree[0].CHILDREN === 0) {
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
                }*/
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
                        $state.go("manageconfig.rolemanage");
                        $scope.roleDatas = [];
                        $scope.roleData = null;
                        var params = {
                            "serviceid": "mlf_extrole",
                            "methodname": "query",
                            "GroupId": $scope.groupObj.GROUPID
                        };
                        //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                        $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                            $scope.roleDatas = data;
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
            //无子节点的节点默认展开开始
            function ExpandedEmptyNodes(node) {
                return;
                var arrayB = [];
                angular.forEach(node.CHILDREN, function(data, index, array) {
                    if (data.HASCHILDREN == "false") {
                        arrayB.push(data);
                    }
                });
                $scope.expandedTest = $scope.expandedTest.concat(arrayB);
                /*var expandedTest = angular.copy($scope.expandedTest);
                $scope.expandedTest = [];
                $timeout(function(){
                    $scope.expandedTest = expandedTest;
                });*/
            }
            //无子节点的节点默认展开结束
            function initStatus() {
                $scope.buttons = [false, false, false, false];
                $scope.status = {
                    isSystemUser: false, //当前登录用户是否是系统管理员
                    isSystemRole: false, //选中角色是否是系统角色
                    operatingAuthority: {} //对角色的操作权限。
                };
                //调用获取组织树的服务开始
                //判断是否有选择组织，没有选择回退开始
                if ($scope.groupObj === undefined) {
                    $state.go("manageconfig.rolemanage");
                }
                //判断是否有选择组织，没有选择回退结束
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
                        labelSelected: "rolegrouplabselected"
                    },
                    isLeaf: function(node) {
                        return node.HASCHILDREN === "false";
                    },
                    isSelectable: function(node) {
                        return node.HASRIGHT === "true";
                    }
                };
                //树配置结束
                isAdministrator();

            }
            //判断当前用户是否是系统管理员开始
            function isAdministrator() {
                manageConfigPermissionService.isAdministrator().then(function(data) {
                    $scope.status.isSystemUser = data;
                });
            }
            //判断当前用户是否是系统管理员结束
            /**
             * [initStatus ] 获取当前用户对指定组织的角色的操作权限
             * @return {[type]} [description] null
             */
            function getOperatingAuthority(group) {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryGroupOperKey",
                    GroupId: group.GROUPID,
                    OperType: "config.role"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(
                    function(data) {
                        deffer.resolve(globleParamsSet.handlePermissionData(data).role);
                    });
                return deffer.promise;
            }
            /**
             * [initStatus getRealGroupObj] 精确查询角色所在组织
             * @return {[type]} [description] obj
             */
            function getRealGroupObj(roleId) {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_extrole",
                    methodname: "getGroupOfRole",
                    RoleId: roleId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        deffer.resolve(data);
                    });
                return deffer.promise;
            }
        }]);
