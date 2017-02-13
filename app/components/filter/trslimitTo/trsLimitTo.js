'use strict';
/* created by cc 2015
    功能介绍： 字数过滤器
    使用方式：作为一个自定义过滤器写入标签中
    所需参数：param:截取的字符个数
*/
angular.module('trsLimitToModule', []).
filter("trsLimitTo", [function() {
    return function(input, param) {
        if (angular.isDefined(input)) {
            if (input && (input.length > param)) {
                input = input.substring(0, param) + '...';
            }
            return input;
        }
    };
}]);