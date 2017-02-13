'use strict';
/**
 *  Module  iWo点击标题预览
 *  Ly  
 * Description
 */
angular.module('iWoPreveiwRouterModule', [
    "iWoPreviewModule"
]).config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state("iwopreview", {
            url: "/iwopreview?channelid&chnldocid&siteid&metadataid&modalname&doccollectrelid&type",
            views: {
                "": {
                    templateUrl: "./editingCenter/iWo/iWoPreview/iwoRreview.html",
                    controller: "iWoPreviewCtrl"
                }
            }
        });
}]);
