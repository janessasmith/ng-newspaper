'use strict';
/**
 *  Module  
 *
 * Description
 */
angular.module('planRankListModule', []).directive('rankLine', ['$timeout', 'rankingList', function($timeout, rankingList) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "./planningCenter/cueSelectedTopic/rankingList/directive/rankingLine/planRankList.html",
        scope: {
            optionObj: "=",
            isTool: "=",
            myStyle: '=',
        },
        link: function(scope, iElement, iAttrs) {
            // scope.myStyle = { height: '<5></5>0px', width: '100px' };
            var option = rankingList.initOption();
            angular.forEach(option.series, function(value, key) {
                value.type = "line";
            });
            $timeout(function() {
                require(['echarts', './lib/echarts/dist/echarts.min'], function(echarts) {
                    option.title.text = scope.optionObj.TITLE;
                    option.series[0].data = scope.optionObj.SEARCH_INDEX_HISTORY.split('|');
                    option.xAxis[0].data = scope.optionObj.SEARCH_INDEX_DATES.split('|');
                    option.xAxis[0].show = scope.isTool;
                    option.yAxis[0].show = scope.isTool;
                    option.series[0].show = scope.isTool;
                    var myChart = echarts.init(iElement[0], 'infographic');
                    myChart.setOption(option);
                });

            });
        }
    };
}]);
