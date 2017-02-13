"use strict";
angular.module("productManageMentNewspaperDisableViewsModule", [])
    .controller("productManageMentNewspaperDisableViewsCtrl", ["$scope", "$modalInstance", "widgetParams", function ($scope, $modalInstance, widgetParams) {
        init();
        $scope.cancel = function () {
            $scope.$close();
        };
        $scope.confirm = function () {
            $modalInstance.close({
                chnlName: $scope.chnlName
                //widgetContent: $scope.widgetContent
            });
        };
        function init() {
            if(widgetParams.operName){
                $scope.chnlName = '"'+widgetParams.chnlName+'"'
            }else{
                $scope.chnlName = "";
            }
            $scope.widgetId = widgetParams.widgetId;
        }
    }]);