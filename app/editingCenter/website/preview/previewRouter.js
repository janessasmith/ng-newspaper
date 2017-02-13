/**
 * Author:XCL
 *
 * Time:2015-12-23
 */
"use strict";
angular.module('websitePreviewRouterModule', [
        "websitePreviewModule"
    ])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state("websitePreviewAll", {
                url: "/websitepreview?channelid&chnldocid&siteid&metadataid&platform&typeid",
                views: {
                    "": {
                        templateUrl: "./editingCenter/website/preview/websitePreview.html",
                        controller: "websitePreviewCtrl"
                    }
                }
            });
    }]);
