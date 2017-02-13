"use strict";
angular.module('loginRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        views: {
            '': {
                templateUrl: './login/template/login_tpl.html',
                controller:"loginCtrl"
            }
        }
    });
}]);