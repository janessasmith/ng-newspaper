'use strict';
angular.module('productManageMentWebsiteModule', [
    'productManageMentWebsiteRouterModule',
    'productManageMentWebsiteChannelModule',
    'productManageMentWebsiteColumnModule',
    //'productManageMentWebsiteDistributeConfigModule',
    'productManageMentWebsiteFragmentationModule',
    'productManageMentWebsiteManuscriptSourceModule',
    'productManageMentWebsiteParameterConfigModule',
    'manageProSiteModule',
    'productManageMentWebsiteTemplateModule',
    'productManageMentWebsiteServiceModule',
     'productManageMentWebsiteServiceModule',
     "editManuSourceModule",
    'proManaMentWebsiteFootModule'
     ]).
controller('websiteController', ['$scope', '$state', 'trsHttpService', 'trsconfirm', '$modal', '$stateParams', 'localStorageService', 'productMangageMentWebsiteService', function($scope, $state, trsHttpService, trsconfirm, $modal, $stateParams, localStorageService, productMangageMentWebsiteService) {
    //$state.go("manageconfig.productmanage.website.site");
}]);