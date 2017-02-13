/*create by ma.rongin 2016.3.9*/
angular.module('util.trsDrag'
, [])
    .directive('trsDrag', ['$document', function($document) {
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, element, attr, controller) {
                var startX = 0;
                var startY = 0;
                var x = 0;
                var y = 0;
                element.css({
                    position: "relative",
                    cursor: "move"
                });
                element.on('mousedown', function(event) {
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on("mousemove", mousemove);
                    $document.on("mouseup", mouseup);
                })

                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    element.css({
                        top: y + 'px',
                        left: x + 'px'
                    })
                }

                function mouseup(event) {
                    $document.off("mousemove", mousemove);
                    $document.off("mouseup", mouseup);
                }
            }
        };
    }]);
