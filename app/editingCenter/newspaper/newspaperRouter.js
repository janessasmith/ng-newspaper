"use strict";
angular.module('editingCenterNewspaperRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("editctr.newspaper", {
        url: "/newspaper",
        views: {
            'newspaper@editctr': {
                templateUrl: './editingCenter/newspaper/left_tpl.html',
                controller: 'editNewspaperLeftCtrl'
            }
        }
    });
}]);
