"use strict";
angular.module('loginModule', ['loginRouterModule']).
controller('loginCtrl', ['$scope', '$state', '$modal', '$q', '$validation', 'localStorageService', 'trsHttpService', 'trsconfirm', 'loginService', '$stateParams', '$timeout',
    function($scope, $state, $modal, $q, $validation, localStorageService, trsHttpService, trsconfirm, loginService, $stateParams, $timeout) {

        initStatus();
        $scope.login = function($event) {
            if ($event && $event.keyCode !== 13) return;
            doLogin().
            then(function() {
                localStorageService.set("mlfCachedUser", $scope.data.user);
                return getDefaultGroup();
            }).
            then(function(data) {
                return initGroupForUser(data);
            }).
            then(function() {
                stateGo();
            });

        };
        /**
         * [rememberUser description]记住密码
         * @return {[type]} [description]
         */
        $scope.rememberUser = function() {
            $scope.data.user.isRememberUser = !$scope.data.user.isRememberUser;
            localStorageService.set("mlfCachedUser", $scope.data.user);
        };
        /**
         * [stateGo description]跳转
         * @return {[type]} [description]
         */
        function stateGo() {
            var state = loginService.getCacheRouter().state || "editctr.iWo.personalManuscript";
            var param = loginService.getCacheRouter().param;
            $state.go(state, param, { reload: true });
        }

        function initStatus() {

            $scope.status = {
                isModalOpened: false,
                // isRememberUser: false
            };
            $scope.data = {
                historyUrl: "",
                user: {
                    UserName: "",
                    Password: "",
                    isRememberUser: false,
                }
            };
            loginService.checkLogin().then(function(data) {
                if (data === 'true') stateGo();

            });
            //由于浏览器自动填充密码框，所以使用延迟在浏览器加载完成后清除下密码
            $timeout(function() {
                if (localStorageService.get("mlfCachedUser") && localStorageService.get("mlfCachedUser").isRememberUser) {
                    $scope.data.user = localStorageService.get("mlfCachedUser");
                } else {
                    $scope.data.user.Password = "";
                }
            }, 150);





        }
        /**
         * [doLogin description]登录逻辑
         * @return {[type]} [description]
         */
        function doLogin() {
            var deferred = $q.defer();
            $validation.validate($scope.loginForm).success(function() {
                LazyLoad.js(["./lib/js-base64/base64.js"], function() {
                    var encryptedPassword = "__encoded__" + Base64.encode(angular.copy($scope.data.user.Password));
                    var encryptedUserName = "__encoded__" + Base64.encode(angular.copy($scope.data.user.UserName));
                    loginService.login(encryptedUserName, encryptedPassword).then(function(data) {
                        localStorageService.set("currLoginUser", $scope.data.user.UserName);
                        deferred.resolve();
                    }, function(data) {
                        trsconfirm.alertType(data.msg, '', "error", false, "");
                        deferred.reject(data);
                    });
                });
            });
            return deferred.promise;
        }
        /**
         * [getDefaultGroup description]初始化用户的组织
         * @return {[type]} [description]
         */
        function getDefaultGroup() {
            var deferred = $q.defer();
            queryGroups().then(function(data) {
                if (data.length === 0) {
                    //trsconfirm.alertType('未找到该用户所属组织，您的登录被拒绝！', '', "warning", false);
                    stateGo();
                    deferred.reject();
                } else if (data.length === 1) {
                    deferred.resolve(data[0]);
                } else {
                    openGroupModal(data).then(function(group) {
                        deferred.resolve(group);
                    });
                }
            });
            return deferred.promise;
        }
        /**
         * [openGroupModal description]打开组织选择弹窗
         * @param  {[array]} groups [description] 组织数组
         * @return {[type]}      [description] null
         */

        function openGroupModal(groups) {
            if($scope.status.isModalOpened) return;
            var deferred = $q.defer();
            var modalInstance = $modal.open({
                templateUrl: "./login/template/setGroup_tpl.html",
                windowClass: 'login-group-modal',
                backdrop: false,
                controller: "loginInitGroupCtrl",
                resolve: {
                    groups: function() {
                        return groups;
                    },
                }
            });
            $scope.status.isModalOpened = true;
            modalInstance.result.then(function(result) {
                deferred.resolve(result);
            }, function() {
                $scope.status.isModalOpened = false;
                deferred.reject();
            });
            return deferred.promise;
        }
        /**
         * [queryGroups description]获取用户的所属组织
         * @return {[type]} [description]
         */
        function queryGroups() {
            var params = {
                serviceid: "mlf_extuser",
                methodname: "queryGroups"
            };
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        /**
         * [initGroupForUser description]设置默认组织
         * @return {[type]} [description]
         */
        function initGroupForUser(group) {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_extuser",
                methodname: "initGroupForLoginUser",
                GroupId: group.GROUPID,
                GroupPath: group.GROUPPATH
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                data = data.replace(/"/g, '');
                if (data === "true") {
                    var userData = localStorageService.get("mlfCachedUser");
                    userData.GroupId = group.GROUPID;
                    localStorageService.set("mlfCachedUser", userData);
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }

    }
]).controller('loginInitGroupCtrl', ['$scope', '$modalInstance', 'trsHttpService', 'groups',
    function($scope, $modalInstance, trsHttpService, groups) {
        $scope.status = {
            selectedGroup: groups[0]
        };
        $scope.data = {
            groupArray: groups
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.close($scope.status.selectedGroup);
        };
        $scope.selectGroup = function(group) {
            $scope.status.selectedGroup = group;
        };
        $scope.directLogin = function(group) {
            $scope.selectGroup(group);
            $modalInstance.close($scope.status.selectedGroup);
        };

    }
]);
