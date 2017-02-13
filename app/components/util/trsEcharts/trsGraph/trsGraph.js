'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('util.trsGraphModule', [])
    .directive('trsGraph', ["trsHttpService", "$compile", function(trsHttpService, $compile) {
        return {
            restrict: 'E',
            // templateUrl: "./components/util/trsBigFace/bigFace.html",
            template: ' <div class="trsGraph"></div>',
            link: function(scope, iElement, iAttrs) {
                trsHttpService.httpServer("./components/util/trsEcharts/trsGraph/trsGraph.json", "", "post").then(function(data) {
                    //图形颜色
                    var dataColor = {
                        "seriesColor": ["#FFB575", "#8C96AE", "#1CB1EF", "#EECF1A",
                            "#ED7273", "#EECF1F", "#BD9DCE", "#8FB554"
                        ]
                    };
                    for (var i = 0; i < data.categories.length; i++) {
                    	var itemStyle = {
                    		color:dataColor.seriesColor[i]
                    	};
                       data.categories[i].itemStyle = itemStyle;
                       data.data[i].itemStyle = itemStyle;
                    }
                    var option = {
                        title: {
                            text: '传播情况统计',
                            subtext: '副标题传播情况统计',
                            top: 'top',
                            left: 'right'
                        },
                        tooltip: {},
                        legend: [{
                            data: data.categories.map(function(a) {
                                return a.name;
                            })
                        }],
                        animation: false,
                        series: [{
                            name: '发稿关系',
                            type: 'graph',
                            layout: 'force', // circular 
                            data: data.data,
                            links: data.links,
                            categories: data.categories,
                            roam: true,
                            label: {
                                normal: {
                                    position: 'right'
                                }
                            },
                            force: {
                                repulsion: 100
                            },
                            lineStyle: {
                                normal: {
                                    curveness: 0
                                }
                            }
                        }]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    require(["./lib/echarts/dist/echarts.min"], function(echarts) {
                        var tempMain = iElement.find("div");
                        var myChart = echarts.init(tempMain[0]);
                        myChart.showLoading();
                        // var result = $compile(option)(scope);
                        myChart.setOption(option);
                        myChart.hideLoading();
                    });
                });
            }
        };
    }]);
