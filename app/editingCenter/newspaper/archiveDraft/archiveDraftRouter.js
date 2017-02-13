'use strict';
angular.module("newspaperArchiveDraftRouterModule", ["newspaperArchiveDraftModule"])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("editctr.newspaper.archiveDraft", {
            url: "/archiveDraft?paperid&iszhaopai",
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/newspaper/archiveDraft/archiveDraft_tpl.html",
                    controller: "newspaperArchiveDraftCtrl"
                }
            }
        });
    }]);
