"use strict";
angular.module("productManageMentAppDelete", [])
    .controller("productManageMentAppDeleteCtrl", ["$scope", "trsHttpService", function($scope, trsHttpService) {
  
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.delete = function() {
          
            $scope.$close();
        };
    }]);
