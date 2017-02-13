'use strict';
/* created by you 2015
    使用方式：
    html:<trs-color-picker col-obj="item.titlecolor"></trs-color-picker>,
    css:位于oneImage.css中，
    js:所需参数：传入从json串中获得的titlecolor字段即可
*/
angular.module('util.colorPicker', []).
directive('trsColorPicker', ['$timeout', function($timeout) {
    return {
        restrict: 'EA',
        scope: {
            colObj: "=",
            colStyle: "="
        },
        reaplace: false,
        template: '<input type="text"/>',
        link: function(scope, element, attrs) {
            var pickEl = angular.element(element[0].children[0]);
            $timeout(function() {
                pickEl.spectrum({
                    color:scope.colObj||'#000000',
                    showInput: true,
                    change: function(selectedCol) {
                        selectedCol = selectedCol.toString();
                        $timeout(function() {
                            scope.colObj = selectedCol;
                        }, 100);
                    }
                });
            }, 200);

        }
    };
}]);
