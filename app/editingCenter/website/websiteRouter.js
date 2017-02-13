"use strict";
angular.module('editingCenterWebsiteRouterModule', []).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
    $urlRouterProvider) {
    $stateProvider.state('editctr.website', {
        url: '/website?siteid',
        views: {
            "website@editctr": {
                templateUrl: './editingCenter/website/left_tpl.html',
                controller: 'websiteLeftCtrl'
            }
        }
    }).state('editctr.website.signed.fragmentManagement', {
        url: '/fragmentmanagement?tempid&objectid&objecttype',
        views: {
            'main@editctr': {
                templateUrl: './editingCenter/website/fragmentManagement/fragmentManagement_tpl.html',
                controller: 'websiteFragmentManagementCtrl'
            }
        }
    }).state("editctr.website.visualize", {
        url: "/visualize?channelid",
        views: {
            "main@editctr": {
                templateUrl: "./editingCenter/website/visualize/visualize_tpl.html",
                controller: "websiteSignedVisualizeCtrl"
            }
        }
    });
}]);
