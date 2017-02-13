/**
 * Created by MRQ on 2016/1/7.
 */
"use strict";
angular.module('productManageMentWebsiteChannelRouterModule', []).
config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state("manageconfig.productmanage.website.channel.recyclebin", {
            url: '/recyclebin',
            views: {
                'main@manageconfig.productmanage.website': {
                    templateUrl: './manageConfig/productManageMent/website/channel/recycleBin/recycleBin_tpl.html',
                    controller: 'productManageMentWebsiteChannelRecycleBinCtrl'
                }
            }
        });
}]);
