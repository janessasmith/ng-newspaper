"use strict";
/**
 *  timeCueModule Module
 *
 * Description 策划中心 信息监控 实时线索
 * rebuild: SMG 2016-5-24
 */
angular.module('timeCueMainModule', [
        'timeCueModule',
        'timeCueRouterModule',
        'timeCueBrokeMonitorModule',
        'timeCueHistoryTodayModule',
        'timeCueRecentPolicyModule',
        'timeCueRecentWarningsModule',
        'timeCueRecentScheduleModule',
    ])
    .controller('timeCueMainController', ["$scope", function($scope) {

    }]);
