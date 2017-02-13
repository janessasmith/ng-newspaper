'use strict';
/**
 *  Module   策划中心详情页路由
 *  createBY
 * Description
 */
angular.module('planDetailRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('plancenterdetail', {
            url: "/plan/plancenterdetail?serviceid&guid&mid&modelid&title&serserved",
            views: {
                '': {
                    templateUrl: './planningCenter/planDetail/detailMain_tpl.html'
                },
                'head@plancenterdetail': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'detailcontent@plancenterdetail': {
                    templateUrl: './planningCenter/cueSelectedTopic/cueMonitoring/detail/detail_tpl.html',
                    controller: 'planningCenterDetailController'
                },
                'detailfooter@plancenterdetail': {
                    templateUrl: './footer_tpl.html'
                }
            }
        });
}]);
