/*
	Creat by BaiZhiming 2015-12-18
*/
'use strict';
angular.module("stickModule", [])
    .controller("stickCtrl", ["$scope", "$modalInstance", "$filter", "stickParams", "trsHttpService", function($scope, $modalInstance, $filter, stickParams, trsHttpService) {
        init();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            var params = {
                serviceid: stickParams.params.serviceid,
                methodname: stickParams.params.methodname,
                ChannelId: stickParams.channelid,
                OrderSort: parseInt($scope.positionNum.value),
                BeginTime: $filter('date')($scope.stickStartTime, "yyyy-MM-dd HH:mm"),
                EndTime: $filter('date')($scope.stickEndTime, "yyyy-MM-dd HH:mm"),
                ChnlDocId: stickParams.item[0].CHNLDOCID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    $modalInstance.close("success");
                });
        };

        function init() {
            $scope.positionNums = [];
            for (var i = 0; i < stickParams.pagesize; i++) {
                $scope.positionNums.push({
                    name: i + 1,
                    value: i + 1
                });
            }
            $scope.positionNum = angular.copy($scope.positionNums[0]);
            var getTimeParams = {
                serviceid:stickParams.params._serviceid,
                methodname:stickParams.params._methodname,
                ChnlDocId:stickParams.params.ChnlDocId
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(),getTimeParams,"post")
            .then(function(data){
                if(data!==""){
                    $scope.positionNum = angular.copy($scope.positionNums[data.PLACE-1]);
                    $scope.stickStartTime = data.STARTTIME;
                    $scope.stickEndTime = data.STOPTIME;
                }
            });
        }
    }]);
