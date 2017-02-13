"use strict";
/**
 * customMonitor Module
 *
 * Description 子用户管理
 * Author:SMG 2016-5-11
 */
angular.module('gGroupManageMentModule', ['groupManageMentServiceModule']).
controller('gGroupManageMentController', ['$scope', '$timeout', '$filter', '$q', '$state', '$stateParams', '$location', 'treeService', 'trsHttpService', 'trsconfirm', 'trsspliceString', 'trsGroupTreeLocationService', 'groupManageMentService', 'groupUserRightsService', 'localStorageService',
    function($scope, $timeout, $filter, $q, $state, $stateParams, $location, treeService, trsHttpService, trsconfirm, trsspliceString, trsGroupTreeLocationService, groupManageMentService, groupUserRightsService, localStorageService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         */
        function initStatus() {
            $scope.status = {
                /*batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                searchGroup: "",
                comparator: false,*/
                //isGroupNameSearch: false,
                dragStartIndex: '',
                groupStatus: [{
                    name: "全部组织",
                    value: 0,
                }, {
                    name: "隐藏组织",
                    value: 2
                }],
                btnRights: {},
            };
            //$scope.selectedNode = [];
            $scope.data = {
                selectedArray: [], //已选
                keywords: "",
                groups: [],
                parentGroupid: $stateParams.groupid,
                copyCurrPage: 1,
                treeData: [],
                currGroup: {},
                totalCounts: 0,
                initStatus: 30, //初始化状态：30
                userGroupId: localStorageService.get("mlfCachedUser").GroupId,
                rootGroupoID: $stateParams.groupid,
            };
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20,
                "ITEMCOUNT": 0,
            };
        }
        /**
         * [initData description]初始化数据
         */
        function initData() {
            treeService.queryGroupTreeWithSecondRight().then(function(data) {
                $scope.data.treeData = data;
                initDropDown();
                requestData().then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                });
                getGroupDetail();
            });
            groupUserRightsService.initBtnRights('config.group', $stateParams.groupid).then(function(data) {
                $timeout(function() {
                    $scope.status.btnRights[$scope.data.rootGroupoID] = data;
                },500);
            });
        }
        /**
         * [initBtnRights description]获得组织权限
         * @param  {[obj]} item [description]组织信息
         * @return {[null]}      [description]
         */
        $scope.initBtnRights = function(item) {
            groupUserRightsService.initBtnRights('config.group', item.GROUPID).then(function(data) {
                $scope.status.btnRights[item.GROUPID] = data;
            });
        };
        /**
         * [initDropDown description]初始化下拉框
         * @return {[type]} [description]
         */
        function initDropDown() {
            $scope.status.selectedGroupStatus = angular.copy($scope.status.groupStatus[0]);
        }
        /**
         * [initData description]根据groupid获取组织信息
         */
        function getGroupDetail() {
            var params = {
                "serviceid": "mlf_groupmanagement",
                "methodname": "getGroupDetail",
                "GroupId": $stateParams.groupid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.currGroup = data;
            });
        }
        //下一页
        $scope.pageChanged = function() {
            //$scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.data.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };

        //跳转指定页面
        $scope.jumpToPage = function() {
            if ($scope.data.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.data.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.page.CURRPAGE = $scope.data.copyCurrPage;
            requestData();
        };
        /**
         * [selectPageNum description]单页选择分页数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.data.copyCurrPage = 1;
            requestData();
        };
        /**
         * [requestData description:数据请求方法：根据当前组织获取子组织列表信息]
         */
        function requestData() {
            var defer = $q.defer();
            var params = {
                serviceid: "mlf_groupmanagement",
                methodname: "getChildrenGroup",
                CurrPage: $scope.page.CURRPAGE,
                pagesize: $scope.page.PAGESIZE,
                GroupId: $scope.data.parentGroupid ? $scope.data.parentGroupid : $scope.data.treeData.GROUPID,
                IsSearch: $scope.data.keywords == "" ? false : true,
                SearchName: $scope.data.keywords,
                Status: $scope.status.selectedGroupStatus.value,
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.groups = data.DATA || data;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                $scope.data.selectedArray = [];
                timeStamp();
                defer.resolve();
            });
            return defer.promise;
        }
        /**
            将日期字符串转换为时间戳
        **/
        function timeStamp() {
            angular.forEach($scope.groups, function(data, index) {
                if (data.CRTIME != "") {
                    data.CRTIME = new Date(Date.parse(data.CRTIME.replace(/-/g, "/"))).getTime();
                }
            });
        }
        /**
         * [queryDropDown description]根据下拉框查询
         * @return {[type]} [description]null
         */
        $scope.queryDropDown = function() {
            requestData();
        };
        /**
         * [filterGroup description]组织过滤器
         * @param  {[obj]} elm [description]每个组织元素
         * @return {[boolean]}     [description]
         */
        $scope.filterGroup = function(elm) {
            if (angular.isDefined(elm.STATUS)) {
                return elm.STATUS == 2;
            }
        };
        /**
         * [hiddenGroup description]隐藏组织
         * @return {[type]} [description]null
         */
        $scope.hiddenGroup = function(item) {
            trsconfirm.confirmModel("隐藏组织", "是否确认将所选组织隐藏", function() {
                var params = {
                    serviceid: "mlf_groupmanagement",
                    methodname: "hideawayGroup",
                    ParentId: item.PARENTID,
                    GroupIds: item.GROUPID,
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("隐藏成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        };
        /**
         * [restoreGroup description]还原组织
         * @param  {[obj]} item [description]组织信息
         * @return {[type]}      [description]
         */
        $scope.restoreGroup = function(item) {
            trsconfirm.confirmModel("还原组织", "是否确认将所选组织还原", function() {
                var params = {
                    serviceid: "mlf_groupmanagement",
                    methodname: "originalGroup",
                    ParentId: item.PARENTID,
                    GroupIds: item.GROUPID,
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("还原成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        };
        /**
         * [selectAll description:全选]
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.groupDatas.length ? [] : [].concat($scope.groupDatas);
            cancelBatchOperate();
        };

        /**
         * [selectDoc 单选]
         * @param  {[type]} item [description：单个对象] 
         */
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
            cancelBatchOperate();
        };
        /**
         * [cancelBatchOperate description：取消批量操作的样式]
         */
        function cancelBatchOperate() {
            if ($scope.data.selectedArray.length === 0) {
                $scope.status.batchOperateBtn = {
                    "hoverStatus": "",
                    "clickStatus": ""
                };
            }
        }
        /**
         * [newGroup description]新建组织
         */
        $scope.newGroup = function() {
            groupManageMentService.createOrEditGroup("", $scope.data.parentGroupid).then(function(data) {
                $scope.$emit('changeGroup', data);
                requestData().then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                });
            }, function(data) {
                //失败
            });
        };
        /**
         * [editGroupDetail description]修改组织
         */
        $scope.editGroupDetail = function(item) {
            groupManageMentService.createOrEditGroup(item, $scope.data.parentGroupid).then(function(data) {
                requestData();
            }, function(data) {
                //失败
            });
        };

        /**
         * [deleteGroup description]删除组织
         */
        $scope.deleteGroup = function(item) {
            trsconfirm.confirmModel("删除组织", "是否确认将[" + item.GNAME + "]删除", function() {
                var params = {
                    serviceid: "mlf_groupmanagement",
                    methodname: "deleteGroup",
                    GroupIds: item.GROUPID,
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("删除成功", "", "success", false, function() {
                        $scope.$emit('changeGroup', $stateParams.groupid);
                        requestData().then(function() {
                            $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                        });
                    });
                });
            });
        };
        /**
         * [moveGroup description]移动组织
         */
        $scope.moveGroup = function(item) {
            var itemC = {
                fromGroupId: item.GROUPID,
                parentGroupId: item.PARENTID
            };
            groupManageMentService.userMngGroupMngMoveGroup("移动组织", itemC, function(data) {
                $scope.$emit('changeGroup', item.GROUPID);
                requestData().then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                });
            });
        };
        /**
         * [showGroupDetail description]查看组织信息
         */
        $scope.showGroupDetail = function(item) {
            groupManageMentService.showGroupDetail("组织信息", item.GROUPID, function(data) {});
        };
        /**
         * [sortGroup description]列表排序（设置位置）
         */
        $scope.sortGroup = function(item) {
            groupManageMentService.sortGroups("组织---调整顺序", item.GROUPID, $scope.data.parentGroupid, $scope.data.totalCounts, item.GNAME, function(data) {
                $scope.loadingPromise = requestData();
            });
        };
        /**
         * [gotoGroupUsersList description]跳转到当前组织对应的用户列表模块
         */
        $scope.gotoGroupUsersList = function() {
            $state.go("manageconfig.groupmanage.user", { groupid: $scope.data.parentGroupid, status: $scope.data.initStatus }, { reload: "manageconfig.groupmanage.user" });
        };
        /**
         * [gotoUsersList description]跳转到当前组织列表子组织对应的用户列表模块
         */
        $scope.gotoUsersList = function(group) {
            $state.go("manageconfig.groupmanage.user", { groupid: group.GROUPID, status: $scope.data.initStatus }, { reload: "manageconfig.groupmanage.user" });
        };

        /**
         * [userNameSearch description;检索:根据用户真实姓名模糊查询用户列表(全文检索)]
         * @param  {[type]} ev [description:按下空格也能提交]
         */
        $scope.groupNameSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                //queryGroupByGName();
                requestData();
            }
        };
        //根据组织名称查询组织
        /*function queryGroupByGName() {
            var params = {
                serviceid: "mlf_groupmanagement",
                methodname: "searchGNameGroups",
                GroupId: $scope.data.parentGroupid,
                GName: $scope.data.keywords
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.groups = data.DATA;
                $scope.page = data.PAGER;
                $scope.data.selectedArray = [];
                if ($scope.groups.length > 0) {
                    timeStamp();
                }
            });
        }*/
        /**
            将日期字符串转换为时间戳
        **/
        function timeStamp() {
            angular.forEach($scope.groups, function(data, index) {
                if (data.CRTIME != "") {
                    data.CRTIME = new Date(Date.parse(data.CRTIME.replace(/-/g, "/"))).getTime();
                }
            });
        }
        /**
         * [dragoverCallback description;允许拖拽]
         */
        $scope.dragoverCallback = function(event, index, external, type) {
            return true;
        };
        /**
         * [dragStart description;拖拽开始]
         */
        $scope.dragStart = function(event, item, index) {
            $scope.status.dragStartIndex = index;
        };
        /**
         * [dragStdropCallbackart description;拖拽结束]
         */
        $scope.dropCallback = function(event, index, item, external, type, allowedType) {
            if ($scope.status.dragStartIndex == index) return;
            var params = {
                serviceid: 'mlf_groupmanagement',
                methodname: 'sortPositionGroup',
                FromGroupId: $scope.groups[$scope.status.dragStartIndex].GROUPID,
                ToGroupId: $scope.status.dragStartIndex > index ? $scope.groups[index].GROUPID : $scope.groups[index - 1].GROUPID,
                Position: $scope.status.dragStartIndex > index ? 0 : 1,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get');
            $scope.groups.splice($scope.status.dragStartIndex, 1);
            $scope.status.dragStartIndex > index ?
                $scope.groups.splice(index, 0, item) :
                $scope.groups.splice(index - 1, 0, item);
        };
    }
]);
