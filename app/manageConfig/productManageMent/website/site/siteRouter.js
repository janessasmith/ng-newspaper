/**
 * Created by MRQ on 2016/1/7.
 */
"use strict";
angular.module('productManageMentWebsiteSiteRouterModule', []).
    config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.productmanage.website.site.recyclebin", {
            url: '/recyclebin',
            views: {
                'main@manageconfig.productmanage': {
                    templateUrl: './manageConfig/productManageMent/website/site/recycleBin/recycleBin_tpl.html',
                    controller: 'productManageMentWebsiteSiteRecycleBinCtrl'
                }
            }
        });
    }]);
