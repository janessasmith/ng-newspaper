/**
 * Created by MRQ on 2016/1/6.
 */
"use strict";
angular.module("productManageMentWebsiteRecycleBinReductionViewsModule", [])
    .controller("productManageMentWebsiteRecycleBinReductionViewsCtrl", ["$scope","$modalInstance", "itemName","successFn", function ($scope,$modalInstance,itemName,successFn ) {
        init();
        $scope.cancel = function () {
            $scope.$close();
        };
        $scope.confirm = function () {
            $modalInstance.close({
                //chnlName: $scope.chnlName
                //widgetContent: $scope.widgetContent
            });
        };
        function init() {
            $scope.item = itemName;
            $scope.successFn = successFn;
        }
    }]);