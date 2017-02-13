"use strict";
/**
 * customMonitor Module
 *
 * Description 自定义监控路由
 * Author:BaiZhiming 2016-5-11
 */
angular.module('customMonitorModuleRouter', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state("plan.custommonitor.add", {
                url: '/add?id',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/customMonitor/add/addCustomMonitor_tpl.html',
                        controller: 'addCustomMonitorController'
                    }
                }
            }).state("plan.custommonitor.preview", {
                url: '/preview?id',
                views: {
                    'main@plan': {
                        templateUrl: './planningCenter/cueSelectedTopic/customMonitor/customPreview/customPreview_tpl.html',
                        controller: 'customPreviewController'
                    }
                }
            });
    }]);
