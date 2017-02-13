/*
    Create by fanglijuan 2016-05-23
*/
'use strict';
angular.module("userMngGroupMngSortGroupModule", [])
    .controller("userMngGroupMngSortGroupCtrl", ["$scope", "trsHttpService", '$http', '$modalInstance', "$validation", "trsspliceString", "groupManageMentService", "sortGroupInfo", function($scope, trsHttpService, $http, $modalInstance, $validation, trsspliceString, groupManageMentService, sortGroupInfo) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数
         */
        function initStatus() {
            $scope.data = {
                modalTitle: sortGroupInfo.modalTitle,
                GroupId: sortGroupInfo.GroupId,
                ParentId: sortGroupInfo.ParentId,
                itemcount: sortGroupInfo.itemcount,
                GName: sortGroupInfo.GName
            };
            $scope.status = {};

        }
        /**
         * [initData description]初始化数据
         */
        function initData() {}
        //确定
        $scope.confirm = function() {
            $validation.validate($scope.sortGroupSubmitForm).success(function() {
                if ($scope.data.NewOrder > sortGroupInfo.itemcount) {
                    $scope.data.NewOrder = sortGroupInfo.itemcount;
                }
                var params = {
                    "serviceid": "mlf_groupmanagement",
                    "methodname": "sortSetUpGroup",
                    "FromGroupId": sortGroupInfo.GroupId,
                    "NewOrder": $scope.data.NewOrder/*,
                    "ParentId": sortGroupInfo.ParentId*/
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $modalInstance.close();
                });
            });
        };
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

    }]);
