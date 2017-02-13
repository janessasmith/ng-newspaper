'use strict';
angular.module("newspaperTodaysDraftRouterModule",[])
    .config(['$stateProvider',function($stateProvider) {
        $stateProvider.state("editctr.newspaper.todaysDraft",{
            url:"/todaysDraft?paperid&oprtime",
            views:{
                "main@editctr" : {
                    templateUrl:"./editingCenter/newspaper/todaysDraft/todaysDraft_tpl.html",
                    controller:"newspaperTodaysDraftCtrl"
                }
            }
        });
    }]);