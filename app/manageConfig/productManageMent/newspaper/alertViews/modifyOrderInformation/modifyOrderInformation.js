/*
    Author:ljs
    Time:2016-01-05
*/
"use strict";
angular.module("productManageMentModifyOrderInfoModule", [])
    .controller("productManageMentModifyOrderInfoCtrl", ["$scope","trsHttpService","$stateParams","modifyOrderItem","$modalInstance","$q", function($scope, trsHttpService,$stateParams,modifyOrderItem,$modalInstance,$q) {
       initStatus();
	   initData();
	   function initStatus(){
            $scope.modifyOrderItem= modifyOrderItem;
			$scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findDieCiById",
                "ChannelId": $scope.modifyOrderItem.CHANNELID
            };
            requestData(); 
			
        };			
       function initData() {
		   $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "findPaperById",
                "SiteId": $stateParams.paper
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.paper = data;
            });       
        }  
       function requestData() {
            var deferred = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.DieCi = data;
                deferred.resolve();
            });
            return deferred.promise;
        }		
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.save = function() {
			$scope.params = {
            'serviceid': "mlf_paperset",
            'methodname': "saveDieCi",
			"ObjectId": $scope.modifyOrderItem.CHANNELID,
			"ChnlName": $scope.DieCi.CHNLNAME,
			"SiteId": $stateParams.paper
        };
		  requestData().then(function(data) {
                    $modalInstance.close();
                });
          
        };
       
    }]);
