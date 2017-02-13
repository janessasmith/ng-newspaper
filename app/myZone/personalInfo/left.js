/**
 * Created by 马荣钦 on 2016/1/21.
 */
angular.module("myZonePersonalInfoLeftModule",[])
    .controller("myZonePersonalInfoLeftCtrl",["$scope",'$state',function($scope,$state){
        initData();
        $state.go('myzone.personalinfo.info');
        function initData(){
            
        }
        $scope.selectNav = function(item){
            $scope.selectThisNav = item;
        }
    }]);