// "use strict";
// angular.module('iWoReceivedManuscriptRouterModule', [])
// .config(['$stateProvider',function($stateProvider) {
// 	$stateProvider.state('editctr.iWo.receivedManuscript',{
// 		url:"/receivedManuscript",
// 		views:{
// 			"main@editctr.iWo" : {
//                 templateUrl:"./editingCenter/iWo/myManuscript/receivedManuscript/received_manuscript_tpl.html",
//                 controller:"iWoReceivedManuscriptCtrl"
//             }
// 		}
// 	});	
// }]);
"use strict";
angular.module('iWoReceivedManuscriptRouterModule', [])
.config(['$stateProvider',function($stateProvider) {
	$stateProvider.state('editctr.iWo.receivedManuscript',{
		url:"/receivedManuscript",
		views:{
			"main@editctr" : {
                templateUrl:"./editingCenter/iWo/myManuscript/receivedManuscript/received_manuscript_tpl.html",
                controller:"iWoReceivedManuscriptCtrl"
            }
		}
	});	
}]);

