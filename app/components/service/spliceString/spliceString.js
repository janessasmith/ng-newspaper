/*
	Create by Baizhiming 2015-11-17
	参数说明
	array:传入数组
	attribute:需要拼接的属性名称
	symbol:分割符号
	enVCalue:枚举值
	type:类型
*/
"use strict";
angular.module("trsspliceStringModule", []).
factory("trsspliceString", [function() {
    var trsspliceTool= {
        spliceString: function(array, attribute, symbol, enVCalue, type) {
            var myString = "";
            angular.forEach(array, function(data, index, arrayC) {
                if (data[enVCalue] === type) {
                    myString += data[attribute] + symbol;
                }
            });
            myString = myString.substring(0, myString.length - symbol.length);
            return myString;
        },
        getArrayString: function(array, typename, symbol) {
            var arr = [];
            angular.forEach(array, function(n, i) {
                n[typename] && arr.push(n[typename]);
            });
            return arr.join(symbol);
        },
        filter: function(array, attribute, enVCalue, type) {
            var temp = [];
            angular.forEach(array, function(data, index, arrayC) {
                if (data[enVCalue] === type) {
                    temp.push(data[attribute]);
                }
            });
            return temp;
        },
        filterArr: function(array, attribute, enVCalue, type) {
            var temp = [];
            angular.forEach(array, function(data, index, arrayC) {
                if (data[enVCalue] === type) {
                    temp.push(data);
                }
            });
            return temp;
        },
        getValuesBykey: function(objArr, key) {
            var temp = [];
            angular.forEach(objArr, function(item,idx) { 
                temp.push(item[key]);
            });
            return temp;
        },
        where: function(arr, properties) {
            var temp = [];
            angular.forEach(arr, function(item,idx) {
                 if(trsspliceTool.predicate(item,properties)) temp.push(item);
            });
            return temp;
        },
        predicate:function(obj,properties){
            var flag=true;
            angular.forEach(properties, function(value,key) {
                if (value !== obj[key] || obj[key] === undefined) {
                    flag= false;
                }
            });
            return flag;
        }

    };

    return trsspliceTool;
}]);