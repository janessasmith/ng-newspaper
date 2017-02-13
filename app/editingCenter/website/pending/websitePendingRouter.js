'use strict';
angular.module("websitePendingRouterModule", []).
config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("editctr.website.pending", {
        url: "/pending?channelid",
        views: {
            "main@editctr": {
                templateUrl: "./editingCenter/website/pending/main_tpl.html",
                controller: "websitePendingCtrl"
            }
        }
    }).state('editctr.website.pending.cloud', {
        url: '/cloud?channelid',
        views: {
            'main@editctr': {
                templateUrl: './editingCenter/website/cloud/cloud_tpl.html',
                controller: 'websiteMlfCloudCtrl'
            }
        }
    }).state('editctr.website.pending.timingSign', {
        url: '/timingSign',
        views: {
            'main@editctr': {
                templateUrl: './editingCenter/website/pending/timingSign/timingSign_tpl.html',
                controller: 'editCompilePendingTimingSignController'
            }
        }
    });
}]);
