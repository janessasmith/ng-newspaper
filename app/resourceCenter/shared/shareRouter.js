"use strict";
angular.module('resCenterGXRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("resourcectrl.share.resource", {
        url: '/resource?nodeid&nodename&change',
        views: {
            'resource@resourcectrl.share': {
                templateUrl: './resourceCenter/shared/share_main_tpl.html',
                controller: 'resourceCenterSharedCtrl'
            }
        }
    }).state("resourcectrl.share.resource1", {
        url: '/resource1?nodeid&nodename&change&keywords&sort',
        views: {
            'resource@resourcectrl.share': {
                templateUrl: './resourceCenter/shared/regionalClassification/share_main_tpl.html',
                controller: 'oldResourceCenterSharedCtrl'
            }
        }
    }).state("resourcectrl.share.email", {
        url: '/email?nodeid&nodename&change',
        views: {
            'main@resourcectrl': {
                templateUrl: './resourceCenter/shared/email.html',
                controller: 'resourceCenterSharedMailCtrl'
            }
        }
    });
}]);
