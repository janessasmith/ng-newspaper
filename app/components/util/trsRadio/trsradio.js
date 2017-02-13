/**
 Created by zhyp on 2015/10/19. 切换开关
 html: <trs-radio ckstatus="open" ckcallback="test(!open)"></trs-radio>
       <trs-radio ckstatus="open2" ckdisabled="true"></trs-radio>
 description: ckstatus //选中状态
 			  ckcallback //回调函数 函数自己另外定义
 			  ckdisabled //true 禁止编辑 其他可编辑

**/
"use strict";
angular.module("util.trsRadio", []).directive("trsRadio", function() {
    return {
        restrict: "E",
        replace: false,
        templateUrl: "./components/util/trsRadio/trsradio.html",
        scope: {
            ckstatus: "=",
            ckcallback: "&",
            ckdisabled: "=",
            ckstyle: "@",
            cklabel: "@",
            ckname: "@"
        },
        controller: function($scope) {

        },
        link: function(scope, element, attrs, controller) {
            if (typeof scope.ckstatus === "undefined") {
                scope.ckstatus = false;
            }
            scope.ckstyle = scope.ckstyle || "";
            scope.cklabel = scope.cklabel || "";
            scope.ckname = scope.ckname || "";
            if (scope.ckdisabled) {
                return false;
            }
            scope.swtichBtn = function() {
                scope.ckcallback();
            };
        }
    };
});
