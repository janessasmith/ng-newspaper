/**
 * Created by MRQ on 2016/1/7.
 */
 "use strict";
angular.module("productManageMentWebsiteServiceCtrlModule",[])
    .controller('productManageMentWebsiteRecycleDeleteCtrl',['$scope',"$modalInstance", "params",function($scope,$modalInstance,params){
        init();
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
        $scope.confirm = function () {
            $modalInstance.close();
        };
        function init() {
            $scope.item = params.title;
            $scope.content = params.content;
        }
    }])
    .controller('productManageMentWebsiteRecycleReductionCtrl',['$scope',"$modalInstance", "params",function($scope,$modalInstance,params){
        init();
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
        $scope.confirm = function () {
            $modalInstance.close();
        };
        function init() {
            $scope.item = params.title;
            $scope.content = params.content;
        }
    }])
;