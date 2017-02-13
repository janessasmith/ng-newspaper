"use strict";
/**
*  Author:XCL
   Time:2015-12-05  
*/
angular.module('util.checkbox', []).directive("trsCheckbox", ["$timeout", function($timeout) {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            ischecked: "=",
            callback: "&",
            label: "@"
        },
        templateUrl: "./components/util/trsCheckbox/trsCheckbox.html",
        link: function(scope, elem, attrs, controller) {
            scope.toggleStatus = function($event) {
                $event.stopPropagation();
                $timeout(function() {
                    scope.callback();
                });
            };

            scope.$watch('ischecked', function(checked) {
                var $tr = elem.closest('tr');
                var $cbx = $tr.find('.regular-checkbox');
                if (!$cbx) {
                    return;
                }
                $tr[checked ? 'addClass' : 'removeClass']('selected-row');
            });
        }
    };
}]).directive("trsCheckboxOnce", ["$timeout", function($timeout) {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            ischecked: "=",
            callback: "&",
            label: "@"
        },
        templateUrl: "./components/util/trsCheckbox/trsCheckbox.html",
        link: function(scope, elem, attrs, controller) {
            scope.toggleStatus = function($event) {
                $event.stopPropagation();
                $timeout(function() {
                    scope.callback();
                });
            };
            scope.$watch('ischecked', function(checked) {
                var $tr = elem.closest('tr');
                var $cbx = $tr.find('.regular-checkbox');
                if (!$cbx) {
                    return;
                }
                $tr[checked ? 'addClass' : 'removeClass']('selected-row');
            });
            // watch();
        }
    };
}]);
