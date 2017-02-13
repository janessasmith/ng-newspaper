'use strict';
angular.module("iWoXinHuaManuscriptRouterModule",[])
.config(['$stateProvider',function($stateProvider) {
    $stateProvider.state("editctr.iWo.xinHuaManuscript",{
        url:"/xinHuaManuscript",
        views:{
            "main@editctr" : {
                templateUrl:"./editingCenter/iWo/iWoResource/xinHuaManuscript/xinHuaManuscript_tpl.html",
                controller:"iWoXinHuaManuscriptCtrl"
            }
        }
    });
}]);