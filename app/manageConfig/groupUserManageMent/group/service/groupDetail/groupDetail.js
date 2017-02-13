/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("groupDetailModule", [])
    .controller("groupDetailCtrl", ["$scope", "$validation", "trsHttpService", '$http', '$modalInstance', "groupManageMentService", "groupDetailInfo", "trsconfirm", "trsspliceString", function($scope, $validation, trsHttpService, $http, $modalInstance, groupManageMentService, groupDetailInfo, trsconfirm, trsspliceString) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数
         */
        function initStatus() {
            $scope.data = {
                modalTitle: groupDetailInfo.modalTitle,
                GroupId: groupDetailInfo.GroupId,
                groupDetail: {}
            };
        }

        /**
         * [initData description]初始化数据
         */
        function initData() {
            queryGroupByGroupId();
        }
        /**
         * [initData description]初始化用户信息
         */
        function queryGroupByGroupId() {
            var params = {
                "serviceid": "mlf_groupmanagement",
                "methodname": "getGroupDetail",
                "GroupId": groupDetailInfo.GroupId
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.groupDetail = data;
            });
        }
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
