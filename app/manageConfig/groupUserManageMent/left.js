"use strict";
angular.module('groupManageMentLeftModule', [])
    .controller('groupManageMentLeftCtrl', ['$scope', '$stateParams', '$state', '$timeout', 'treeService', 'trsHttpService', 'trsconfirm', 'trsspliceString', 'trsGroupTreeLocationService', "trsColumnTreeLocationService", function($scope, $stateParams, $state, $timeout, treeService, trsHttpService, trsconfirm, trsspliceString, trsGroupTreeLocationService, trsColumnTreeLocationService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         */
        function initStatus() {
            $scope.status = {
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
                /*batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                searchGroup: "",
                comparator: false,*/
                userStatusOpen: true,
                isGroupNameSearch: false,
                listPattern: 1,
                userStatus: {
                    'open': 30,
                    'disable': 20,
                    'delete': 10,
                },
                currStatus: 'open',
                firstNode: "",
            };
            $scope.data = {};
        }
        /**
         * [initData description]初始化数据
         */
        function initData() {
            getTreeData(true);
            //requestData();
        }
        /**
         * [showToggle description]树展开方法
         * @param  {[obj]} node [description]父节点
         * @return {[type]}        [description]
         */
        $scope.showToggle = function(node) {
            if (node.HASCHILDREN === "false" || (angular.isDefined(node.CHILDREN) && node.CHILDREN.length !== 0))
                return;
            treeService.queryChildGroupsWithSecondRight(node.GROUPID).then(function(data) {
                node.CHILDREN = data.CHILDREN;
            });
        };
        /**
         * [showSelected description]点击组织树节点
         * @param  {[obj]} node [description]点击的节点
         * @return {[type]}        [description]
         */
        $scope.showSelected = function(node) {
            // $state.go($state.current, { gropuid: node.GROUPID }, { reload: $state.current.name });
            var router = positionRouter(node);
            $state.go(router.path, router.params, { reload: router.path });
        };
        /**
         * [positionRouter description:定位路由]
         */
        function positionRouter(node) {
            var router = {
                path: '',
                params: '',
            }
            if ($state.current.url.indexOf('/group') > -1) {
                router.path = 'manageconfig.groupmanage.group';
                router.params = {
                    groupid: node.GROUPID
                }
            } else if ($state.current.url.indexOf('/user') > -1) {
                router.path = 'manageconfig.groupmanage.user';
                router.params = {
                    status: 30,
                    groupid: node.GROUPID,
                }
            }
            return router;
        };
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
                    var params = {
                        "serviceid": "mlf_extrole",
                        "methodname": "query",
                        "GroupId": node.GROUPID
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.groupDatas = data;
                    }, function(data) {
                        trsconfirm.alertType("错误提示", "获取数据失败", "warning", false);
                    });
                },
                100);
        }
        /**
         * [getGroupsByPGroup description]根据当前组织获取子组织列表信息
         * @param  {[obj]} node [description]当前组织节点
         */
        function getGroupsByPGroup(node) {
            $scope.status.isGroupNameSearch = false;

            /*var params = {
                "serviceid": "mlf_groupmanagement",
                "methodname": "getChildrenGroup",
                "PageSize": 20,
                "CurrPage": 1,
                "GroupId": node.GROUPID
            };*/
            $scope.params.GroupId = node.GROUPID;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.groupDatas = data.DATA;
                $scope.page = data.PAGER;
                $scope.data.selectedArray = [];
            });
        }
        /**
         * [requestData description:数据请求方法]
         */
        function requestData() {
            getGroupsByPGroup($scope.selectedNode);
        }
        var promise;
        $scope.getSuggestions = function(groupName) {
            if (promise) {
                $timeout.cancel(promise);
                promise = null;
            }
            promise = $timeout(function() {
                if (groupName !== '') {
                    var params = {
                        serviceid: "mlf_extuser",
                        methodname: "searchGroup",
                        Name: groupName,
                    };
                    if ($scope.status.isRequest) {
                        $scope.status.isRequest = false;
                        return [];
                    } else {
                        return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                            return data;
                        });
                    }
                }
            }, 10);
            return promise;
        };
        /**
         * [description]Suggestion 鐩戝惉Suggestion
         */
        $scope.$watch('status.searchGroup', function(newValue, oldValue, scope) {
            if (angular.isObject(newValue)) {
                $scope.status.isRequest = true;
                locationGroupTree(newValue.GROUPIDS);
                //expandTreeAndSelectNode(newValue.GROUPIDS);
                $scope.status.searchGroup = newValue.GNAME;

            }
        });
        /**
         * [description]goUserStatusList 切换到用户管理左侧
         */
        $scope.goUserStatusList = function() {
            $scope.status.listPattern = 2;
            $scope.status.currStatus = 'open';
            $state.go('manageconfig.groupmanage.user', { 'status': $scope.status.userStatus[$scope.status.currStatus], 'groupid': null });
        };
        /**
         * [description]goGroupManageList 切换到组织管理左侧
         */
        $scope.goGroupManageList = function() {
            $scope.status.listPattern = 1;
            $scope.selectedNode = angular.copy($scope.status.firstNode);
            $state.go("manageconfig.groupmanage.group", { "groupid": $scope.selectedNode.GROUPID });
        };
        /**
         * [description]godifferenceStatusUser 前往不同状态的用户管理
         */
        $scope.godifferenceStatusUser = function(status) {

            // if(status=='undistributed'){ 
            //    $scope.status.currStatus = null;
            //}else{
            $scope.status.currStatus = status;
            //}
            var selectedStatusValue = $scope.status.userStatus[$scope.status.currStatus];
            $state.go('manageconfig.groupmanage.user', { 'status': selectedStatusValue, 'groupid': null }, { reload: 'manageconfig.groupmanage.user' });
        };
        /**
         * [getTreeData description]获取树数据
         * @param  {[obj]} params [description]请求参数
         * @param  {[string]} roleid   [description]角色Id非必传
         * @return {[type]}        [description]
         */
        function getTreeData(isRequest) {
            treeService.queryGroupTreeWithSecondRight().then(function(data) {
                $scope.data.treeData = [data];
                ExpandedNodes();
                if (isRequest) {
                    $scope.selectedNode = $scope.data.treeData[0];
                    $scope.status.firstNode = $scope.data.treeData[0];
                    $state.go("manageconfig.groupmanage.group", { "groupid": !!$stateParams.groupid ? $stateParams.groupid : $scope.selectedNode.GROUPID });
                } else {
                    locationGroupTree($scope.status.gropuIds);
                }
            });
        }
        /**
            定位组织树
        **/
        function locationGroupTree(gropuIds) {
            $scope.expandedTest = [];
            var groupidsArray = gropuIds.split(",");
            groupidsArray.splice(0, 1);
            trsGroupTreeLocationService.groupTreeLocation(groupidsArray, $scope.data.treeData[0], $scope.selectedNode, $scope.expandedTest, function(tree, array, selectedNode) {
                delete $scope.data.treeData;
                $scope.data.treeData = [tree];
                $scope.expandedTest.push($scope.data.treeData[0]);
                $scope.selectedNode = selectedNode;
            });
        }
        //当组织改变后刷新组织列表
        $scope.$on('changeGroupList', function(e, newLocation) {
            var params = {
                serviceid: "mlf_groupmanagement",
                methodname: "getGroupIdsPath",
                GroupId: Number(newLocation),
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.status.gropuIds = data[0].GROUPIDS;
                getTreeData();
            });
        });
    }])
