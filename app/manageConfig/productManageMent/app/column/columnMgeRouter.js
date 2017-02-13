"use strict";
angular.module('productManageMentAppColumnRouterModule', []).
    config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.productmanage.app.column.recyclebin", {
            url: '/recyclebin',
            views: {
                'main@manageconfig.productmanage.app': {
                    templateUrl: './manageConfig/productManageMent/app/column/recycleBin/recycleBin_tpl.html',
                    controller: 'productManageMentAppColumnRecycleBinCtrl'
                }
            }
        });
    }]);
