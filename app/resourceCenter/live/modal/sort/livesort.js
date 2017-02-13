"use strict";
/**
 * created By cc 2016-08-17
 */
angular.module("liveSortModule", []).controller('liveSortCtrl', ['$scope', '$modalInstance', '$state', "trsHttpService", "incomeData","trsconfirm",function($scope, $modalInstance, $state, trsHttpService, incomeData,trsconfirm) {
    initStatus();
    function initStatus() {
        $scope.params = {
            serviceid: "mlf_liveshow",
            methodname: "orderLiveShowZhuTi",
            OrderNum:"",
            XWCMLiveShowZhuTiId: incomeData[0].XWCMLIVESHOWZHUTIID,
            ChannelId: $state.params.liveid
        };
    }
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    $scope.confirm = function() {
    	$scope.params.OrderNum=$scope.ordernum;
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
            trsconfirm.alertType("排序成功", "", "success", false, function() {
                $modalInstance.close();
            });
        });
    };
}]);
