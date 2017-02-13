/*
	Create by  2015-12-09
*/
"use strict";
angular.module("productManageMentAppModify", [])
    .controller("productManageMentAppModifyCtrl", ["$scope", "trsHttpService", function($scope, trsHttpService) {
  
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.confirm = function() {
          
            $scope.$close();
        };
    }]);
