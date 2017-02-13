/*
    Create By BaiZhiming 2016-04-21
    用户管理相关服务
*/
'use strict';
angular.module("groupManageMentServiceModule", ["userMngGroupMngCreateGroupModule", "groupDetailModule", "userMngGroupMngSortGroupModule","userMngGroupMngMoveGroupModule"])
    .factory("groupManageMentService", ["$modal", '$q', function($modal, $q) {
        return {
            //新建or编辑组织
            createOrEditGroup: function(group,parentid) {
                var defer = $q.defer();
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/group/service/createGroup/createGroup_tpl.html",
                    windowClass: 'userManageMent-userMngGroupMngCreateGroup-window',
                    backdrop: false,
                    controller: "userMngGroupMngCreateGroupCtrl",
                    resolve: {
                        group: function() {
                            return group;
                        },
                        parentid: function() {
                            return parentid;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    defer.resolve(result);
                }, function() {
                    defer.reject("cancle");
                });
                return defer.promise;
            },
            //查看组织详细信息
            showGroupDetail: function(modalTitle, GroupId, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/group/service/groupDetail/groupDetail_tpl.html",
                    windowClass: 'userManageMent-groupDetail-window',
                    backdrop: false,
                    controller: "groupDetailCtrl",
                    resolve: {
                        groupDetailInfo: function() {
                            var groupDetailInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                GroupId: GroupId
                            }
                            return groupDetailInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //列表排序（设置位置）
            sortGroups: function(modalTitle, GroupId, ParentId, itemcount, GName, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/group/service/sortGroup/sortGroup_tpl.html",
                    windowClass: 'userManageMent-sortGroup-window',
                    backdrop: false,
                    controller: "userMngGroupMngSortGroupCtrl",
                    resolve: {
                        sortGroupInfo: function() {
                            var sortGroupInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                GroupId: GroupId,
                                ParentId: ParentId,
                                itemcount: itemcount,
                                GName: GName
                            }
                            return sortGroupInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //移动组织
            userMngGroupMngMoveGroup: function(modalTitle, item, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/group/service/moveGroup/moveGroup_tpl.html",
                    windowClass: 'userManageMent-userMngGroupMngMoveGroup-window',
                    backdrop: false,
                    controller: "userMngGroupMngMoveGroupCtrl",
                    resolve: {
                        moveGroupInfo: function() {
                            var moveGroupInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                fromGroupId: item.fromGroupId, //需要移动的组织ids
                                parentGroupId:item.parentGroupId
                            };
                            return moveGroupInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            }
        };
    }]);
