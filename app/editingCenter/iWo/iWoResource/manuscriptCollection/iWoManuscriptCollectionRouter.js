'use strict';
angular.module('iWoManuscriptCollectionRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state("editctr.iWo.manuscriptCollection",{
		url:"/manuscriptCollection",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/iWo/iWoResource/manuscriptCollection/manuscriptCollection_tpl.html",
				controller:"iWoManuscriptCollectionCtrl"
			}
		}
	});
}]);