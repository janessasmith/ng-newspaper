'use strict';
angular.module("iWoShareInventoryRouterModule",[])
.config(['$stateProvider',function($stateProvider) {
    $stateProvider.state("editctr.iWo.shareInventory",{
        url:"/shareInventory",
        views:{
            "main@editctr" : {
                templateUrl:"./editingCenter/iWo/iWoResource/shareInventory/shareInventory_tpl.html",
                controller:"iWoShareInventoryCtrl"
            }
        }
    });
}]);