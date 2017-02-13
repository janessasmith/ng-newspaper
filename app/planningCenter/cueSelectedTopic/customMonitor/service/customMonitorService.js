/* create by ma.rongqin 2016.5.24*/
angular.module('planCenCustomMonitorServiceModule', [])
    .factory('planCenCustomMonitorService', ['trsHttpService', function(trsHttpService) {
        return {
            lineEcharts: function(title, params, elementClass, scope) {
                require(['echarts', './lib/echarts/dist/echarts.min'], function(echarts) {
                    scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        console.log(data);
                        var option = {
                            title: {
                                text: title,
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: []
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: []
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: []
                        };
                        //植入数据
                        for (var i in data) {
                            option.legend.data.push(i);
                            option.xAxis.data = data[i].resultTime;
                            option.series.push({
                                name: i,
                                type: 'line',
                                data: data[i].countNum,
                            });
                        }
                        var myChart = echarts.init(document.getElementsByClassName(elementClass)[0]);
                        myChart.setOption(option);
                    });

                });
            }
        };
    }])
