/**
 * Author:XCL
 * Time:2016-03-07
 * Description:数据大小过滤器，当数据大于count值时，显示为count+
 */
"use strict";
angular.module('trsDataCountsShortenModule', [])
    .filter("trsDataCountsShorten", function() {
        return function(input, count) {
            if (angular.isDefined(input)) {
                if (input > count) {
                    input = count + "+";
                }
                return input;
            }
        };
    });
