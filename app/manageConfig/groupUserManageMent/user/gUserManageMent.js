/*
    Create By Chenchen 2015-10-19
*/
'use strict';
angular.module('gUserManageMentModule', ["userManageMentServiceModule", 'groupManageMentModule']).
controller('gUserManageMentController', ['$scope', '$q', '$stateParams', '$location', '$state', 'treeService', 'trsHttpService', 'trsconfirm', 'trsspliceString', 'userManageMentService', 'trsSelectItemByTreeService', 'trsGroupTreeLocationService', 'groupUserRightsService', 'localStorageService',
    function($scope, $q, $stateParams, $location, $state, treeService, trsHttpService, trsconfirm, trsspliceString, userManageMentService, trsSelectItemByTreeService, trsGroupTreeLocationService, groupUserRightsService, localStorageService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         */
        function initStatus() {
            $scope.status = {
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                searchGroup: "",
                //comparator: false,
                //isUserNameSearch: false,
                dragStartIndex: '',
                btnRights: [],
            };
            //$scope.selectedNode = [];
            $scope.data = {
                selectedArray: [], //已选
                keywords: "",
                copyCurrPage: 1,
                parentGroupid: $stateParams.groupid ? $stateParams.groupid : null,
                currStatus: $stateParams.status ? $stateParams.status : null,
                currGroup: {},
                totalCounts: 0,
                userGroupId: localStorageService.get("mlfCachedUser").GroupId,
            };
            //初始化用户状态
            $scope.userStatus = {
                30: '已开通',
                20: '已停用',
                10: '已删除'
            };
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20,
                "ITEMCOUNT": 0
            };
            $scope.rightsClassify = {
                30: "user.open",
                20: "user.disable",
                10: "user.delete",
            };
            /*$scope.params = {
                serviceid: "mlf_usermanagement",
                methodname: "queryUsers",
                CurrPage: $scope.page.CURRPAGE,
                pagesize: $scope.page.PAGESIZE,
            };*/
        }
        /**
         * [initData description]初始化数据
         */
        function initData() {
            initDropDown();
            treeService.queryGroupTreeWithSecondRight().then(function(data) {
                //!!$scope.data.parentGroupid ? $scope.data.parentGroupid = $scope.data.parentGroupid : $scope.data.parentGroupid = data.GROUPID;
                //requestData();
                /*var modalInstance = requestData();
                modalInstance.then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                    console.log($scope.data.totalCounts + "====" + $scope.page.ITEMCOUNT);
                }, function() {});*/
                requestData().then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                });
                /*getUsersList().then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                });*/
                if (angular.isDefined($stateParams.groupid)) { //有组织id时，获取组织信息(组织名称)
                    queryGroupByGroupId();
                    //获得用户权限
                    groupUserRightsService.initBtnRights('config.user', $stateParams.groupid).then(function(data) {
                        $scope.status.btnRights = data;
                    });
                } else {
                    var params = angular.isDefined($stateParams.status) ? $scope.rightsClassify[$stateParams.status] : "user.undistributed";
                    groupUserRightsService.initUserBtnRights(params).then(function(data) {
                        $scope.status.btnRights = data;
                    });
                }
            });
        }
        /**
         * [createUser description]新建用户
         */
        $scope.newUser = function() {
            userManageMentService.createOrEditUser("", "userInfo").then(function(data) {
                requestData().then(function() {
                    $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                });
            }, function(data) {
                //失败
            });
        };
        /**
         * [addUsers description]添加用户
         */
        $scope.addUsers = function() {
            trsSelectItemByTreeService.getUser(function(data) {
                var params = {
                    "serviceid": "mlf_groupmanagement",
                    "methodname": "addUsersToGroup",
                    "UserIds": trsspliceString.spliceString(data, "ID", ","),
                    "GroupId": $scope.data.parentGroupid

                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("添加用户成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        };
        /**
         * [removeUsers description]移除用户
         */
        $scope.removeUsers = function() {
            var alertContent = "是否确认移除选中的用户";
            trsconfirm.confirmModel("移除用户", alertContent, function() {
                var params = {
                    serviceid: "mlf_groupmanagement",
                    methodname: "removeGroupUsers",
                    GroupId: $scope.data.parentGroupid,
                    UserIds: trsspliceString.spliceString($scope.data.selectedArray, "USERID", ",")
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("移除成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        };
        /**
         * [editUser description]编辑用户
         */
        $scope.editUser = function(item, type) {
            userManageMentService.createOrEditUser(item.USERID, type).then(function(data) {
                requestData();
            }, function(data) {
                //失败
            });
        };

        /**
         * [userMapping description]用户映射
         */
        $scope.userMap = function(item) {
            userManageMentService.userMapping("用户映射", function(data) {
                $scope.loadingPromise = requestData();
            });
        };
        /**
         * [queryGroupByGroupId description]根据groupid获取组织信息
         */
        function queryGroupByGroupId() {
            var params = {
                "serviceid": "mlf_groupmanagement",
                "methodname": "getGroupDetail",
                "GroupId": $stateParams.groupid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.currGroup = data;
            });
        }
        /**
         * [initDropDown description]初始化下拉菜单
         */
        function initDropDown() {
            /*左侧组织导航树：检索*/
            /*$scope.status.searchOptions = [{
                name: "用户",
                value: "user"
            }];
            $scope.status.searchSelected = angular.copy($scope.status.searchOptions[0]);
            */
            /*筛选（状态）：检索*/
            $scope.status.searchStatusOptions = [{
                name: "已开通",
                value: 30
            }, {
                name: "已停用",
                value: 20
            }, {
                name: "已删除",
                value: 10
            }];
            initUserStatusSelected();
        }
        //初始化下拉框选中"已开通",未分配置空
        function initUserStatusSelected() {
            $scope.status.searchStatusSelected = angular.copy($scope.status.searchStatusOptions[0]);
            $scope.status.searchStatusSelected.value = angular.isDefined($stateParams.status) ? $stateParams.status : "";
        }
        /**
         * [queryByDropdown description] 筛选条件触发后请求数据
         * @param  {[type]} key   [description] 请求对象参数key
         * @param  {[type]} value [description] 请求对象值
         * @return {[type]}       [description] null
         */
        $scope.queryByDropdown = function(key, selected) {
            var params = {
                serviceid: "mlf_usermanagement",
                methodname: "searchGroupUsers",
                GroupId: $scope.data.parentGroupid,
                Status: selected.value
            };
            $scope.data.keywords = "";
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.users = data.DATA;
                $scope.page = data.PAGER;
                if ($scope.users.length > 0) {
                    timeStamp();
                }
            });
        };

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
         * [selectPageNum description]单页选择分页个数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.data.copyCurrPage = 1;
            requestData();
        };
        /**
         * [requestData description:数据请求方法：根据当前组织获取用户列表信息]
         */
        /*function getUsersList() {
            
        }*/
        function requestData() {
            var defer = $q.defer();
            var params = {
                "serviceid": "mlf_usermanagement",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "TrueName": $scope.data.keywords
            };
            params.Status = $location.search().status ? $location.search().status : $scope.status.searchStatusSelected.value;
            if ($scope.data.parentGroupid != null) {
                params.GroupId = $scope.data.parentGroupid;
                if (params.Status == 10) { //当前组织已删除用户列表
                    params.methodname = "getGroupDelUsers";
                } else if (params.Status == 20) { //当前组织已停用用户列表
                    params.methodname = "getGroupStoppedUsers";
                } else { //当前组织已开通用户列表
                    params.methodname = "getGroupHasClearedUsers";
                }
            } else {
                if (params.Status == 10) { //用户管理：已删除用户列表
                    params.methodname = "getDelUsers";
                } else if (params.Status == 20) { //用户管理：已停用用户列表
                    params.methodname = "getStoppedUsers";
                } else if (params.Status == 30) { //用户管理：已开通用户列表
                    params.methodname = "getHasClearedUsers";
                } else { //未分配的用户
                    params.methodname = "getForAllocationUsers";
                }
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.users = data.DATA;
                $scope.page = data.PAGER;
                initUserStatusSelected();
                $scope.data.selectedArray = [];
                if ($scope.users.length > 0) {
                    timeStamp();
                }
                defer.resolve();
            });
            return defer.promise;
        }
        /**
            将日期字符串转换为时间戳
        **/
        function timeStamp() {
            angular.forEach($scope.users, function(data, index) {
                if (data.CRTIME != "") {
                    data.CRTIME = new Date(Date.parse(data.CRTIME.replace(/-/g, "/"))).getTime();
                }
                if (data.REGTIME != "") {
                    data.REGTIME = new Date(Date.parse(data.REGTIME.replace(/-/g, "/"))).getTime();
                }
            });
        }
        /**
         * [determineSelected description] 判断是否有选中稿件
         */
        function determineUserSelected() {
            if (!$scope.data.selectedArray.length) {
                trsconfirm.alertType("请先选择用户！", "", "error", false, "");
                return false;
            } else {
                return true;
            }
        }
        /**
         * [deleteUsers description]批量（单个）删除用户
         */
        $scope.deleteUsers = function() {
            var alertContent = "是否确认将这些用户删除";
            if ($scope.data.selectedArray.length == 1) {
                alertContent = "是否确认将当前选中的用户删除";
            }
            trsconfirm.confirmModel("删除用户", alertContent, function() {
                var params = {
                    serviceid: "mlf_usermanagement",
                    methodname: "noAssignedDeleteUsers", //未分配批量删除用户
                    UserIds: trsspliceString.spliceString($scope.data.selectedArray, "USERID", ",")
                };

                //已开通批量删除用户
                if ($scope.data.currStatus != null) {
                    params.methodname = "clearcDeleteUsers";
                }

                //删除组织中的用户
                if ($scope.data.parentGroupid != null) {
                    params.methodname = "deleteGroupUsers";
                    params.GroupId = $scope.data.parentGroupid;
                }

                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("删除成功", "", "success", false, function() {
                        //requestData();
                        requestData().then(function() {
                            $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                        });
                    });
                });
            });
        };
        /**
         * [selectAll description:全选]
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.users.length ? [] : [].concat($scope.users);
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
         * [resetPassword description]重置密码
         */
        $scope.resetPassword = function() {
            userManageMentService.resetPwd("重置密码", trsspliceString.spliceString($scope.data.selectedArray, "USERID", ","), /*$scope.data.parentGroupid,*/ function(data) {
                $scope.loadingPromise = requestData();
            });
        };

        /**
         * [moveUser description]移动用户
         */
        $scope.moveUser = function() {
            userManageMentService.moveUser($scope.data.parentGroupid, trsspliceString.spliceString($scope.data.selectedArray, "USERID", ","), "move").then(function(data) {
                requestData();
            }, function(data) {

            });
        };
        /**
         * [addUsersToGroup description]（未分配用户）添加到组织
         */
        $scope.addUsersToGroup = function() {
            userManageMentService.moveUser("", trsspliceString.spliceString($scope.data.selectedArray, "USERID", ","), "add").then(function(data) {
                requestData();
            }, function(data) {

            });
        };
        /**
         * [disableUser description]停用用户
         */
        $scope.disableUser = function() {
            var alertContent = "是否确认将这些用户停用";
            if ($scope.data.selectedArray.length == 1) {
                alertContent = "是否确认将当前选中的用户停用";
            }
            trsconfirm.confirmModel("停用用户", alertContent, function() {
                var params = {
                    serviceid: "mlf_usermanagement",
                    methodname: "noAssignedDisable", //未分配停用用户
                    UserIds: trsspliceString.spliceString($scope.data.selectedArray, "USERID", ",")
                };
                //已开通停用用户
                if ($scope.data.currStatus != null) {
                    params.methodname = "clearcDisable";
                }
                //停用组织用户
                if ($scope.data.parentGroupid != null) {
                    params.methodname = "disableGroupUser";
                    params.GroupId = $scope.data.parentGroupid;
                }

                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("用户停用成功", "", "success", false, function() {
                        //requestData();
                        requestData().then(function() {
                            $scope.data.totalCounts = angular.copy($scope.page.ITEMCOUNT);
                        });
                    });
                });
            });
        };
        /**
         * [reStartUser description]启用用户
         */
        $scope.reStartUser = function() {
            var alertContent = "是否确认将这些用户重新启用";
            if ($scope.data.selectedArray.length == 1) {
                alertContent = "是否确认将当前选中的用户重新启用";
            }
            trsconfirm.confirmModel("启用用户", alertContent, function() {
                var params = {
                    serviceid: "mlf_usermanagement",
                    methodname: "noAssignedEnable", //未分配启用用户
                    UserIds: trsspliceString.spliceString($scope.data.selectedArray, "USERID", ",")
                };
                //已停用启用用户
                if ($scope.data.currStatus != null) {
                    params.methodname = "clearcEnable";
                }
                //启用组织用户
                if ($scope.data.parentGroupid != null) {
                    params.methodname = "enableGroupUser";
                    params.GroupId = $scope.data.parentGroupid;
                }

                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("用户启用成功", "", "success", false, function() {
                        initUserStatusSelected();
                        requestData();
                    });
                });
            });
        };
        /**
         * [recoveryUser description]恢复用户
         */
        $scope.recoveryUser = function() {
            var alertContent = "是否确认将这些用户恢复";
            if ($scope.data.selectedArray.length == 1) {
                alertContent = "是否确认将当前选中的用户恢复";
            }
            trsconfirm.confirmModel("恢复用户", alertContent, function() {
                var params = {
                    serviceid: "mlf_usermanagement",
                    methodname: "noAssignedRestoreUser", //未分配恢复用户
                    UserIds: trsspliceString.spliceString($scope.data.selectedArray, "USERID", ",")
                };
                //已删除恢复用户
                if ($scope.data.currStatus != null) {
                    params.methodname = "clearcRestoreUser";
                }
                //恢复组织用户
                if ($scope.data.parentGroupid != null) {
                    params.methodname = "restoreGroupUser";
                    params.GroupId = $scope.data.parentGroupid;
                }

                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("用户恢复成功", "", "success", false, function() {
                        initUserStatusSelected();
                        requestData();
                    });
                });
            });
        };
        /**
         * [importUser description]导入用户
         */
        $scope.importUser = function() {
            trsconfirm.confirmModel("导入用户", "是否需要从HR系统导入用户数据", function() {
                importUsers();
            });
        };
        /**
         * [importUsers description]导入用户
         * @return {[type]} [description]
         */
        function importUsers() {
            userManageMentService.importUsers("导入用户", $scope.data.parentGroupid, function(data) {
                $scope.loadingPromise = requestData();
            });
        }
        /**
         * [userNameSearch description;检索:根据用户真实姓名模糊查询用户列表(全文检索)]
         * @param  {[type]} ev [description:按下空格也能提交]
         */
        $scope.userNameSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                //getUsersList();
                requestData();
            }
        };
        /**
         * [sortUser description]列表排序（设置位置）
         */
        $scope.sortUser = function(item) {
            userManageMentService.sortUsers("用户---调整顺序", item, $scope.data.totalCounts, $scope.status.searchStatusSelected.value, function(data) {
                $scope.loadingPromise = requestData();
            });
        };
        /**
         * [showUserDetail description]查看用户详细信息
         */
        $scope.showUserDetail = function(item) {
            userManageMentService.showUserDetail("用户详细信息", item.USERID, function(data) {});
        };

        $scope.goGroupState = function() {
            $state.go("manageconfig.groupmanage.group", { groupid: $scope.data.parentGroupid }, { reload: "manageconfig.groupmanage.group" });
        };
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
                serviceid: 'mlf_usermanagement',
                methodname: 'sortPositionUser',
                FromUserId: $scope.users[$scope.status.dragStartIndex].USERID,
                ToUserId: $scope.status.dragStartIndex > index ? $scope.users[index].USERID : $scope.users[index - 1].USERID,
                Position: $scope.status.dragStartIndex > index ? 0 : 1,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get');
            $scope.users.splice($scope.status.dragStartIndex, 1);
            $scope.status.dragStartIndex > index ?
                $scope.users.splice(index, 0, item) :
                $scope.users.splice(index - 1, 0, item);
        };
    }
]);
