/*create by ma.rongqin 2016.3.1*/
'use strict';
angular.module('editIWoPersonalMaterialRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state("editctr.iWo.personalmaterial",{
		url:"/personalmaterial",
		views:{
			"main@editctr":{
				templateUrl:"./editingCenter/iWo/iWoResource/personalMaterial/personalMaterial_tpl.html",
				controller:"editIWoPersonalMaterialCtrl"
			}
		}
	});
}]);