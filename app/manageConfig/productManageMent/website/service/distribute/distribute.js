"use strict";
/**
 *  Module
 *
 * Description
 */
angular.module('productWebsiteDistributeAddModule', []).controller('distributeAddCtrl', ["$scope", "$modalInstance", "item", function($scope, $modalInstance, item) {
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    initstatus();

    function initstatus() {
        $scope.productWebsite = [{
            name: "文件系统",
            value: "FILE"
        }, {
            name: "SFTP服务",
            value: "SFTP"
        }, {
            name: "FTP服务",
            value: "FTP"
        }];
        $scope.list = {};
        if (item === "") {
            $scope.list.TARGETTYPE = "FILE";
            $scope.initProductWebsite = $scope.productWebsite[0];
        } else {
            $scope.itemobj = item;
            $scope.list = angular.copy($scope.itemobj);
            $scope.initProductWebsiteOBJ = {};
            $scope.initProductWebsiteOBJ.name = item.TARGETTYPENAME;
            $scope.initProductWebsite = $scope.initProductWebsiteOBJ;
        }   
    }
    $scope.queryByDocStatus = function(item) {
        $scope.list.TARGETTYPE = item.value;
        if (item.value == "FILE") {
            $scope.list={};
            $scope.list.TARGETTYPE = "FILE";
            $scope.initProductWebsite = $scope.productWebsite[0];
        }

    };
    $scope.selectDoc = function(params) {
        eval(params);
    };
    $scope.isConfirm = function() {
        var productWebsiteObj = {
            "TARGETSERVER": $scope.list.TARGETSERVER,
            "TARGETTYPE": $scope.list.TARGETTYPE,
            "TARGETPORT": $scope.list.TARGETPORT,
            "DATAPATH": $scope.list.DATAPATH,
            "LOGINUSER": $scope.list.LOGINUSER,
            "LOGINPASSWORD": $scope.list.LOGINPASSWORD,
            "PublishDistributionId": item.PUBLISHDISTRIBUTIONID,
            "ENABLED": $scope.list.ENABLED,
        };
        $modalInstance.close(productWebsiteObj);
    };


}]);
