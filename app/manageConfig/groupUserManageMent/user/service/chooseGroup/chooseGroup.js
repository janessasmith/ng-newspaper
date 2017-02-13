/*
    Create by BaiZhiming 2015-12-15
*/
'use strict';
angular.module("chooseGroupModule", [])
    .controller("chooseGroupCtrl", ["$scope", "$timeout", "$modalInstance", "trsHttpService", "trsspliceString", "treeService", "userManageMentService", "chooseGroupInfo", function($scope, $timeout, $modalInstance, trsHttpService, trsspliceString, treeService, userManageMentService, chooseGroupInfo) {
        initStatus();
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.close({
                groupIds: trsspliceString.spliceString($scope.selectedGroups, "GROUPID", ",")
            });
        };

        function initStatus() {
            // $scope.selectedGroups =chooseGroupInfo;
            //模态框标题初始化
            $scope.modalTitle = "添加用户组";
            //初始化选中栏目集合
            $scope.selectedGroups = [];
            if (chooseGroupInfo.groupPaths != "") {
                if (chooseGroupInfo.groupPaths.length >= 1) {
                    for (var i = 0; i < chooseGroupInfo.groupPaths.length; i++) {
                        chooseGroupInfo.groupPaths[i].GNAME = angular.isDefined(chooseGroupInfo.groupPaths[i].GNAME) ? chooseGroupInfo.groupPaths[i].GNAME.split('/').pop() : chooseGroupInfo.groupPaths[i].GROUPPATHS.split('/').pop(); //组织全路径
                    }
                }
            }
            $scope.selectedGroups = chooseGroupInfo.groupPaths;
            $scope.status = {
                ifExpand: true,
                userGroup: "用户所属组织",
                treeOptions: {
                    nodeChildren: "CHILDREN",
                    dirSelectable: true,
                    allowDeselect: false,
                    injectClasses: {
                        ul: "copyDraftTree-ul",
                        li: "copyDraftTree-li",
                        liSelected: "a7",
                        iExpanded: "a3",
                        iCollapsed: "a4",
                        iLeaf: "a5",
                        label: "copyDraftTree-label",
                        labelSelected: "rolegrouplabselected"
                    },
                    isLeaf: function(node) {
                            return node.HASCHILDREN === "false";
                        }
                        /*,
                                            isSelectable: function(node) {
                                                return node.HASRIGHT === "true";
                                            }*/
                }
            };
            $scope.data = {};
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
        /*$scope.showSelected = function(node) {
            $scope.GroupId = node.GROUPID;
        };*/

        /**
         * [initData description]初始化数据
         */
        function initData() {
            getTreeData();
        }
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
                            selfPath(data);
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
                    /*if ($scope.oldSelectNode !== undefined && node.GROUPID == $scope.oldSelectNode.GROUPID) {
                        return;
                    }*/
                    $scope.groupObj = node;
                    $scope.oldSelectNode = node;
                    /*$scope.roleDatas = [];
                    $scope.roleData = null;
                    var params = {
                        "serviceid": "mlf_extrole",
                        "methodname": "query",
                        "GroupId": $scope.groupObj.GROUPID
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.data.roleDatas = data;
                    }, function(data) {
                        trsconfirm.alertType("错误提示", "获取子组失败", "warning", false, function() {});
                    });*/
                },
                100);
        }

        //点击树回调函数开始
        $scope.showSelected = function(node) {
            getGroupData(node);
        };
        //点击树回调函数结束



        //判断是否选中
        $scope.ifSelected = function(node) {
            var flag = false;
            for (var i = 0; i < $scope.selectedGroups.length; i++) {
                if (node.GROUPID === $scope.selectedGroups[i].GROUPID) {
                    $scope.selectedGroups[i].selected = true;
                    node.selected = true;
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        //判断是否选中
        $scope.chooseGroup = function(node) {
            node.selected = node.selected === undefined || node.selected === false ? true : false;
            if (node.selected) {
                $scope.selectedGroups.push(node);
            } else {
                cancelGroup(node);
            }
        };

        function cancelGroup(group) {
            angular.forEach($scope.selectedGroups, function(data, index, array) {
                if (data.GROUPID === group.GROUPID) {
                    $scope.selectedGroups[index].selected = false;
                    $scope.selectedGroups.splice(index, 1);
                }
            });
        }

        $scope.cancelGroup = function(group) {
            cancelGroup(group);
        };
    }]);
