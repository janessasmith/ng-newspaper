'use strict';
angular.module('editingCenterAppRouterModule', [])
    .
config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
    $urlRouterProvider) {
    $stateProvider.state('editctr.app', {
        url: '/app?siteid',
        views: {
            'app@editctr': {
                templateUrl: './editingCenter/app/left_tpl.html',
                controller: 'appLeftCtrl'
            }
        }
    });
}]);
