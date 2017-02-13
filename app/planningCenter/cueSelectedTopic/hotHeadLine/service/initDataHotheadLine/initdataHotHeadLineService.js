'use strict';
/**
 *  Module 热点头条初始化模板
 *
 * Description
 */
angular.module('initDataHotHeadLineServiceModule', []).factory('initHotHead', function() {
    return {
        initTopNewspaperTime: function() {
            var topNewspaper = [{
                timeName: "全部状态",
                timeRange: "1"
            }, {
                timeName: "待编",
                timeRange: "3"
            }, {
                timeName: "退稿",
                timeRange: "7"
            }];
            return topNewspaper;
        },
        initpaperTime: function() {
            var topNewspaper = [{
                timeName: "7日",
                timeRange: "7"
            }, {
                timeName: "3日",
                timeRange: "3"
            }, {
                timeName: "1日",
                timeRange: "1"
            }];
            return topNewspaper;
        },
        initTopNewspaperOption: function() {
            var option = {
                title: {
                    text: '',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                grid:{
                    left: '2%',
                    right: '2%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: [{
                    gridIndex: 0,
                    position: "",
                    type: 'category',
                    name: "",
                    nameLocation: 'start',
                    axisLabel: {
                        interval: 0, //横轴信息全部显示
                        rotate: 0, //60度角倾斜显示
                        formatter: function(val) {
                            return val.split("").join("\n"); //横轴信息文字竖直显示
                        },
                    },
                    splitLine: {　　　　
                        show: false　　
                    },
                    nameTextStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'sans-serief',
                        fontSize: 10,
                    }
                }],
                yAxis: [{
                    type: "value",
                }],
                itemStyle: {
                    normal: {
                        label: { show: true },
                        color: '#2f98d2'
                    },
                    emphasis: {
                        label: { show: true },
                        color: '#C23531'
                    }
                },
                series: [{
                        name: '条数',
                        type: 'bar',
                    },

                ]
            };
            return option;
        }
    };
});
