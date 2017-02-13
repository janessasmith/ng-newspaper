"use strict";
/*
    Create By CC 2015-12-12
*/
/*
    功能：替换通用的分页左侧显示
    使用方法：<trs-pagenation-left pageCount="xxx" callback="xxx" newPagesize="xxx" isSelectPagecount="xxxx"></trs-pagenation-left>
    pageCount:传入值为父控制器的分页参数，用于展示
    callback:父控制器的回掉函数
    newPagesize:更新后的单页展示数
    isSelectPagecount:是否开启选择分页数功能
 */
angular.module('trsPagenationWithPageCountModule', []).
directive('trsPagenationwithPagecount', ["$timeout", "initSingleSelecet", function($timeout, initSingleSelecet) {
    return {
        restrict: 'EA',
        templateUrl: "./components/util/trsPagenationConfig/trsPagenationWithPageCount.html",
        scope: {
            pageCount: "=",
            totalNum: "=",
            pageSize: "="
        },
        link: function(scope, iElement, iAttrs) {
            if (angular.isUndefined(scope.pageCount)) {
                scope.pageCount = {
                    'ITEMCOUNT': 0
                };
            }
        }
    };
}]);
