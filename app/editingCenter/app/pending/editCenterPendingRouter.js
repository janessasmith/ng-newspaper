'use strict';
angular.module('editingCenterPendingRouterModule', ['editingCenterPendingTimingSignModule']).
config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('editctr.app.pending', {
        url: '/pending?channelid',
        views: {
            'main@editctr': {
                templateUrl: './editingCenter/app/pending/main_tpl.html',
                controller: 'editingCenterPendingController'
            }
        }
    }).state('editctr.app.pending.pendingtimingSign', {
        url: '/pendingtimingsign',
        views: {
            'main@editctr': {//由于不区分平台 故将待审平台的定时签发模块与待编平台公用
                templateUrl: './editingCenter/app/toBeCompiled/timingSign/timingSign_tpl.html',
                controller: 'editCompileTimingSignController'
                    // templateUrl: './editingCenter/app/pending/timingSign/timingSign_tpl.html',
                    // controller: 'editPendingTimingSignController'
            }
        }
    });
}]);
