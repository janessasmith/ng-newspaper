'use strict';
/** creatyBy LiangY
 *   Module  幻灯片模板
 *
 * Description
 */
angular.module('util.trsSliderModule', ['util.trsDownloadOriginalPicModule']).directive('trsSlider', ['$timeout', "$window", function($timeout, $window) {
    // Runs during compile
    return {
        replace: false,
        scope: {
            sliderPic: "=",
        },
        restrict: "AE",
        templateUrl: "./components/util/trsSlider/slider_tpl.html",
        link: function(scope, iElm, iAttrs, controller) {
            $timeout(function() {
                scope.len = scope.sliderPic.length;
            }, 500);
            scope.convertFormat = function(APPDESC) {
                return APPDESC.replace(/\n/g, "<br/>");
            };
            scope.openOriginalPic = function(url) {
                $window.open(url);
            }
        }
    };
}]);
