"use strict";
angular.module('newspaperManageRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("manageconfig.productmanage.newspaper.newspaperOrder", {
        url: '/newspaperOrder?paper',
        views: {
            'main@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/newspaper/newspaperOrder/newspaperOrder_tpl.html',
                controller: 'newspaperOrderCtrl'
            }
        }
    }).state("manageconfig.productmanage.newspaper.editlayout", {
        url: '/editlayout?paper',
        views: {
            'main@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/newspaper/editLayoutManage/editLayoutManage_tpl.html',
                controller: 'editLayoutManageCtrl'
            }
        }
    }).state("manageconfig.productmanage.newspaper.typesettingpage", {
        url: '/typesettingpagepage?paper',
        views: {
            'main@manageconfig.productmanage': {
                templateUrl: './manageConfig/productManageMent/newspaper/typesettingPageManage/typesettingPageManage_tpl.html',
                controller: 'typesettingpagePageManageCtrl'
            }
        }
    });
}]);
