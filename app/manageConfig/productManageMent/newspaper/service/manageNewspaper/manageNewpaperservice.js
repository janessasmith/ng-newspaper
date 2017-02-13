"use strict";
angular.module('manageconfigManageNewsServiceModule', [])
    .service('manmageNewsparerService', ["$modal", "$q", function($modal, $q) {
        return {
            manageNews: function(selectedItem, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/manageNewspaper/manageNewspaper_tpl.html",
                    windowClass: 'manageNews',
                    backdrop: false,
                    resolve: {
                        selectedItem: function() {
                            return selectedItem;
                        }
                    },
                    controller: "manageNewsCtrl"
                });
                modalInstance.result.then(function(result) {
                    if (result === "success") {
                        success();            
                    }
                });
            }
        };
    }]);
