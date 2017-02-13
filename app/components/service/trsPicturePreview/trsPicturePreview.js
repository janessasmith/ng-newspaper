/**
 * Author:XCL
 *
 * Time:2016-04-08
 */
"use strict";
angular.module('trsPicturePreviewModule', [])
    .factory('trsPicturePreviewService', ['$modal', function($modal) {
        return {
            trsPicturePreview: function(curPicInfo) {
                return $modal.open({
                    templateUrl: "./components/service/trsPicturePreview/trsPicturePreview_tpl.html",
                    windowClass: "trs-picture-preview-class",
                    controller: "trsPicturePreviewCtrl",
                    resolve: {
                        curPicInfo: function() {
                            return curPicInfo;
                        }
                    }
                });
            }
        };
    }])
    .controller('trsPicturePreviewCtrl', ['$scope', '$modalInstance', 'curPicInfo', function($scope, $modalInstance, curPicInfo) {
        $scope.previewPicInfo = curPicInfo;

        //关闭
        $scope.close = function() {
            $modalInstance.close();
        };
    }]);
