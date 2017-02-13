'use strict';
angular.module("newspaperSignedDraftRouterModule",[])
    .config(['$stateProvider',function($stateProvider) {
        $stateProvider.state("editctr.newspaper.signedDraft",{
            url:"/signedDraft?paperid&iszhaopai",
            views:{
                "main@editctr" : {
                    templateUrl:"./editingCenter/newspaper/signedDraft/signedDraft_tpl.html",
                    controller:"newspaperSignedDraftCtrl"
                }
            }
        });
    }]);