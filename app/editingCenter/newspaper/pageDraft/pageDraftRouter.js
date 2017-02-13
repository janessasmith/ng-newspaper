'use strict';
angular.module("newspaperPageDraftRouterModule",[])
    .config(['$stateProvider',function($stateProvider) {
    $stateProvider.state("editctr.newspaper.pageDraft",{
        url:"/pageDraft?paperid&iszhaopai",
        views:{
            "main@editctr" : {
                templateUrl:"./editingCenter/newspaper/pageDraft/pageDraft_tpl.html",
                controller:"newspaperPageDraftCtrl"
            }
        }
    });
}]);