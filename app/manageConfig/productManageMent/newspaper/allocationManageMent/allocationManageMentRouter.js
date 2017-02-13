'use strict';
/**
 *  Module  配置管理路由
 *  creatyBy Ly   2015-12-24
 * Description
 */
angular.module('allocationManageMentRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.productmanage.newspaper.allocation", {
            url: '/allocation?paper',
            views: {
                'main@manageconfig.productmanage': {
                    templateUrl: './manageConfig/productManageMent/newspaper/allocationManageMent/allocationManageMent_tpl.html',
                    controller: 'allocationManageMentCtrl'
                }
            }
        });

    }]);
