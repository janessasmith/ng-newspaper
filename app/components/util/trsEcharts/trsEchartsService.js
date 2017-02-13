"use strict";
angular.module('util.trsEchartsServiceModule', []).
factory('trsEchartsService', [function() {
    return {
        initHeightWidth: function(width, height) {
            var defalutWidth = "700px";
            var defaultHeight = "300px";
            if (angular.isUndefined(width)) width = defalutWidth;
            if (angular.isUndefined(height)) height = defaultHeight;
            return {
                width: width,
                height: height
            };
        },
        initOption: function() {
            var option = {
                title: {
                    text: 'trsLineText',
                    subtext: 'trsLineSubtext'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['最高气温']
                },
                toolbox: {
                    show: true,
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
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }],
                series: [{
                    name: '最高气温',
                    // type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    }
                    /*,
                                        markLine: {
                                            data: [{
                                                type: 'average',
                                                name: '平均值'
                                            }]
                                        }*/
                }]
            };
            return option;
        },
        initWordCloudOpton: function() {
            var option = {
                title: {
                    text: 'Google Trends',
                    link: 'http://www.google.com/trends/hottrends'
                },
                tooltip: {
                    show: true
                },
                series: [{
                    name: 'Google Trends',
                    type: 'wordCloud',
                    size: ['80%', '80%'],
                    textRotation: [0, 45, 90, -45],
                    textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: 14
                    }
                }]
            };
            return option;
        },
        initMapOption: function() {
            var option = {
                title: {
                    show: false,
                    text: 'iphone销量',
                    subtext: '纯属虚构',
                    left: 'center'
                },
                textStyle: {
                    color: 'yellow',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                },
                tooltip: {
                    show: false,
                    showContent: true,
                    trigger: 'item',
                    alwaysShowContent: true,
                    position: 'inside',
                    transitionDuration: 0,
                    formatter: '{a}:{b}:{c}',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    borderColor: '#68B4D2',
                    textStyle: {
                        color: '#272822',
                        fontWeight: 'normal'
                    }
                },
                geo: {
                    show: true,
                    backgroundColor: '#FFFFFF',
                    borderColor: '#6AB6D1',
                    borderWidth: 2,
                    textStyle: {
                        color: '#272822'
                    }
                },
                visualMap: [{
                    type: 'piecewise',
                    splitNumber: 5,

                    pieces: [{
                        min: 0,
                        max: 400,
                        color: '#F8F8F7'
                    }, {
                        min: 401,
                        max: 800,
                        color: "#EAEEF1"
                    }, {
                        min: 801,
                        max: 1200,
                        color: "#E6EFF3"
                    }, {
                        min: 1201,
                        max: 1600,
                        color: "#DFEBF5"
                    }, {
                        min: 1601,
                        max: 2000,
                        label: '10 到 200（自定义label）',
                        color: "#8DCCE0"
                    }, {
                        min: 2000,
                        max: 2500,
                        color: '#0081B8'
                    }],
                    min: 0,
                    max: 2500,
                    left: 0,
                    top: 'bottom',
                    text: ['热度高', '热度低'],
                    calculable: true,
                    realtime: false,
                    inverse: false,
                    orient: 'horizontal',
                    /*textGap: '1000px'*/
                    /*align:'right'*/
                    seriesIndex: 0,
                    itemGap: 1,
                }],
                toolbox: { //右边的工具盒
                    show: false,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [{
                    name: 'iphone3',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: [{
                        name: '北京',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '天津',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '上海',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '重庆',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '河北',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '河南',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '云南',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '辽宁',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '黑龙江',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '湖南',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '安徽',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '山东',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '新疆',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '江苏',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '浙江',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '江西',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '湖北',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '广西',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '甘肃',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '山西',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '内蒙古',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '陕西',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '吉林',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '福建',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '贵州',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '广东',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '青海',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '西藏',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '四川',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '宁夏',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '海南',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '台湾',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '香港',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '澳门',
                        value: Math.round(Math.random() * 2500)
                    }]
                }, {
                    name: 'iphone4',
                    type: 'map',
                    mapType: 'china',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: [{
                        name: '北京',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '天津',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '上海',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '重庆',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '河北',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '安徽',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '新疆',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '浙江',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '江西',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '山西',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '内蒙古',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '吉林',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '福建',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '广东',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '西藏',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '四川',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '宁夏',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '香港',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '澳门',
                        value: Math.round(Math.random() * 2500)
                    }]
                }, {
                    name: 'iphone5',
                    type: 'map',
                    mapType: 'china',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: [{
                        name: '北京',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '天津',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '上海',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '广东',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '台湾',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '香港',
                        value: Math.round(Math.random() * 2500)
                    }, {
                        name: '澳门',
                        value: Math.round(Math.random() * 2500)
                    }]
                }]
            };
            return option;
        },
        initZheJiangMapOption: function() {
            var option = {
                title: {
                    show: false,
                    text: '热度排行',
                    subtext: '纯属虚构',
                    left: 'center'
                },
                textStyle: {
                    color: 'yellow',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                },
                tooltip: {
                    show: false,
                    showContent: true,
                    trigger: 'item',
                    alwaysShowContent: true,
                    hideDelay: 100,
                    //  position : 'inside',
                    transitionDuration: 0,
                    formatter: function(params, ticket, callback) {
                        return option.series[params.seriesIndex+1].data[params.dataIndex].value;
                    },
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    borderColor: '#68B4D2',
                    textStyle: {
                        color: '#272822',
                        fontWeight: 'normal'
                    }
                },
                geo: {
                    show: true,
                    backgroundColor: '#FFFFFF',
                    borderColor: '#6AB6D1',
                    borderWidth: 2,
                    textStyle: {
                        color: '#272822'
                    }
                },
                visualMap: [{
                    type: 'piecewise',
                    splitNumber: 5,

                    pieces: [{
                        min: 0,
                        max: 100,
                        color: '#F8F8F7'
                    }, {
                        min: 100,
                        max: 200,
                        color: "#EAEEF1"
                    }, {
                        min: 200,
                        max: 300,
                        color: "#E6EFF3"
                    }, {
                        min: 300,
                        max: 400,
                        color: "#DFEBF5"
                    }, {
                        min: 400,
                        max: 500,
                        label: '10 到 200（自定义label）',
                        color: "#8DCCE0"
                    }, {
                        min: 500,
                        max: 600,
                        color: '#0081B8'
                    }],
                    min: 0,
                    max: 600,
                    left: 0,
                    top: 'bottom',
                    text: ['热度高', '热度低'],
                    calculable: true,
                    realtime: false,
                    inverse: false,
                    orient: 'horizontal',
                    /*textGap: '1000px'*/
                    /*align:'right'*/
                    seriesIndex: 0,
                    itemGap: 1,
                }],
                toolbox: { //右边的工具盒
                    show: false,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [{
                    name: '热度排行',
                    type: 'map',
                    mapType: '浙江',
                    roam: true,
                    left: 50,
                    label: {
                        normal: {
                            show: true,
                            textStyle: {

                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#272822",
                            borderColor: '#8DCCE0',
                            borderWidth: 1,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        },
                        emphasis: {
                            color: "#00C853",
                            borderColor: '#4AB348',
                            borderWidth: 1,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        },
                    },
                    data: []
                }]
            };
            return option;
        }

    };
}]);
