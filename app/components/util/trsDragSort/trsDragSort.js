"use strict";
angular.module('util.dragsort', [])

.directive('dragContainer', [function() {
    return {
        restrict: 'EA',
        scope: {
            dragStart: '&',
            dragEnd: '&'
        },
        controller: function($scope, $element) {

        },
        link: function($scope, $element, $attrs) {

        }
    };
}]).directive('dragSource', [function() {
    return {
        restrct: 'EA',
        required: '',
        scope: {
            dragStart: '&',
            dragEnd: '&'
        },
        link: function($scope, $element, $attrs) {

            var dragContainer = $element.closest('[drag-container]');
            var dragRows = dragContainer.find('[drag-row]');

            var startX, startY;
            var dragging = false;
            $element.bind('mousedown', function(event) {
                startX = event.pageX;
                startY = event.pageY;
                console.log(startY);
                $(document).bind('mousemove', documentMouseMove);
                $(document).bind('mouseup', documentMouseUp);

            });

            function documentMouseMove(event) {
                var pageX = event.pageX;
                var pageY = event.pageY;
                if (Math.abs(pageY - startY) < 2) {
                    return;
                }
                if (!dragging) {
                    dragging = true;
                    dragStart(event);
                }
                drag(event);
            }

            function documentMouseUp(event) {
                dragEnd(event);
                $(document).unbind('mousemove', documentMouseMove);
                $(document).unbind('mouseup', documentMouseUp);
            }

            function dragStart(event) {
                ($scope.dargStart || angular.noop)(event);
            }

            function drag(event) {
                var pageX = event.pageX;
                var pageY = event.pageY;

                var currRow = $element.closest('[drag-row]')[0];

                for (var index = 0, length = dragRows.size(); index < length; index++) {
                    if (currRow == dragRows[index]) {
                        continue;
                    }

                    var position = $(dragRows[index]).position();
                    console.log("pageY < position.top:" + (pageY) + "<" + position.top);
                    if (pageY < position.top) {
                        currRow.parentNode.insertBefore(currRow, dragRows[index]);
                        break;
                    }
                }
            }

            function dragEnd(event) {
                ($scope.dargEnd || angular.noop)(event);
            }
        }
    };
}]);
