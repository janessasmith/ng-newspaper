'use strict';
angular.module("newspaperStandbyDraftRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("editctr.newspaper.standbyDraft", {
            url: "/standbyDraft?paperid&oprtime",
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/newspaper/standbyDraft/standbyDraft_tpl.html",
                    controller: 'newspaperStandbyDraftCtrl'
                }
            }
        });
    }]);
