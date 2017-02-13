'use strict';
/**
 *  Module 不等距折线
 *  
 * Description
 */
angular.module('util.trsNoEquidistantLineModule', [])
    .directive('trsNoEquidistantLine', ["trsHttpService", "$timeout", function(trsHttpService, $timeout) {
        return {
            restrict: 'AE',
            template: '<div class="echarts_init"></div>',
            replace: true,
            scope: {
                option: "="
            },
            link: function($scope, iElement, iAttrs, controller) {
                var params = {
                    typeid: "event",
                    eventid: "11",
                    serviceid: "mediavolumecount",
                    modelid: "mediavolumecount",
                };
                require(['echarts', './lib/echarts/dist/echarts.min'], function(echarts) {
                    trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        var obj = data;
                        var titleData = [];
                        var titleName = [];
                        angular.forEach(obj, function(value, key) {
                            if (key != "DATE")
                                titleData.push({
                                    'name': key,
                                    'data': value
                                });
                        });

                        for (var i = 0; i < titleData.length; i++) {
                            titleName.push(titleData[i].name);
                        }
                        var option = {
                            tooltip: {
                                show: true
                            },
                            legend: {
                                data: titleName
                            },
                            toolbox: {
                                show: true,
                                orient: 'horizontal', // 布局方式，默认为水平布局，可选为：
                                // 'horizontal' ¦ 'vertical'
                                x: 'right', // 水平安放位置，默认为全图右对齐，可选为：
                                // 'center' ¦ 'left' ¦ 'right'
                                // ¦ {number}（x坐标，单位px）
                                y: 'top', // 垂直安放位置，默认为全图顶端，可选为：
                                // 'top' ¦ 'bottom' ¦ 'center'
                                // ¦ {number}（y坐标，单位px）
                                color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
                                backgroundColor: 'rgba(0,0,0,0)', // 工具箱背景颜色
                                borderColor: '#ccc', // 工具箱边框颜色
                                borderWidth: 0, // 工具箱边框线宽，单位px，默认为0（无边框）
                                padding: 5, // 工具箱内边距，单位px，默认各方向内边距为5，
                                showTitle: true,
                                feature: {
                                    mark: {
                                        show: true,
                                        title: {
                                            mark: '辅助线-开关',
                                            markUndo: '辅助线-删除',
                                            markClear: '辅助线-清空'
                                        },
                                        lineStyle: {
                                            width: 1,
                                            color: '#1e90ff',
                                            type: 'dashed'
                                        }
                                    },
                                    dataZoom: {
                                        show: false,
                                        title: {
                                            dataZoom: '区域缩放',
                                            dataZoomReset: '区域缩放-后退'
                                        }
                                    },
                                    dataView: {
                                        show: true,
                                        title: '数据视图',
                                        readOnly: true,
                                        lang: ['数据视图', '关闭', '刷新'],
                                        optionToContent: function(opt) {
                                            var axisData = opt.xAxis[0].data;
                                            var series = opt.series;
                                            var table = '<table style="width:100%;text-align:center"><tbody><tr>' + '<td>时间</td>' + '<td>' + series[0].name + '</td>' + '<td>' + series[1].name + '</td>' + '</tr>';
                                            for (var i = 0, l = axisData.length; i < l; i++) {
                                                table += '<tr>' + '<td>' + axisData[i] + '</td>' + '<td>' + series[0].data[i] + '</td>' + '<td>' + series[1].data[i] + '</td>' + '</tr>';
                                            }
                                            table += '</tbody></table>';
                                            return table;
                                        }
                                    },
                                    magicType: {
                                        show: true,
                                        title: {
                                            line: '动态类型切换-折线图',
                                            bar: '动态类型切换-柱形图',
                                            stack: '动态类型切换-堆积',
                                            tiled: '动态类型切换-平铺'
                                        },
                                        type: ['line', 'bar', 'stack', 'tiled']
                                    },
                                    restore: {
                                        show: true,
                                        title: '还原',
                                        color: 'black'
                                    },
                                    saveAsImage: {
                                        show: true,
                                        title: '保存为图片',
                                        type: 'jpeg',
                                        lang: ['点击本地保存']
                                    },
                                    myTool: {
                                        show: true,
                                        title: '自定义扩展方法',
                                        icon: 'image://../asset/ico/favicon.png',
                                        onclick: function() {
                                            alert('myToolHandler')
                                        }
                                    }
                                }
                            },
                            calculable: true,
                            dataZoom: {
                                show: true,
                                realtime: false,
                                start: 20,
                                end: 100
                            },
                            xAxis: [{
                                type: 'category',
                                boundaryGap: false,
                                data: function() {
                                    var list = data.DATE;
                                    return list;
                                }()
                            }],
                            yAxis: [{
                                type: 'value'
                            }],
                            series: []
                        };
                        for (i in titleData) {
                            option.series.push({
                                name: titleData[i].name,
                                type: 'line',
                                data: titleData[i].data,
                            });
                        }
                        var myChart = echarts.init(iElement[0]);
                        myChart.setOption(option);
                    });
                });
            }
        };
    }]);
