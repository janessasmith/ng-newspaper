'use strict';

angular.module('trsDateUtilModule', []).
filter("trsToday",[function()
{
    return function(input)
    {
    	var now = new Date();
    	if(now.getFullYear()===input.getFullYear()&&now.getMonth()===input.getMonth())
    	{
    		switch(now.getDate()-input.getDate()) {
    			case 0:input = "今天";
    				break;
    			case 1:input = "昨天";
    				break;
    		}
    	}
    	return input;
    };
}]);