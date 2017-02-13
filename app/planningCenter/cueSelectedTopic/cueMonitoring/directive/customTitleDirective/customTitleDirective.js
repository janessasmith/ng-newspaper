/**
 * Author:XCL
 *
 * Time:2016-02-24
 */
"use strict";
angular.module('customTitleDirectiveModule', []).directive('customTitle', function() {
    return {
        restrict: "EA",
        scope: {
            tit: "=",
            content: "=",
            beforeDate: "=",
            endDate: "=",
            callback: "&"
        },
        templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/directive/customTitleDirective/customTitleDirective_tpl.html",
        controller: function($scope, $element) {
            $scope.isCustomShow = false;
            $scope.customMouseenter = function(ev) {
                $scope.isCustomShow = true;
                if (document.body.offsetWidth - ev.clientX > 400) {
                    $scope.curposition = {
                        left: ev.offsetX
                    };
                } else {
                    $scope.curposition = {
                        left: 60
                    };
                }
            };
            $scope.customMouseleave = function() {
                $scope.isCustomShow = false;
            };
            $scope.customListClick = function() {
                $scope.callback();
            };
        }
    };
});
