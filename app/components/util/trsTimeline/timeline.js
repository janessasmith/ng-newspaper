"use strict";
angular.module("util.trsTimeline", ['trsDateUtilModule']).directive("trsTimeline", function() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            title: "="
        },
        template: "<div class='m_timeline'><div class='time_tick' ng-if='title'><h5 class='clock'>{{title}}</h5></div><div class='time_bd' ng-transclude></div></div>",
        link: function() {

        }
    };
}).directive("timegroup", function() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            tick: "="
        },
        template: "<div class='time_group'><div class='time_tick'><h5 class='circle'>{{tick |trsToday| date:'yyyy-MM-dd'}}</h5></div><div ng-transclude></div></div>",
        link: function(scope) {
            scope.tick = new Date(scope.tick);
        }
    };
}).directive("timeitem", function($filter) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            tick: "="
        },
        transclude: true,
        template: "<div class='time_item'><div class='time_tick'><span class='circle2'>{{tick | date:'HH:mm:ss'}}</span></div><div class='time_item_cnt' ng-transclude></div></div>",
        link: function(scope) {
            if (angular.isString(scope.tick)) {
                scope.tick = scope.tick.replace(/-/g, '/');
                scope.tick = new Date(scope.tick);
            }
        }
    };
});
