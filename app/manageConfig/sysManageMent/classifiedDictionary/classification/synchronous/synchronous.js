/*
	Create by BaiZhiming 2015-11-20
*/
"use strict";
angular.module("synchronous", [])
    .controller("synchronousCtrl", ["$scope", "trsHttpService", function($scope, trsHttpService) {
        var param = {};
        $scope.selectedArray = [];
        $scope.synchronousSelected = function(item) {
            if (item.selected) {
                $scope.selectedArray.push(item.id);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }

            //$scope.selectedArray.toString();
        };
        trsHttpService.httpServer('/dicttool/ckm/getall', param, "get").then(function(data) {
            $scope.datas = data;
        }, function(data) {

        });
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.confirm = function() {
            var idValue = $scope.selectedArray.toString();
            var params = {
                "ckmIds": idValue
            };
            trsHttpService.httpServer('/dicttool/'+$scope.url+'/exportRulesToCKM', params, "post").then(function(data) {

            }, function(data) {

            });

            $scope.$close();
        };
    }]);
