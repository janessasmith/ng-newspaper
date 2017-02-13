"use strict";
angular.module('uitil.trsPinyinModule', []).
factory('trsPinyinService', [function() {

    return {
        getFullChars: function(value) {
            require(["pinyin"], function(Pinyin) {
                console.log(Pinyin);
            });
        },
        getCamelChars: function(value) {}
    };

}]);
