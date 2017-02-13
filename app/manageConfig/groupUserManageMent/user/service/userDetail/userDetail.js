/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("userDetailModule", [])
    .controller("userDetailCtrl", ["$scope", "$validation", "trsHttpService", '$http', '$modalInstance', "userManageMentService", "trsspliceString", "userDetailInfo", "trsconfirm", function($scope, $validation, trsHttpService, $http, $modalInstance, userManageMentService, trsspliceString, userDetailInfo, trsconfirm) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数
         */
        function initStatus() {
            $scope.data = {
                modalTitle: userDetailInfo.modalTitle,
                UserId: userDetailInfo.UserId,
                userDetails:[],
                roleDatas:[],
                groupPaths:[]
            };
            /*$scope.params = {
                "serviceid": "mlf_usermanagement",
                "methodname": "getUsersDetail",
                "UserId": userDetailInfo.UserId
            };*/
            //初始化用户状态
            $scope.userStatus = {
                30: '已开通',
                20: '已停用',
                10: '已删除'
            };
            //$scope.userDetails={};
        }

        /**
         * [initData description]初始化数据
         */
        function initData() {
            initDetail();
        }
        /**
         * [initData description]初始化用户信息
         */
        function initDetail() {
            var params = {
                "serviceid": "mlf_usermanagement",
                "methodname": "getUsersDetail",
                "UserId": userDetailInfo.UserId
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.userDetails = data.USER;
                $scope.data.roleDatas = data.ROLEDATA;
                $scope.data.groupIds = data.GROUP;
                if($scope.data.groupIds.length!=0){
                    getGroupPaths(trsspliceString.spliceString($scope.data.groupIds, "GROUPID", ","),"/");
                }
            });
        }
        //根据组织IDS获取组织路径
        function getGroupPaths(groupIds, dcim) {
            var params = {
                "serviceid": "mlf_group",
                "methodname": "getGroupPaths",
                "GroupIds": groupIds,
                "dcim": dcim
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.groupPaths = data;
            });
        }
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
