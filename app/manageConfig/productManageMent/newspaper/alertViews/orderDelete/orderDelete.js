/*
	Create by ljs  2016-01-06
*/
"use strict";
angular.module("productManageMentOrderDeleteModule", [])
    .controller("productManageMentOrderDeleteCtrl", ["$scope", "trsHttpService","deleteItems","$stateParams", "$modalInstance","callback", function($scope, trsHttpService,deleteItems,$stateParams ,$modalInstance,callback) {
       var arrayDeleteitems=[];
	   initData();
        function initData() {
			$scope.datas = deleteItems;
			for(var i=0;i<=deleteItems.length-1;i++){
				arrayDeleteitems.push(deleteItems[i].CHANNELID);
			}
			arrayDeleteitems=arrayDeleteitems.toString();
			//console.log(arrayDeleteitems);

			
            
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.delete = function() {
			callback(arrayDeleteitems);
            $modalInstance.close();
        };
    }]);
