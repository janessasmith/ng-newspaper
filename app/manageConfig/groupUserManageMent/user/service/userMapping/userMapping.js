/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("userMappingModule", [])
    .controller("userMappingCtrl", ["$scope", "trsHttpService", '$http', '$modalInstance', "userManageMentService", function($scope, trsHttpService, $http, $modalInstance, userManageMentService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数
         */
        function initStatus() {
            $scope.data = {
                
            };
        }

        /**
         * [initData description]初始化数据
         */
        function initData() {
            
        }

        //确定
        $scope.confirm = function() {
            
        };
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };



    }]);
