'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('folderfileUploadModule', ['flieUploadCtrlModule']).factory('newFileUpload', ['$modal', function($modal) {
    return {
        flieUpload: function(pathArray, templateOnly, currItems, callback) {
            var modal = $modal.open({
                templateUrl: "./editingCenter/website/cloud/service/fileUpload/fileUpload_tpl.html",
                windowClass: 'flie-upload',
                backdrop: false,
                controller: "flieUploadCtrl",
                resolve: {
                    pathArray: function() {
                        return {
                            "pathArray": pathArray,
                        };
                    },
                    templateOnly: function() {
                        return templateOnly;
                    },
                    currItems: function() {
                        return currItems;
                    },
                }
            });
            modal.result.then(function(result) {
                callback(result);
            });
        }
    };
}]);
