"use strict";
angular.module('versionModule', [
        "editCenPersonalVersionTimeModule",
        "editingCenterPersonalPreviewModule"
    ])
    .factory('initVersionService', ['$filter', function($filter) {
        return {
            getDayContent: function(data, order) {
                var now = new Date();
                var results = [];

                //时间需要反序
                angular.forEach(data, function(value, key) {
                    var result = {
                        day: "",
                        times: []
                    };
                    var crtime = "";
                    if (angular.isDefined(value.OPERTIME)) {
                        value.OPERTIME = value.OPERTIME.replace(/-/g, "/");
                        crtime = new Date(value.OPERTIME);
                    } else {
                        value.CRTIME = value.CRTIME.replace(/-/g, "/");
                        crtime = new Date(value.CRTIME);
                    }
                    var i = 0;
                    var flag = true;
                    for (; i < results.length; i++) {
                        if ($filter("date")(results[i].day, "yyyy-MM-dd") === $filter("date")(crtime, "yyyy-MM-dd")) {
                            flag = false;
                            break;
                        }
                    }

                    var method = order ? 'push' : 'unshift';
                    if (flag) {
                        result.day = crtime;
                        result.times[method]({
                            value: value
                        });
                        results[method](result);
                    } else if (angular.isDefined(results[i])) {
                        results[i].times[method]({
                            value: value
                        });
                    }

                });
                return results;
            }
        };
    }]);
