'use strict';
angular.module("newspaperSampleReviewRouterModule", [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("editctr.newspaper.sampleReview", {
            url: "/sampleReview?paperid&oprtime",
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/newspaper/sampleReview/sampleReview_tpl.html",
                    controller: "newspaperSampleReviewCtrl"
                }
            }
        }).state("newspapersampledetail", {
            url: "/sampledetail?composeId",
            views: {
                "": {
                    templateUrl: "./editingCenter/newspaper/sampleReview/sampleDetail/sampleDetail_tpl.html",
                    controller: "editCenNewspaperSampleDetailCtrl"
                }
            }
        });
    }]);
