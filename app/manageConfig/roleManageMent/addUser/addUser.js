/*
    Create By Chenchen 2015-10-19
    */
'use strict';
angular.module('manageCfg.roleManageMent.userManageMentaddUser', []).
controller('userManageMentaddUserController', ['$scope', '$http', '$timeout', 'trsHttpService', '$modal', 'SweetAlert', '$state', 'trsconfirm', 'trsspliceString', 'trsSelectItemByTreeService', "globleParamsSet", function($scope, $http, $timeout, trsHttpService, $modal, SweetAlert, $state, trsconfirm, trsspliceString, trsSelectItemByTreeService, globleParamsSet) {
    /*
    初始化参数
    */
    initStatus();
    requestData();
    $scope.$on("roleData", function(event, roleData) {
        if (roleData.ROLEID === "2") { //everyOne用户不允许添加用户
            $state.go("manageconfig.rolemanage");
            return;
        }
        $scope.roleData = roleData;
        $scope.params.RoleId = roleData.ROLEID;
        initStatus();
        requestData();
    });
    //获取用户列表结束
    //增加了用户，重新刷新列表开始
    $scope.$on("addUser", function(event, data) {
        requestData();
    });
    //增加了用户，重新刷新列表结束

    //添加用户按钮开始
    $scope.addUser = function() {
        trsSelectItemByTreeService.getUser(function(data) {
            var params = {
                "UserIds": trsspliceString.spliceString(data, "ID", ","),
                "RoleId": $scope.roleData.ROLEID,
                "serviceid": "mlf_extrole",
                "methodname": "addUser"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("添加用户成功", "", "success", false, function() {
                    requestData();
                });
            });
        });
    };
    //添加用户按钮结束
    //批量删除用户按钮开始
    $scope.deleteUser = function() {
        trsconfirm.confirmModel('删除', '是否确认移除选中的用户', function() {
            var i = 0;
            while (i < $scope.items.length) {
                var flag = true;
                angular.forEach($scope.selectedArray, function(data, index, array) {
                    if (JSON.stringify($scope.items[i]) === JSON.stringify(data)) {
                        $scope.items.splice(i, 1);
                    }
                });
                if (flag) {
                    i++;
                }
            }
            var UserIds = trsspliceString.spliceString($scope.selectedArray,
                'USERID', ',');
            $scope.selectedArray = [];
            var params = {
                "serviceid": "mlf_extrole",
                "methodname": "removeUser",
                "RoleId": $scope.roleData.ROLEID,
                "UserIds": UserIds
            };
            trsHttpService.httpServer('/wcm/mlfcenter.do', params, "get").then(function(data) {
                requestData();
            }, function(data) {
                sweetAlert('数据请求错误', data, "error");
            });
        });
    };
    //批量删除用户结束
    //删除用户开始
    //单个删除用户
    $scope.deleteItem = function(userid) {
        trsconfirm.confirmModel('删除', '是否确认移除选中的用户', function() {
            var params = {
                "serviceid": "mlf_extrole",
                "methodname": "removeUser",
                "RoleId": $scope.roleData.ROLEID,
                "UserIds": userid
            };
            trsHttpService.httpServer('/wcm/mlfcenter.do', params, "get").then(function(data) {
                requestData();
            }, function(data) {
                sweetAlert('数据请求错误', data, "error");
            });
        });

    };
    //移动用户
    $scope.moveUser = function() {
        trsSelectItemByTreeService.getPowerRole("选择要移动的角色", [], function(data) {
            var params = {
                "serviceid": "mlf_extuser",
                "methodname": "moveUsersToRoles",
                "UserIds": trsspliceString.spliceString($scope.selectedArray, 'USERID', ','),
                "RoleIds": data.ROLEID,
                "CurRoleId": $scope.roleData.ROLEID,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("移动角色成功", "", "success", false, function() {
                    requestData();
                })
            }, function() { requestData(); });
        });
    };
    //全选
    $scope.selectAll = function() {
        $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);
    };
    //单选
    $scope.selectDoc = function(item) {
        if ($scope.selectedArray.indexOf(item) < 0) {
            $scope.selectedArray.push(item);
        } else {
            $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
        }
    };
    //跳转到下一页
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    //跳转到
    $scope.jumpToPage = function() {
        if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.copyCurrPage;
        requestData();
    };
    //初始化状态
    function initStatus() {
        $scope.selectedArray = [];
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.setResourceCenterPageSize,
            "PAGECOUNT": 1,
            "ITEMCOUNT": 0,
        };
        $scope.copyCurrPage = 1;
        $scope.params = {
            "serviceid": "mlf_extrole",
            "methodname": "queryUsers",
            "PageSize": $scope.page.PAGESIZE,
            "RoleId": $scope.roleData.ROLEID,
            "CurrPage": $scope.page.CURRPAGE
        };
    }
    //初始化数据
    function requestData(callback) {
        trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, "get").then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.items = data.DATA;
                $scope.copyItems = data.DATA;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                $scope.searchUserName = "";
                $scope.$broadcast('pageChange', $scope.page);
            }
        }, function(data) {
            sweetAlert('数据请求错误', data, "error");
        });
    }
    /**
     * @param  {[type]}
     * @param  {[type]}
     * @param  {[type]}
     * @return {[type]}
     */
    function sweetAlert(title, text, type) {
        SweetAlert.swal({
            title: title,
            text: text,
            type: type,
            closeOnConfirm: true,
            cancelButtonText: "取消",
        });
    }
    //可选分页数
    $scope.selectPageNum = function() {
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = 1;
        requestData();
    };
    /**
     * [根据用户名检索]
     * @param  {[obj]}时间对象
     * @return {[type]}null
     */
    $scope.fullTextSearch = function(ev) {
        if (angular.isDefined(ev) && ev.keyCode == 13 || angular.isUndefined(ev)) {
            var params = {
                serviceid: "mlf_extuser",
                methodname: "searchUsersOfRole",
                SearchName: $scope.searchUserName,
                RoleId: $scope.roleData.ROLEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.items = data;
                //后端未返回分页参数后的处理
                $scope.page.CURRPAGE = 1;
                $scope.page.ITEMCOUNT = data.length;
                $scope.page.PAGECOUNT = data.length == 0 ? 1 : data.length % $scope.page.PAGESIZE;
            });
        }
    }
}]);
