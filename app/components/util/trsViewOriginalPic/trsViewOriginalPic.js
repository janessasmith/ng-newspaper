/*create by ma.rongin 2016.4.9*/
angular.module('util.trsViewOriginalPic', [])
    .directive('trsViewOriginalPic', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                $(iElm).css({
                    "cursor": "pointer"
                })
                iElm.delegate("img", "click", function(event) {
                    $window.open(event.target.src);
                })
            }
        };
    }]);
