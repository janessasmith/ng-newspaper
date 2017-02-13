"use strict";
/**
 * operateCenterModule Module
 *
 * Description
 */
angular.module('visualizationCenterModule', ['visualizationCenterRouterModule'])
    .controller('visualizationCenterCtrl', ['$scope', '$sce', function($scope, $sce) {
        $scope.stSrc = $sce.trustAsResourceUrl("/wcm/stlogin/login");
        /*思图iframe设置高度*/
        $("#iframe_st_to_OperateCenter").load(function() {
            var iframe_st_to_OperateCenter_height = $(window).height() - 110;
            $(this).height(iframe_st_to_OperateCenter_height);
        });

    }]);