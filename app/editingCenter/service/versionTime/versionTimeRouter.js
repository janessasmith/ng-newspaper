/**
 * Created by ma.rongqin on 2016/2/22.
 */
"use strict";
angular.module('editingCenterPersonalPreviewModule', [])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state("editingCenterPersonalVersionTime", {
                url: "/editingcenterpersonalversiontime?objectversionid",
                views: {
                    "": {
                        templateUrl: "./editingCenter/service/versionTime/personalVersionTime/personalVersionTime.html",
                        controller: "editCenPersonalVersionTimeCtrl"
                    }
                }
            });
    }]);
