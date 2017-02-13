"use strict";
/**
* Author:XCL
*
* Time:2016-01-22
*
* Description:将正数或负数的字符串转换成number类型的正数
*/
angular.module('trsStrToAbsModule', [])
.filter("trsStrToAbs",[function(){
	return function(str,param){
		if(angular.isUndefined(param)){
			str = Math.abs(parseInt(str));
		}else{
			str=param;
		}
		return str;
	};
}]);