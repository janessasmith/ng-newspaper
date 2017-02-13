'use strict';
angular.module("iWoFusionPendingRouterModule",[])
.config(['$stateProvider',function($stateProvider) {
    $stateProvider.state("editctr.iWo.fusionPending",{
        url:"/fusionPending",
        views:{
            "main@editctr" : {
                templateUrl:"./editingCenter/iWo/fusionPending/fusionPending_tpl.html",
                controller:"fusionPendingCtrl"
            }
        }
    });
}]);