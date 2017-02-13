/*
	Create by BaiZhiming 2015-12-26
*/
"use strict";
angular.module("copyUrlModule", ["ngClipboard"])
    .config(['ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath("./lib/zeroclipboard/ZeroClipboard.swf");
    }])
    .controller("copyUrlCtrl", ["$scope","$modalInstance","copyParams","trsconfirm", function($scope,$modalInstance,copyParams,trsconfirm) {
    	$scope.url = copyParams.url;
    	$scope.copyUrl = function(){
    		trsconfirm.alertType("复制成功","复制成功","success",false,function(){
    			$modalInstance.dismiss();
    		});
    	};
    	$scope.cancel = function(){
    		$modalInstance.dismiss();
    	};
    }]);
