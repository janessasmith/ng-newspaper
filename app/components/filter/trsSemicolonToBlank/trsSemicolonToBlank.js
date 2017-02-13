/**
* Author:XCL
* 
* Time:2016-03-19
*
* Description:将字符串中的分号转换成空格
*/
"use strict";
angular.module('trsSemicolonToBlankModule', []).filter("trsSemicolonToBlank",function(){
	return function(input){
		if(angular.isDefined(input)){
			input = input.split(";").join(" ");	
		}
		return input;
	};
});