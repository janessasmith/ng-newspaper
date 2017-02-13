/*
    Create By LiuJs 2015-11-13
*/
"use strict";
angular.module("cDMainModule", ["ckmModule", "classficationModule", "cDMainRouterMoudle", "classificationServiceModule"])
    .controller("cDMainCtrl", ["$scope", "$timeout", "$state", "classificationService", function($scope, $timeout, $state, classificationService) {
        $scope.optionSelected = "classification";
        classificationService.queryClassification().then(function(data) {
            $scope.classificationDatas = data;
            $scope.optionSelected = data[0].type;
            $scope.chooseType = function(type){
                $scope.optionSelected=type;
            };
            $state.go("manageconfig.sysmanage.classifieddictionary.classification", {
                "type": data[0].type,
                "name": data[0].name,
            });
        });
     
    }]);
