"use strict";
/*
    Create By CC 2015-12-12
*/
/*
    功能：替换通用的分页左侧显示
    使用方法：<trs-pagenation-left pageCount="xxx" callback="xxx" newPagesize="xxx" isSelectPagecount="xxxx"></trs-pagenation-left>
    pageCount:传入值为父控制器的分页参数，用于展示
    callback:父控制器的回掉函数
    isSelectPagecount:是否开启选择分页数功能
 */
angular.module('trsPagenationConfigLeftModule', []).
directive('trsPagenationLeft', ["$filter", "$timeout", "initSingleSelecet", function($filter, $timeout, initSingleSelecet) {
    return {
        restrict: 'EA',
        templateUrl: "./components/util/trsPagenationConfig/trsPagenationConfigLeft.html",
        scope: {
            pageCount: "=",
            /*分页对象 包括单页显示 总页数 当前页和总条数*/
            callback: "&",
            isSelectPagecount: "=",
        },
        link: function(scope, iElement, iAttrs) {

            if (angular.isUndefined(scope.pageCount)) {
                scope.pageCount = {
                    'ITEMCOUNT': 0,
                    "PAGESIZE": 20,
                };
            }
            if (scope.isSelectPagecount) {
                scope.pageCountJsons = initSingleSelecet.getPageCount();
                scope.selectOption = {
                    name: scope.pageCount.PAGESIZE,
                    value: scope.pageCount.PAGESIZE
                };
                scope.queryByPageSize = function() {
                    $timeout(function() {
                        scope.pageCount.CURRPAGE = "1";
                        scope.pageCount.PAGESIZE = scope.selectOption.value;
                        scope.callback();
                    });
                };
            }
        }
    };
}]);
