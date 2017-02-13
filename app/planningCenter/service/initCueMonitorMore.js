/**
 * Author:XCL
 *
 * Time:2015-01-17
 */
"use strict";
angular.module('initCueMonitorMoreServiceModule', [])
    .factory('initCueMonitorMoreService', function() {
        return {
            initCueMonitorMore: function() {

            },
            //初始化数组
            generArray: function() {
                var generArray = [
                    [{
                        size: "4"
                    }],
                    [{
                        size: "2"
                    }, {
                        size: "2"
                    }],
                    [{
                        size: "1"
                    }, {
                        size: "1"
                    }, {
                        size: "1"
                    }, {
                        size: "1"
                    }],
                    [{
                        size: "4"
                    }],
                    [{
                        size: "2"
                    }, {
                        size: "1"
                    }, {
                        size: "1"
                    }],
                    [{
                        size: "1"
                    }, {
                        size: "1"
                    }, {
                        size: "2"
                    }],
                    [{
                        size: "3"
                    }, {
                        size: "1"
                    }, {
                        size: "1"
                    }],
                    [{
                        size: "3"
                    }, {
                        size: "1"
                    }, {
                        size: "1"
                    }],
                ];
                return generArray;
            },
            //日期
            dateSource: function() {
                var dateJsons = [{
                    name: "1日",
                    value: "01"
                }, {
                    name: "2日",
                    value: "02"
                }, {
                    name: "3日",
                    value: "03"
                }, {
                    name: "4日",
                    value: "04"
                }, {
                    name: "5日",
                    value: "05"
                }, {
                    name: "6日",
                    value: "06"
                }, {
                    name: "7日",
                    value: "07"
                }, {
                    name: "8日",
                    value: "08"
                }, {
                    name: "9日",
                    value: "09"
                }, {
                    name: "10日",
                    value: "10"
                }, {
                    name: "11日",
                    value: "11"
                }, {
                    name: "12日",
                    value: "12"
                }, {
                    name: "13日",
                    value: "13"
                }, {
                    name: "14日",
                    value: "14"
                }, {
                    name: "15日",
                    value: "15"
                }, {
                    name: "16日",
                    value: "16"
                }, {
                    name: "17日",
                    value: "17"
                }, {
                    name: "18日",
                    value: "18"
                }, {
                    name: "19日",
                    value: "19"
                }, {
                    name: "20日",
                    value: "20"
                }, {
                    name: "21日",
                    value: "21"
                }, {
                    name: "22日",
                    value: "22"
                }, {
                    name: "23日",
                    value: "23"
                }, {
                    name: "24日",
                    value: "24"
                }, {
                    name: "25日",
                    value: "25"
                }, {
                    name: "26日",
                    value: "26"
                }, {
                    name: "27日",
                    value: "27"
                }, {
                    name: "28日",
                    value: "28"
                }, {
                    name: "29日",
                    value: "29"
                }, {
                    name: "30日",
                    value: "30"
                }, {
                    name: "31日",
                    value: "31"
                }];
                return dateJsons;
            },
            //月份
            monthSource: function() {
                var monthJsons = [{
                    name: "1月",
                    value: "01"
                }, {
                    name: "2月",
                    value: "02"
                }, {
                    name: "3月",
                    value: "03"
                }, {
                    name: "4月",
                    value: "04"
                }, {
                    name: "5月",
                    value: "05"
                }, {
                    name: "6月",
                    value: "06"
                }, {
                    name: "7月",
                    value: "07"
                }, {
                    name: "8月",
                    value: "08"
                }, {
                    name: "9月",
                    value: "09"
                }, {
                    name: "10月",
                    value: "10"
                }, {
                    name: "11月",
                    value: "11"
                }, {
                    name: "12月",
                    value: "12"
                }];
                return monthJsons;
            },
            yearSource: function() {
                var nowYear = new Date().getFullYear();
                var yearJson = [];
                for (var i = 0; i < 10; i++) {
                    yearJson.push({
                        "name": nowYear + i + '年',
                        "value": nowYear + i
                    });
                }
                return yearJson;
            }
        };
    });
