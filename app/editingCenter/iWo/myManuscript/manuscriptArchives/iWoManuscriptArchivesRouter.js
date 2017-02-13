"use strict";
angular.module('iWoManuscriptArchivesRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state('editctr.iWo.manuscriptArchives',{
		url:"/manuscriptArchives",
		views:{
			"main@editctr" : {
                templateUrl:"./editingCenter/iWo/myManuscript/manuscriptArchives/manuscript_archives_tpl.html",
                controller:'iWoManuscriptArchivesCtrl'
            }
		}
	});	
}]);