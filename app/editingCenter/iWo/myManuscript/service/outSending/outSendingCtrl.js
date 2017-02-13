/*Create by ljs 2016-02-01*/
"use strict";
angular.module("iWoOutSendingModule", []).
controller('iWoOutSendingCtrl', ['$scope', '$timeout', '$modalInstance', 'trsHttpService', 'trsResponseHandle', 'SweetAlert', 'trsspliceString', 'trsconfirm', function($scope, $timeout, $modalInstance, trsHttpService, trsResponseHandle, SweetAlert, trsspliceString, trsconfirm) {
        //关闭窗口
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.dismiss();
        };

}]);
