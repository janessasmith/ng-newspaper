"use strict";
angular.module('util.trsLineModule', []).
directive('trsMap', ['$timeout', '$q', 'trsEchartsService', function($timeout, $q, trsEchartsService) {
    return {
        restrict: 'E',
        replace: true,
        template: "<div ng-style=\"myStyle\"></div>",
        scope: {
            jsonOption: "=",
            eWidth: "=",
            eHeight: "="
        },
        link: function(scope, iElement, iAttrs) {
            scope.myStyle = trsEchartsService.initHeightWidth(scope.eWidth, scope.eHeight);
            var option = trsEchartsService.initOption();
            angular.forEach(option.series, function(value, key) {
                // value.markLine.data = []; //去除标线；
                value.type = "map";
            });
            angular.forEach(option.xAxis, function(value, key) {
                value.boundaryGap = false;
            });

            $timeout(function() {
                /*require(['echarts', 'echarts/chart/line'], function(echarts) {
                    var myChart = echarts.init(iElement[0], 'macarons');
                    myChart.setOption(option);
                });
*/
            });
        }
    };

}]);
