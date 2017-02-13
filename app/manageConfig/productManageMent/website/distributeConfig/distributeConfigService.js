/**
 * Created by MRQ on 2016/1/8.
 */
angular.module("mangeProDistributeConfigCtrlModule",[])
    .controller("mangeProDistributeConfigAddCtrl", ["$scope", "$modalInstance","title",'successFn',function ($scope, $modalInstance,title,successFn) {
        initData();
        $scope.cancel = function () {
            $scope.$close();
        };
        $scope.confirm = function () {
            $modalInstance.close({});
        };
        function initData(){
            $scope.title = title;
            $scope.successFn = successFn;
        }
    }]);