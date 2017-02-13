"use strict";
/*
    Create By CC 2015-12-12
*/
/*
    使用：<trs-pagenation-right callback="" currpage=""></trs-pagenation-right>
    功能：替换通用的分页跳转到功能
    callback：父控制器的回调函数
    currpage：传入的当前页数
 */
angular.module('trsPagenationConfigRightModule', []).
directive('trsPagenationRight', ["$timeout", function($timeout) {
    return {
        restrict: 'EA',
        templateUrl: "./components/util/trsPagenationConfig/trsPagenationConfigRight.html",
        scope: {
            callback: "&",
            currpage: "=",
            page: "="
        },
        link: function(scope, iElement, iAttrs) {
            scope.jumpToPage = function(pagenum) {
                if (angular.isDefined(scope.page) && scope.page.PAGECOUNT > 1) {
                    scope.callback();
                }
            };
        }
    };
}]);
