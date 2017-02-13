"use strict";
angular.module('maroonPrintModule', [])
.factory('maroonPrintService', ['$modal', function($modal){
	return {
		print:function(arrParam){
			var modalInstance = $modal.open({
				template:"<div></div>",
				windowClass:"printCtrl",
				controller:"maroonPrintCtrl",
				resolve:{
					arr:function(){
						return arrParam;
					}
				}
			});
		}
	};
}]);