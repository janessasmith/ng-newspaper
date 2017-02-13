/**
 * Created by MRQ on 2016/1/7.
 */
"use strict";
angular.module('productManageMentWebsiteColumnRouterModule', []).
    config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.productmanage.website.column.recyclebin", {
            url: '/recyclebin',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/column/recycleBin/recycleBin_tpl.html',
                    controller: 'productManageMentWebsiteColumnRecycleBinCtrl'
                }
            }
        });
    }]);
