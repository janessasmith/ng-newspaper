/*
    Create by BaiZhiming 2015-12-25
*/
"use strict";
angular.module("fragmentationMgeServiceModule", ["createFragmentModule","copyUrlModule"])
    .factory("fragmentationMgeService", ["$modal", function($modal) {
        return {
            createOrEditFragment: function(widgetId, operName, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/fragment/template/createOrEditFragment_tpl.html",
                    windowClass: 'website_fra_new',
                    backdrop: false,
                    controller: "createFragmentCtrl",
                    resolve: {
                        widgetParams: function() {
                            return {
                                widgetId: widgetId,
                                operName: operName
                            };
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            copyUrl: function(url) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/fragment/template/copyUrl_tpl.html",
                    windowClass: 'toBeCompiled-review-window',
                    backdrop: false,
                    controller: "copyUrlCtrl",
                    resolve: {
                        copyParams: function() {
                            return {
                                url:url
                            };
                        }
                    }
                });
            }
        };
    }]);
