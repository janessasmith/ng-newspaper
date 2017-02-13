"use strict";
/*
    Created By cc  2015-12-18
    权限按钮过滤
 */
angular.module('editctrFilterBtnModule', []).factory('filterEditctrBtnsService', ['trsHttpService', '$q', function(trsHttpService, $q) {
    return {
        filterBtn: function(initBtnArrays, dictionaryArrays) {
            var i = 0;
            var deferred = $q.defer();
            var arrayBtn = [];
            while (i < dictionaryArrays.length) {
                angular.forEach(initBtnArrays, function(value, key) {
                    if (value.OPERDESC === dictionaryArrays[i].OPERDESC) {
                        arrayBtn.push(dictionaryArrays[i]);
                    }
                });
                i++;

            }
            return arrayBtn;
        }
    };
}]);
