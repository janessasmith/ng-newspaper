"use strict";
angular.module('weiXinRecycleRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('editctr.weixin.recycle', {
        url: "/recycle?channelid",
        views: {
            'main@editctr': {
                templateUrl: './editingCenter/weixin/recycle/recycle_tpl.html',
                controller: 'weiXinRecycleCtrl'
            }
        }
    });
}]);
