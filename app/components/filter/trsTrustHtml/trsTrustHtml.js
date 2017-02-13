"use strict";
/**
 * trsTrustHtmlModule
 *
 * Description  信任HTML
 */
angular.module('trsTrustHtmlModule', []).
filter("trsTrustHtml", ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
