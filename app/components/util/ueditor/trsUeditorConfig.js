"use strict";
angular.module('util.ueditorConfig',[]).factory('trsUeditorConfigService', [function() {
    var defaultNum = 5;
    return {
        getCacheContentNum: function() {
        	return defaultNum;
        },
        setCacheContentNum: function(num) {
            if (angular.isNumber(num))
                defaultNum = num > 10 ? 10 : num;
        }
    };
}]);
