/*create by ma.rongqin 2016.3.11*/
"use strict";
angular.module('util.trslistIcon', []).directive('trsListIcon', ['$sce', function($sce) {
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        replace: false,
        scope: {
            item: '=',
            doctype: '='
        },
        templateUrl: './components/util/trsListIcon/trsListIcon.html',
        link: function(scope, iElm, iAttrs, controller) {
            initStatus();

            function initStatus() {
                scope.status = {
                    icon: {
                        noVideo: '0',
                        noAudio: '0',
                        noPic: '0'
                    },
                    url: {
                        audioUrl: angular.isDefined(scope.item.METALOGOURL && scope.item.METALOGOURL.AUDIOLOGO) ? $sce.trustAsResourceUrl(scope.item.METALOGOURL.AUDIOLOGO) : "",
                        videoUrl: angular.isDefined(scope.item.METALOGOURL && scope.item.METALOGOURL.VIDEOLOGO) ? $sce.trustAsResourceUrl(scope.item.METALOGOURL.VIDEOLOGO) : ""
                    }
                };
            }
        }
    }
}]);