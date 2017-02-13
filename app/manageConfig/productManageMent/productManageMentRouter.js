"use strict";
angular.module('productManageMentRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("manageconfig.productmanage.newspaper", {
        url: '/newspaper?site',
        views: {
            'main@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/newspaper/newspaperManage_tpl.html',
                controller: 'newspaperManageCtrl'
            }
        }
    }).
    state("manageconfig.productmanage.website", {
        url: '/website?site?sitedesc',
        views: {
            'main@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/website/main_tpl.html',
                controller: 'websiteController'
            }
        }
    }).state("manageconfig.productmanage.app", {
        url: '/app?site',
        views: {
            'main@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/app/main_tpl.html',
                controller: 'productManagementAppCtrl'
            }
        }
    });
}]);
