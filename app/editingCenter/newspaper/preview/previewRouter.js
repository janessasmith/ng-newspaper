/**
 * Author:XCL
 *
 * Time:2016-01-14
 * newspapertype:表示报纸类型:0-待用稿,
 *                            1-今日稿,
 *                            2-上版稿,
 *                            3-已签稿,
 *                            4-待用稿
 *                            
 */
"use strict";
angular.module('editingCenterNewspaperPreviewRouterModule', [])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state("newspaperNewsPreview", {
                url: "/newspaperNewsPreview?metadata&chnlid&paperid&newspapertype&doctype",
                views: {
                    "": {
                        templateUrl: "./editingCenter/newspaper/preview/preview_tpl.html",
                        controller: "newspaperPreviewCtrl"
                    }
                }
            });
    }]);
