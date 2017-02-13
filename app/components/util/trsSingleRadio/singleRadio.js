/*
  Create by zhyp 2015-12-10
*/
"use strict";
angular.module("util.trsSingleRadio", []).directive("trsSingleRadio", function() {
    return {
        restrict: "E",
        replace: false,
        templateUrl: "./components/util/trsSingleRadio/singleRadio.html",
        scope: {
            group: "@",
            ischecked: "=",
            label: "@",
            imgurl: "@",
            callback: "&",
            disabled: "="
        },
        link: function(scope, element, attrs, controller) {
            scope.imgurl = scope.imgurl || null;
            scope.toggleStatus = function() {
                if (!scope.disabled) {
                    if (typeof scope.callback) {
                        scope.callback();
                    }
                }
            };
        }
    };
});
