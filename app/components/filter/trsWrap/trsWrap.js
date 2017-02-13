"use strict";
/**
 * trsTrustHtmlModule
 *
 * Description  信任HTML
 */
angular.module('trsWrapModule', []).
filter("trsWrap", function() {
    return function(text) {
        var htmlText = text;
        htmlText = htmlText.replace(/\r\n/g, '<br/>');
        htmlText = htmlText.replace(/\n/g, '<br/>');
        return htmlText;
    };
});
