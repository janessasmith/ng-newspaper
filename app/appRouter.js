"use strict";
angular.module('appRouterModule', [])
    .
config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
    $urlRouterProvider) {
   // $urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/editctr/iWo/personalManuscript');
}]);
