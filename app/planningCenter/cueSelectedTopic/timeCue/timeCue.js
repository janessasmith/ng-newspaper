"use strict";
/**
 *  timeCueModule Module
 *
 * Description 策划中心 信息监控 实时线索
 * rebuild: SMG 2016-5-24
 */
angular.module('timeCueModule', [])
    .controller('timeCueController', ["$scope", "$location", function($scope, $location) {
        initStatus();
        initData();

        function initStatus() {
            $scope.currTimeCueNavModule = $location.path().split("/").pop();
            // console.log($scope.currModule); `
            $scope.timeCueNavTab = {
                'monitor': false,
                'policy': false,
                'warnings': false,
                'history': false,
                'schedule': false
            };
            $scope.timeCueNavTab[$scope.currTimeCueNavModule] = true;
        }

        function initData() {}
    }]);
