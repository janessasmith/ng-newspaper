/*create by Baizhiming 2015-11-20*/
'use strict';
angular.module("manageConfig", ["manageCfg", "manageConfigHeaderModule", "manageConfigPermissionServiceModule", "logManageMentModule"]).
controller("manageConfigCtrl", ["$scope", '$rootScope', "$state", "$location", "trsHttpService", "manageConfigPermissionService", "trsconfirm", function($scope, $rootScope, $state, $location, trsHttpService, manageConfigPermissionService, trsconfirm) {
    initStatus();
    initData();

    function initData() {
        getConfigureAccessData();
    }
    //获取配置管理访问权限数据开始
    function getConfigureAccessData() {
        if (!angular.isDefined($scope.configureAccess)) {
            manageConfigPermissionService.getPermissionData()
                .then(
                    function(data) {
                        //获取模块权限，用于控制展现个模块入口
                        $scope.configureAccess = data;
                        //根据模块权限来定向路由开始
                        var routerPaths = [];
                        var hasRight = false; //是否有管理配置权限
                        var curUrl = window.location.href; //当前路径
                        for (var router in $scope.configureAccess) {
                            if (router === "auth") {
                                for (var _router in $scope.configureAccess.auth) {
                                    if (angular.isDefined($scope.status.routers[_router])) {
                                        routerPaths.push($scope.status.routers[_router]);
                                    }
                                }
                            } else {
                                routerPaths.push($scope.status.routers[router]);
                            }
                            hasRight = true;
                        }
                        if (hasRight) {
                            var flag = true;
                            for (var i = 0; i < routerPaths.length; i++) {
                                if (curUrl.indexOf(routerPaths[i]) >= 0) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                $state.go("manageconfig." + routerPaths[0]);
                            }
                            //根据模块权限来定向路由开始结束
                        } else {
                            trsconfirm.alertType("您没有管理配置访问权限", "您没有管理配置访问权限", "error", false, function() {
                                window.close();
                            });
                        }
                    }
                    //function(){$state.go("manageconfig.productmanage");}
                );
        }

    }
    //获取配置管理访问权限数据结束
    function initStatus() {
        $scope.status = {
            routers: {
                role: "rolemanage",
                product: "productmanage",
                system: "sysmanage",
                user: "groupmanage"
            }
        };
    }
    //移动组织广播中转站
    $scope.$on('moveGroup', function(e, newLocation) {
        $scope.$broadcast('changeGroupList', true);
    });
}]);
