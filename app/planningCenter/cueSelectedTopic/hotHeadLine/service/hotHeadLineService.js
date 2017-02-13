'use strict';
/**
    Create by BaiZhiming 2016-01-19
 */
angular.module("hotHeadLineServiceModule", [
        'initDataHotHeadLineServiceModule',
        'planHotHeadBarEchartsModule'
    ])
    .factory("hotHeadLineService", ["$q", "trsHttpService", "trsEchartsService", function($q, trsHttpService, trsEchartsService) {
        return {
            //热点导航地图数据获取
            getHotSpotNavMap: function() {
                var mapOption = trsEchartsService.initZheJiangMapOption();
                var optionSeries = mapOption.series[0];
                var region = {
                    "001020001": "丽水市",
                    "001020002": "台州市",
                    "001020003": "嘉兴市",
                    "001020004": "宁波市",
                    "001020005": "杭州市",
                    "001020006": "温州市",
                    "001020007": "湖州市",
                    "001020008": "绍兴市",
                    "001020010": "衢州市",
                    "001020011": "金华市"
                };
                var deferred = $q.defer();
                var params = {
                    typeid: "widget",
                    serviceid: "provicehotpoint",
                    modelid: "content",
                    type: "navigate"
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get")
                    .then(function(data) {
                        var optionSeries1 = angular.copy(optionSeries);
                        var optionSeries2 = angular.copy(optionSeries);
                        angular.forEach(data, function(dataC, index, array) {
                            optionSeries1.data.push({
                                name: region[dataC.AREA],
                                value: parseInt(dataC.DOCCOUNTS)
                            });
                            optionSeries2.data.push({
                                name: region[dataC.AREA],
                                value: dataC.TITLE
                            });
                        });
                        mapOption.series = [optionSeries1, optionSeries2];
                        deferred.resolve(mapOption);
                    });
                return deferred.promise;
            }
        };
    }]);
