/*
	Create by BaiZhiMing 2015-1-10
*/
"use strict";
angular.module("inputPasswordModule", [])
    .controller("inputPasswordCtrl", ["$scope","$modalInstance","trsconfirm", function($scope,$modalInstance,trsconfirm) {
        $scope.confirm = function() {
        	if($scope.password===""||!angular.isDefined($scope.password)){
        		trsconfirm.alertType("请输入密码","请输入密码","warning",false);
        	}else{
        		$modalInstance.close($scope.password);
        	}
        };
        $scope.cancel = function(){
        	$modalInstance.dismiss();
        };
    }]);
