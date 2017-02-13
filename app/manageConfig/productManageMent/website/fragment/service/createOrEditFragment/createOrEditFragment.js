/*
    Creat by BaiZhiming 2015-12-25
*/
"use strict";
angular.module("createFragmentModule", [])
    .controller("createFragmentCtrl", ["$scope", "$modalInstance", "widgetParams","trsHttpService", function($scope, $modalInstance, widgetParams,trsHttpService) {
        init();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.close({
                widgetName: $scope.widgetName,
                widgetContent: $scope.widgetContent
            });
        };

        function init() {
            $scope.operName = widgetParams.operName;
            $scope.widgetId = widgetParams.widgetId;
            if ($scope.widgetId !== "") {
                var getWidgetParam = {
                    serviceid: "mlf_widget",
                    methodname: "findById",
                    ObjectId: $scope.widgetId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(),getWidgetParam,"post")
                .then(function(data){
                    $scope.widgetName = data.TEMPDESC;
                    $scope.widgetContent = data.TEMPTEXT
                    .replace(/\\n/g,"\n")
                    .replace(/\\t/g,'    ')
                    .replace(/\\\"/g,"\"")
                    .replace(/\\/g,"");
                });
            }
        }
    }]);
