'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('util.trsPieModule', [])
    .directive('trsPie', ["trsHttpService", "$compile", function(trsHttpService, $compile) {
        return {
            restrict: 'E',
            // templateUrl: "./components/util/trsBigFace/bigFace.html",
            template: ' <div class="trsPie"></div>',
            link: function(scope, iElement, iAttrs) {
                trsHttpService.httpServer("./components/util/trsEcharts/trsPie/trsPic.json", "", "post").then(function(data) {
                    var tempData = {
                        legendData: [],
                        seriesData1: [],
                        seriesData2: []
                    };
                    //图形颜色
                    var dataColor = {
                        "seriesData1": ["#00CBC8", "#BFA0DB"],
                        "seriesData2": ["#FFB575", "#8C96AE", "#1CB1EF", "#EECF1A",
                            "#ED7273", "#EECF1F", "#BD9DCE", "#8FB554"
                        ]
                    };
                    for (var i = 0; i < data.seriesData2.length; i++) {
                        tempData.legendData.push({
                            name: data.seriesData2[i].name,
                            icon: 'roundRect',
                            textStyle: {
                                fontWeight: 'bold',
                                color: dataColor.seriesData2[i]
                            },
                            itemStyle: {
                                normal: {
                                    color: dataColor.seriesData2[i]
                                }
                            }
                        });
                        tempData.seriesData2.push({
                            value: data.seriesData2[i].value,
                            name: data.seriesData2[i].name,
                            itemStyle: {
                                normal: {
                                    color: dataColor.seriesData2[i]
                                }
                            }
                        });
                    }
                    for (var j = 0; j < data.seriesData1.length; j++) {
                        var itemData = data.seriesData1[j];
                        tempData.seriesData1.push({
                            value: itemData.value,
                            name: itemData.name,
                            itemStyle: {
                                normal: {
                                    color: dataColor.seriesData1[j]
                                }
                            }
                        });
                    }

                    var option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: tempData.legendData
                        },
                        series: [{
                            name: '部门发稿量统计',
                            type: 'pie',
                            selectedMode: 'single',
                            radius: [0, '35%'],
                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: tempData.seriesData1
                        }, {
                            name: '部门发稿量统计',
                            type: 'pie',
                            radius: ['50%', '65%'],
                            data: tempData.seriesData2
                        }]
                    };


                    require(["./lib/echarts/dist/echarts.min"], function(echarts) {



                        var tempMain = iElement.find("div");

                        var myChart = echarts.init(tempMain[0]);
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);



                        // var myChart = echarts.init(iElement);
                        // // 使用刚指定的配置项和数据显示图表。
                        // myChart.setOption(option);
                    });



                });
            }
        };
    }]);
