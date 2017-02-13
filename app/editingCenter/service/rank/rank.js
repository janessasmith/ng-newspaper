"use strict";
angular.module('signedRankModule', []).
controller("signedRankCtrl", signedRankCtrl);
signedRankCtrl.$inject = ["$scope", "$modalInstance", "rankParams", "trsHttpService"];

function signedRankCtrl($scope, $modalInstance, rankParams, trsHttpService) {
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    $scope.confirm = function() {
        var params = {
            serviceid: rankParams.params.serviceid,
            methodname: rankParams.params.methodname,
            ChannelId: rankParams.channelid,
            FromChnlDocId: rankParams.item[0].CHNLDOCID,
            NewOrder: $scope.num
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
            .then(function(data) {
                $modalInstance.close("success");
            });
    };
}
