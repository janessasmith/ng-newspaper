/**
callback:回调函数；
options:选项数组；
selectedOption:选中的选项；
author by you 2015-12-10
**/
'use strict';
angular.module('util.trsSingleSelection', []).
directive('trsSingleSelect', ['$timeout', function($timeout) {
    return {
        scope: {
            callback: "&",
            options: "=",
            selectedOption: "=",
            namekey: "=",
            valuekey: "=",
            label: "@"
        },
        restrict: 'E',
        templateUrl: './components/util/trsDropDownList/trsSingleSelection.html',
        link: function(scope, iElm, iAttrs, controller) { 
            scope.setSelected = function(option) {
                scope.label = null;
                scope.selectedOption = option;
                $timeout(function() {
                    scope.callback();
                });
            };
        }
    };
}]);