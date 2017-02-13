/*
    Create by you 2015-12-22
*/
'use strict';
angular.module("contentExpansionModule", [])
    .controller("contentExpansionCtrl", ["$scope", "$modalInstance", "trsHttpService", "draftParams", "trsspliceString", "trsconfirm", function($scope, $modalInstance, trsHttpService, draftParams, trsspliceString, trsconfirm) {

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.status = {
            "AdditionalTextTop": angular.copy(draftParams.items.ADDITIONALTEXTTOP),
            "AdditionalTextBottom": angular.copy(draftParams.items.ADDITIONALTEXTBOTTOM),
            "AdditionalTextLeft": angular.copy(draftParams.items.ADDITIONALTEXTLEFT),
            "AdditionalTextRight": angular.copy(draftParams.items.ADDITIONALTEXTRIGHT),
        };

        $scope.confirm = function() {
            // if (angular.isDefined($scope.selectedChannel)) {
            //     $modalInstance.close({
            //         channelid: $scope.selectedChannel.CHANNELID
            //     });
            // }else{
            //     trsconfirm.alertType("请选择栏目","请选择栏目","warning",false);
            // }
            $modalInstance.close($scope.status);
        };


    }]);
