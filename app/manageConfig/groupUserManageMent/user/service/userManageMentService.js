/*
    Create By BaiZhiming 2016-04-21
    用户管理相关服务
*/
'use strict';
angular.module("userManageMentServiceModule", ["createUserModule", "chooseGroupModule", "resetPwdModule", "moveUserModule", "userMappingModule", "sortUsersModule", "userDetailModule", "importUserModule"])
    .factory("userManageMentService", ["$modal", "$q", function($modal, $q) {
        return {
            //新建or编辑用户
            createOrEditUser: function(userid, whichTabShow) {
                var defer = $q.defer();
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/createUser/createUser_tpl.html",
                    windowClass: 'userManageMent-createUser-window',
                    backdrop: false,
                    controller: "createUserCtrl",
                    resolve: {
                        userid: function() {
                            return userid;
                        },
                        whichTabShow: function() {
                            return whichTabShow;
                        }
                    }
                });
                /*modalInstance.result.then(function(result) {
                   defer.resolve(result);
                });*/
                modalInstance.result.then(function(result) {
                    defer.resolve("commit");
                }, function() {
                    defer.reject("cancle");
                });
                return defer.promise;
            },
            /*
            addUsersToGroup:function(userids){
                var modalInstance = $modal.open({
                    templateUrl:"",
                    windowClass:"",

                });
            },*/
            //添加用户组
            chooseGroup: function(groupPaths) {
                var defer = $q.defer(); 
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/chooseGroup/chooseGroup_tpl.html",
                    windowClass: 'userManageMent-chooseGroup-window',
                    backdrop: false,
                    controller: "chooseGroupCtrl",
                    resolve: {
                        chooseGroupInfo: function() {
                            var chooseGroupInfo = {
                                groupPaths: groupPaths, //新建修改用户时groupPaths
                            };
                            return chooseGroupInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    defer.resolve(result);
                },function(){
                    defer.reject("cancel");
                });
                return defer.promise;
            },
            //重置密码
            resetPwd: function(modalTitle, UserIds, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/resetPwd/resetPwd_tpl.html",
                    windowClass: 'userManageMent-resetPwd-window',
                    backdrop: false,
                    controller: "resetPwdCtrl",
                    resolve: {
                        resetPwdInfo: function() {
                            var resetPwdInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                UserIds: UserIds
                            };
                            return resetPwdInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //移动用户
            moveUser: function(parentGroupId, userIds,moveType) {
                var defer = $q.defer();
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/moveUser/moveUser_tpl.html",
                    windowClass: 'userManageMent-moveUser-window',
                    backdrop: false,
                    controller: "moveUserCtrl",
                    resolve: {
                        incommData: function() {
                            var incommData = {
                                parentGroupId: parentGroupId,
                                userIds: userIds,
                                moveType:moveType
                            };
                            return incommData;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    defer.resolve(result);
                },function(){
                    defer.reject("cancel");
                });
                return defer.promise;
            },
            //用户映射
            userMapping: function(modalTitle, siteid, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/userMapping/userMapping_tpl.html",
                    windowClass: 'userManageMent-userMapping-window',
                    backdrop: false,
                    controller: "userMappingCtrl",
                    resolve: {

                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //列表排序（设置位置）
            sortUsers: function(modalTitle, user, itemcount, Status, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/sortUsers/sortUsers_tpl.html",
                    windowClass: 'userManageMent-sortUsers-window',
                    backdrop: false,
                    controller: "sortUsersCtrl",
                    resolve: {
                        sortUserInfo: function() {
                            var sortUserInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                user: user,
                                itemcount: itemcount, //列表数据条数
                                Status: Status
                            }
                            return sortUserInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //查看用户详细信息
            showUserDetail: function(modalTitle, userid, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/userDetail/userDetail_tpl.html",
                    windowClass: 'userManageMent-userDetail-window',
                    backdrop: false,
                    controller: "userDetailCtrl",
                    resolve: {
                        userDetailInfo: function() {
                            var userDetailInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                UserId: userid
                            }
                            return userDetailInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //导入用户
            importUsers: function(modalTitle, groupId, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/groupUserManageMent/user/service/importUser/importUser_tpl.html",
                    windowClass: 'userManageMent-importUser-window',
                    backdrop: false,
                    controller: "importUserCtrl",
                    resolve: {
                        importUserInfo: function() {
                            var importUserInfo = {
                                modalTitle: modalTitle, //弹窗标题
                                GroupId: groupId
                            }
                            return importUserInfo;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            }
        };
    }]);
