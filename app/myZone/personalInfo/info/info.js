"use strict";
/**
 * Created by 马荣钦 on 2016/1/21.
 */
angular.module("myZonePerInfoInfoModule", [
        'myZoneProInfoInfoRouterModule',
        'myZoneProInfoModifyModule'
    ])
    .controller("myZonePerInfoInfoCtrl", ["$scope", "$state", "trsHttpService", function($scope, $state, trsHttpService) {
        initStatus();
        initData();

        function initData() {
            requestData();
            headPortrait();
        }

        function initStatus() {
            $scope.params = {
                serviceid: "mlf_extuser",
                methodname: "getCurrUserInfo",
            };
            $scope.headParams = {
                serviceid: 'mlf_extuser',
                methodname: 'getUserHeadPic',
            };
            $scope.headPic = '';
        }

        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.info = data;
            });
        }
        //获取头像
        function headPortrait() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.headParams, "get").then(function(data) {
                $scope.headPic = data.USERHEAD[0].PERPICURL == '' ? './editngCenter/app/images/user_icon.jpg' : data.USERHEAD[0].PERPICURL;
            });
        }
        $scope.stateGoModify = function() {
            $state.go('myzone.personalinfo.info.modify');
        };

    }]);
