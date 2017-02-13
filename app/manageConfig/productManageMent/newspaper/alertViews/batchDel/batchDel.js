/*
    Author:XCL
    Time:2016-01-06
*/
"use strict";
angular.module("productManageMentBatchDelModule", [])
    .controller("productManageMentBatchDelCtrl", ["$scope", "$modalInstance", "$stateParams", "trsspliceString", "trsHttpService", "delItems", "title",function($scope, $modalInstance, $stateParams, trsspliceString, trsHttpService, delItems, title) {

        initData();
        function initData() {
            $scope.delItems = delItems;
            $scope.title = title;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

        $scope.delete = function() {
           /* var delArray = trsspliceString.spliceString($scope.delItems,
                'CHANNELID', ',');
            $scope.params = {
            	"serviceid":"mlf_paperset",
            	"methodname":"deleteDieCiOrBanMians",
            	"ObjectIds":delArray
            };
            trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
            	console.log(data);
            });*/
            $modalInstance.close("success");
        };
    }]);
