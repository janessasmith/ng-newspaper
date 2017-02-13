"use strict";
angular.module('util.trsBarModule', []).
directive('trsMap', ['$timeout', '$q', 'trsEchartsService', function($timeout, $q, trsEchartsService) {
    return {
        restrict: 'E',
        replace: true,
        template: "<div ng-style=\"myStyle\"></div>",
        scope: {
            type: "=",
            option: "=",
            myStyle: "="
        },
        link: function(scope, iElement, iAttrs) {
            /* angular.forEach(option.series, function(value, key){
                 //value.markLine.data=[];//去除标线；
                 value.type = "bar";
             });*/
            scope.$watch("option", function(newValue, oldValue) {
                if (!angular.isDefined(scope.myStyle)) {
                    trsEchartsService.initHeightWidth(scope.eWidth, scope.eHeight);
                }
                var mapTypePath = "";
                if (scope.type === "china") {
                    mapTypePath = './lib/echarts/map/js/china';
                } else if (scope.type === "zhejiang") {
                    mapTypePath = './lib/echarts/map/js/province/zhejiang';
                }
                if (angular.isDefined(newValue)) {
                    require(['echarts', './lib/echarts/dist/echarts.min', mapTypePath], function(echarts, echartsInstance) {
                        scope.myChart = echarts.init(iElement[0]);
                        scope.myChart.setOption(scope.option);
                    });
                }
            });
        }
    };

}]);
