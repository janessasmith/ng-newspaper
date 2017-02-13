'use strict';
/* created by cc 2016 03=07
    功能介绍： 列表sce过滤器
    使用方式：渲染在列表上渲染后台返回的style或者font等样式，避免手动遍历
    所需参数：param:截取的字符个数
*/
angular.module('trsSceModule', [])
    .filter("trsSce", ['$sce', function($sce) {
        return function(input) {
            if (angular.isDefined(input)) {
                input = $sce.trustAsHtml(input);
            }
            return input;
        };
    }])
    .filter("trsSceUrl", ["$sce", function($sce) {
        return function(input) {
            if (angular.isDefined(input)) {
                input = $sce.trustAsUrl(input);
            }
            return input;
        }
    }])
