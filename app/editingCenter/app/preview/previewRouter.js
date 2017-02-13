/**
 * Author:XCL
 *
 * Time:2015-11-23
 */
"use strict";
angular.module('appPreviewRouterModule', [
        'appPreviewModule',
    ]).config(['$stateProvider', function($stateProvider) {
       $stateProvider.state('appPreview', {
            url: '/apppreview?channelid&chnldocid&siteid&metadataid&platform&doctype',
            views: {
                '': {
                    templateUrl: "./editingCenter/app/preview/appPreview.html",
                    controller: "appPreviewCtrl"
                }
            }
        });
    }]);
