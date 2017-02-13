/*
	arr:数组
	attr:属性
	separator:分隔符
*/

"use strict";
angular.module('maroonServiceModule', [])
.factory('maroonService', ['', function(){
	return {
		maroonString:function(arr,attr,separator){
			var mstr = "";
			angular.forEach(arr,function(value,index){	
				mstr += value[attr] + separator;
			});
			return mstr;
		}
	};
}]);