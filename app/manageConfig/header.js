"use strict";
/**
 *  Module
 *
 * Description
 */
angular.module('manageConfigHeaderModule', []).
controller('manageConfigHeaderCtrl', ['$scope', '$location', function($scope, $location) {
    initStatus();
    //$scope.headTab[$scope.currModule] = true;
    function initStatus() {
        $scope.currModule = $location.path().split("/")[2];
        $scope.status = {
            headTab: {
                'usermanage': false,
                'rolemanage': false,
                'productmanage': false,
                'sysmanage': false,
                'logmanage':false
            }
        };
        $scope.status.headTab[$scope.currModule] = true;
        /* $scope.newPage = function(){
             window.open("http://10.100.62.73:9000/wcm/console/index/index.jsp?Path=userControl,0");
         }*/
    }
}]);
