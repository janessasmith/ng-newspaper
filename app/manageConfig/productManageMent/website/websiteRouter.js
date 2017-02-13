"use strict";
angular.module('productManageMentWebsiteRouterModule', [
    'productManageMentWebsiteSiteRouterModule',
    'productManageMentWebsiteChannelRouterModule',
    'productManageMentWebsiteColumnRouterModule'
]).
config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("manageconfig.productmanage.website.site", {
            url: '/site',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/site/site_tpl.html',
                    controller: 'manageProSiteController',
                }
            }
        })
        .state("manageconfig.productmanage.website.channel", {
            url: '/channel?selectTab',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/channel/channelMge_tpl.html',
                    controller: 'productManageMentWebsiteChannelCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        })
        .state("manageconfig.productmanage.website.column", {
            url: '/column?channel&selectTab&parentchnl',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/column/columnMge_tpl.html',
                    controller: 'productManageMentWebsiteColumnCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        })
        .state("manageconfig.productmanage.website.distributeconfig", {
            url: '/distributeconfig?channel&selectTab&parentchnl',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/distributeConfig/distributeConfig_tpl.html',
                    controller: 'productManageMentWebsiteDistributeConfigCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        })
        .state("manageconfig.productmanage.website.fragment", {
            url: '/fragment?channel&selectTab&parentchnl',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/fragment/fragmentationMge_tpl.html',
                    controller: 'productManageMentWebsiteFragmentationCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        })
        .state("manageconfig.productmanage.website.manuscriptsource", {
            url: '/manuscriptsource?selectTab',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/manuscriptSource/manuscriptSource_tpl.html',
                    controller: 'productManageMentWebsiteManuscriptSourceCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        })
        .state("manageconfig.productmanage.website.parameterconfig", {
            url: '/parameterconfig?selectTab',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/parameterConfig/parameterConfig_tpl.html',
                    controller: 'productManageMentWebsiteParameterConfigCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        })
        .state("manageconfig.productmanage.website.template", {
            url: '/template?channel&selectTab&parentchnl',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/template/templateMge_tpl.html',
                    controller: 'productManageMentWebsiteTemplateCtrl'
                },
                'footer@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/footRouter_tpl.html',
                    controller: 'proMgrWebfooterRouterCtrl',
                }
            }
        });
}]);
