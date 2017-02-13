"use strict";
angular.module("websiteSignedRouterModule", [
        'editWebsiteCancelDraftMgrRouterModule'
    ])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("editctr.website.signed", {
            url: "/signed?channelid",
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/website/signed/main_tpl.html",
                    controller: "websiteSignedCtrl"
                }
            }
        }).state("editctr.website.signed.batchGeneratingNews", {
            url: "/batchgeneratingnews",
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/website/signed/batchGeneratingNews/batchGeneratingNews_tpl.html",
                    controller: "batchGeneratingCtrl"
                }
            }
        }).state("editctr.website.signed.batchMoveNews", {
            url: "/batchmovenews",
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/website/signed/batchMoveNews/batchMoveNews_tpl.html",
                    controller: "batchMoveNewsCtrl"
                }
            }
        });
    }]);
