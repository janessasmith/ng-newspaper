/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("sortUsersModule", [])
    .controller("sortUsersCtrl", ["$scope", '$stateParams','$location', "trsHttpService", '$modalInstance', "$validation", "userManageMentService", "trsspliceString", "sortUserInfo", function($scope, $stateParams,$location, trsHttpService, $modalInstance, $validation, userManageMentService, trsspliceString, sortUserInfo) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数
         */
        function initStatus() {
            $scope.data = {
                modalTitle: sortUserInfo.modalTitle,
                UserId: sortUserInfo.user.USERID,
                itemcount: sortUserInfo.itemcount,
                GroupId: $location.search().groupid,
                group: "",
                userName:sortUserInfo.user.USERNAME,
                NewOrderType: -1
            };
            $scope.status = {};

        }
        /*
        初始化下拉框
         */
        function initDropDown() {
            $scope.status.sortOptions = [{
                name: "最前面",
                value: 1
            }, {
                name: "最后面",
                value: sortUserInfo.itemcount
            }, {
                name: "指定位置",
                value: -1
            }];
            $scope.status.sortOptionSelected = angular.copy($scope.status.sortOptions[2]);
        }
        /**
         * [initData description]初始化数据
         */
        function initData() {
            initDropDown();
            if($stateParams.groupid!=null){
               queryGroupByGroupId(); 
            }
            
        }
        /**
         * [queryByDropdown description] 筛选条件触发后请求数据(下拉框选择：最前面，最后面，指定位置)
         * @param  {[type]} key   [description] 请求对象参数key
         * @param  {[type]} value [description] 请求对象值
         * @return {[type]}       [description] null
         */
        $scope.queryByDropdown = function(key, selected) {
            $scope.data.NewOrderType = selected.value;
            if ($scope.data.NewOrderType != -1) {
                $scope.data.NewOrder = selected.value;
            }else{
                $scope.data.NewOrder="";
            }
        };
        //确定
        $scope.confirm = function() {
            $validation.validate($scope.sortUsersSubmitForm).success(function() {
                var params = {
                    "serviceid": "mlf_usermanagement",
                    "methodname": "sortSetUpUsers",
                    "FromUserId": $scope.data.UserId,
                    "NewOrder": $scope.data.NewOrder/*,
                    "GroupId": $scope.data.GroupId*/
                };
                if($stateParams.groupid!=null){
                    params.GroupId = $stateParams.groupid;
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $modalInstance.close();
                });
            });
        };
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //获取组织信息（组织名称）
        function queryGroupByGroupId() {
            var params = {
                "serviceid": "mlf_groupmanagement",
                "methodname": "getGroupDetail",
                "GroupId": $scope.data.GroupId
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.group = data;
            });
        }
    }]);
