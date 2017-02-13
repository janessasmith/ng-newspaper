/*Create by BaiZhiming*/
"use strict";
angular.module("util.JsonArrayToString", []).
factory("jsonArrayToStringService", function() {
    return {
        jsonArrayToString: function(json) {
            for (var obj in json) {
                if (json[obj] instanceof Array || json[obj] instanceof Object) {
                    json[obj] = JSON.stringify(json[obj]);
                }
            }
            return json;
        },
        clearEmptyObjects: function(array, property) { //通过判断数组中某个对象元素的某个属性的值是否为空，来删除该数组中的该对象。
            var i = 0;
            while (i < array.length) {
                if (array[i][property] === "") {
                    array.splice(i, 1);
                } else {
                    i++;
                }
            }
            return array;
        },
        /**
         * [deleteAttribute description]删除对象中多余的属性
         * @param  {[obj]} array    [description]对象集合
         * @param  {[attr]} property [description]要删除的属性
         * @return {[obj]}          [description]删除属性后的对象
         */
        deleteAttribute: function(array, property) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][property]) {
                    delete array[i][property];
                }
            }
            return array;
        },
    };
});
