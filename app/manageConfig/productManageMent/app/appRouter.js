"use strict";
angular.module('productManagementAppRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state("manageconfig.productmanage.app.site", {
                url: '/site',
                views: {
                    'main@manageconfig.productmanage.app': {
                        templateUrl: './manageConfig/productManageMent/app/site/site_tpl.html',
                        controller: 'manageProAppSiteController',
                    }
                }
            })
            .state("manageconfig.productmanage.app.channel", {
                url: '/channel?selectTab',
                views: {
                    'main@manageconfig.productmanage.app': {
                        templateUrl: './manageConfig/productManageMent/app/channel/channelMge_tpl.html',
                        controller: 'productManageMentAppChannelCtrl'
                    },
                    'footer@manageconfig.productmanage.app': {
                        templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                        controller: 'proMgrWebfooterRouterCtrl',
                    }
                }
            })
            .state("manageconfig.productmanage.app.column", {
                url: '/column?channel&selectTab&parentchnl',
                views: {
                    'main@manageconfig.productmanage.app': {
                        templateUrl: './manageConfig/productManageMent/app/column/columnMge_tpl.html',
                        controller: 'productManageMentAppColumnCtrl'
                    },
                    'footer@manageconfig.productmanage.app': {
                        templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                        controller: 'proMgrWebfooterRouterCtrl',
                    }
                }
            })
    }]);
