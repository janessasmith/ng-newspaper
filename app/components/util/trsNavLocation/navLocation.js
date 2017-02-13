"use strict";
/*
    Create By Chenchen 2015-10-19
*/
/*
trsNavLocationModule:
主要功能：左右联动的面包屑导航
html: <trs-nav-location></trs-nav-location>,
css:位于edit_center_css.css中
js:无输入参数
 */
angular.module('trsNavLocationModule', ["trsLimitToModule"]).
directive('trsNavLocation', ['$location', "$q", 'trsHttpService', '$stateParams', '$state', '$timeout', function($location, $q, trsHttpService, $stateParams, $state, $timeout) {
    return {
        restrict: 'EA',
        templateUrl: "./components/util/trsNavLocation/navlocation_tpl.html",
        scope: {},
        replace: true,
        link: function(scope, iElement, iAttrs) {
            if (angular.isDefined($stateParams.channelid)) {
                initStatus();
                initData();
            }
            function requestData(way) {
                var defferd = $q.defer();
                trsHttpService.httpServer(way, scope.getChannelParams, "get").then(function(data) {
                    defferd.resolve(data);
                });
                return defferd.promise;
            }

            function initStatus() {
                scope.getChannelParams = {
                    "serviceid": "mlf_mediasite",
                    "methodname": "getChannelPath",
                    "ChannelId": $stateParams.channelid,
                    "Burster": ">"
                };
                scope.routes = [];
                scope.path = $location.path().split('/').pop();
            }

            function initData() {
                requestData(trsHttpService.getWCMRootUrl()).then(function(data) {
                    data = data.replace(/\"/g, "");
                    scope.CHANNEL = data.split(">");
                    requestData('./components/util/trsNavLocation/trsNavLocation.json').then(function(data) {
                        scope.CHANNEL.splice(1, 0, data[scope.path]);
                        var arrayChn = angular.copy(scope.CHANNEL);
                        if (arrayChn.length > 4) {
                            arrayChn.splice(1, arrayChn.length - 2);
                            arrayChn.splice(1, 0, "... ...");
                        }
                        angular.forEach(arrayChn, function(value, key) {
                            scope.routes.push({
                                'name': value
                            });
                        });
                    });
                });
            }
        }
    };
}]);
