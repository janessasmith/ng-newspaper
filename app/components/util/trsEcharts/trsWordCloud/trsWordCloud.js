"use strict";
angular.module('util.trsWordCloudModule', []).
directive('trsWordCloud', ['$timeout', '$q', 'trsEchartsService', function($timeout, $q, trsEchartsService) {
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
            var data = [{
                name: '天津塘沽爆炸',
                value: 31233,
                itemStyle: createRandomItemStyle()
            }, {
                name: '最美逆行',
                value: 31200,
                itemStyle: createRandomItemStyle()
            }, {
                name: '消防员',
                value: 21200,
                itemStyle: createRandomItemStyle()
            }, {
                name: '遇难人数',
                value: 11200,
                itemStyle: createRandomItemStyle()
            }, {
                name: '爆炸强度',
                value: 18200,
                itemStyle: createRandomItemStyle()
            }, {
                name: '伤员',
                value: 17200,
                itemStyle: createRandomItemStyle()
            }, {
                name: '遇难名单',
                value: 15300,
                itemStyle: createRandomItemStyle()
            }, {
                name: '空气濡染',
                value: 11000,
                itemStyle: createRandomItemStyle()
            }, {
                name: '回购',
                value: 11000,
                itemStyle: createRandomItemStyle()
            }, {
                name: '核心区',
                value: 11000,
                itemStyle: createRandomItemStyle()
            }, {
                name: '天津港',
                value: 9999,
                itemStyle: createRandomItemStyle()
            }, {
                name: '楼房损坏',
                value: 888,
                itemStyle: createRandomItemStyle()
            }, {
                name: '空气质量',
                value: 7777,
                itemStyle: createRandomItemStyle()
            }, {
                name: '危险品仓库',
                value: 6666,
                itemStyle: createRandomItemStyle()
            }, {
                name: '死鱼',
                value: 7777,
                itemStyle: createRandomItemStyle()
            }, {
                name: '汽车销毁',
                value: 777,
                itemStyle: createRandomItemStyle()
            }, {
                name: '下雨',
                value: 888,
                itemStyle: createRandomItemStyle()
            }, {
                name: '意外',
                value: 123,
                itemStyle: createRandomItemStyle()
            }];
            scope.myStyle = trsEchartsService.initHeightWidth(scope.eWidth, scope.eHeight);
            var option = trsEchartsService.initWordCloudOpton();
            angular.forEach(option.series, function(value, key) {
                value.data = data;
            });
            $timeout(function() {
                var myChart = echarts.init(iElement[0], 'macarons');
                myChart.setOption(option);
            });
        }
    };

    function createRandomItemStyle() {
        return {
            normal: {
                color: 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                ].join(',') + ')'
            }
        };
    }
}]);
