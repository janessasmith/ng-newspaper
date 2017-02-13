'use strict';
angular.module("iWoFusionSignRouterModule",[])
.config(['$stateProvider',function($stateProvider) {
    $stateProvider.state("editctr.iWo.fusionSign",{
        url:"/fusionSign",
        views:{
            "main@editctr" : {
                templateUrl:"./editingCenter/iWo/fusionSign/fusionSign_tpl.html",
                controller:"iWoFusionSignCtrl"
            }
        }
    });
}]);
