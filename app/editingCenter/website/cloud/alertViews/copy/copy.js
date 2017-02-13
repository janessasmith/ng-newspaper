/*create by ma.rongqin 2016.4.26*/
"use strict";
angular.module("editWebsiteCloudCopyModule", ["ngClipboard"])
    .config(['ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath("./lib/zeroclipboard/ZeroClipboard.swf");
    }])
    .controller("editWebsiteCloudCopyCtrl", ["$scope", "$modalInstance", "copyParams", "trsconfirm", function($scope, $modalInstance, copyParams, trsconfirm) {
        $scope.url = copyParams.url;
        $scope.copy = function() {
            trsconfirm.alertType("复制成功", "", "success", false, function() {
                $modalInstance.close();
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
