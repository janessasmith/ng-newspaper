'use strict';
/**
 *  Module  纸媒头版柱状图
 *  createBy Ly
 *  time:2016/3/13
 * Description
 */
angular.module('topNewsPaperColumnarDirModule', []).directive('columnarDir', ['$q', 'initHotHead', '$timeout', 'trsHttpService', function($q, initHotHead, $timeout, trsHttpService) {
    // Runs during compile
    return {
        restrict: 'E',
        replace: true,
        template: "<div ng-style=\"myStyle\" ng-click=\"request(params)\"></div>",
        scope: {
            optionJsons: "=",
            newspaperlistDetail: '=',
            queryNewsPaper: "&",
            channel: "="
        },
        link: function(scope, iElement, iAttrs) {
            $timeout(function() {
                scope.myStyle = {
                    height: '415px',
                    width: '1080px'
                };
                var option = initHotHead.initTopNewspaperOption();
                option.xAxis[0].data = angular.copy(scope.optionJsons).name;
                option.series[0].data = angular.copy(scope.optionJsons).data;
                require(['echarts'], function(echarts) {
                    var myChart = echarts.init(iElement[0]);
                    myChart.setOption(option);
                    var emitType = {
                        'newspaper': "planNewsDetailList",
                        'website': "planWebDetailList"
                    };

                    function request(params) {
                        scope.newspaperlistDetail = params;
                        scope.newspaperlistDetail.guids = angular.copy(scope.optionJsons).guids[params.dataIndex];
                        scope.newspaperlistDetail.sids = angular.copy(scope.optionJsons).sids[params.dataIndex];
                        scope.$emit(emitType[scope.channel], params);
                    }
                    myChart.on("click", request);
                    scope.$watch("optionJsons", function(newValue, oldValue, scope) {
                        option.xAxis[0].data = angular.copy(scope.optionJsons).name;
                        option.series[0].data = angular.copy(scope.optionJsons).data;
                        myChart.setOption(option, true);
                    });
                });
            }, 500);
        }
    };
}]);
