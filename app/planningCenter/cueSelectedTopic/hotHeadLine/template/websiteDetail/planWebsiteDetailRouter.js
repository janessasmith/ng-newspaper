'use strict';
/**
 *  Module   策划中心详情页路由
 *  createBY
 * Description
 */
angular.module('planWebsiteDetailRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('planwebsitedetail', {
            url: "/plan/planwebsitedetail?key",
            views: {
                '': {
                    templateUrl: './planningCenter/planDetail/detailMain_tpl.html'
                },
                'head@planwebsitedetail': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'detailcontent@planwebsitedetail': {
                    templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/detail/detail_tpl.html',
                    controller: 'planNetwrokDetailCtrl'
                },
                'detailfooter@planwebsitedetail': {
                    templateUrl: './footer_tpl.html'
                }
            }
        });
}]);
